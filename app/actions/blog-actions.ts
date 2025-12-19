'use server';

import { createClient } from '@/lib/supabase/server';
import { generateUniqueSlug } from '@/lib/utils/slug';
import { calculateReadingTime } from '@/lib/utils/reading-time';
import { blogSchema, blogUpdateSchema } from '@/lib/validations/blog';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function incrementViewCount(blogId: string) {
  const cookieStore = await cookies();
  const viewCookie = `viewed_blog_${blogId}`;

  if (cookieStore.has(viewCookie)) {
    return;
  }

  const supabase = await createClient();
  
  // Use RPC for atomic increment
  const { error } = await supabase.rpc('increment_blog_view', { blog_id: blogId });
  
  // Fallback if RPC doesn't exist (optional, but good for safety until SQL is run)
  if (error) {
    console.error('RPC increment_blog_view failed, falling back to update:', error);
    // Note: This fallback is less safe for concurrency but works if user hasn't run SQL yet
    const { data: blog } = await supabase.from('blogs').select('view_count').eq('id', blogId).single();
    if (blog) {
      await supabase.from('blogs').update({ view_count: blog.view_count + 1 }).eq('id', blogId);
    }
  }

  // Set cookie for 24 hours
  cookieStore.set(viewCookie, 'true', {
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  // Revalidate paths to show updated view count
  const { data: blog } = await supabase.from('blogs').select('slug, author_id').eq('id', blogId).single();
  if (blog) {
    revalidatePath(`/blog/${blog.slug}`);
    
    // Get author username for profile revalidation
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', blog.author_id).single();
    if (profile) {
      revalidatePath(`/profile/${profile.username}`);
    }
  }
}

export async function createBlog(formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'Unauthorized' };
  }

  // Parse and validate form data
  const data = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    excerpt: formData.get('excerpt') as string || '',
    coverImageUrl: formData.get('coverImageUrl') as string || '',
    tags: JSON.parse(formData.get('tags') as string || '[]'),
    published: formData.get('published') === 'true',
  };

  const validation = blogSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const validated = validation.data;

  // Generate slug and calculate reading time
  const slug = generateUniqueSlug(validated.title);
  const readingTime = calculateReadingTime(validated.content);

  // Create blog post
  const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .insert({
      author_id: user.id,
      title: validated.title,
      slug,
      content: validated.content,
      excerpt: validated.excerpt || validated.content.substring(0, 200),
      cover_image_url: validated.coverImageUrl,
      published: validated.published,
      published_at: validated.published ? new Date().toISOString() : null,
      reading_time: readingTime,
    })
    .select()
    .single();

  if (blogError) {
    return { error: blogError.message };
  }

  // Add tags if provided
  if (validated.tags && validated.tags.length > 0) {
    const tagInserts = validated.tags.map(tag => ({
      blog_id: blog.id,
      tag_name: tag.toLowerCase(),
    }));

    await supabase.from('blog_tags').insert(tagInserts);
  }

  revalidatePath('/discover');
  revalidatePath('/profile');
  
  if (validated.published) {
    redirect(`/blog/${slug}`);
  } else {
    // Get user's username for profile redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();
    
    redirect(`/profile/${profile?.username}?tab=drafts`);
  }
}

export async function updateBlog(blogId: string, formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'Unauthorized' };
  }

  // Verify ownership
  const { data: existingBlog, error: fetchError } = await supabase
    .from('blogs')
    .select('author_id, slug')
    .eq('id', blogId)
    .single();

  if (fetchError || !existingBlog) {
    return { error: 'Blog not found' };
  }

  if (existingBlog.author_id !== user.id) {
    return { error: 'Unauthorized' };
  }

  // Parse and validate form data
  const data = {
    id: blogId,
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    excerpt: formData.get('excerpt') as string || '',
    coverImageUrl: formData.get('coverImageUrl') as string || '',
    tags: JSON.parse(formData.get('tags') as string || '[]'),
    published: formData.get('published') === 'true',
  };

  const validation = blogUpdateSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const validated = validation.data;

  // Update blog post
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (validated.title) {
    updateData.title = validated.title;
    updateData.slug = generateUniqueSlug(validated.title);
  }
  if (validated.content) {
    updateData.content = validated.content;
    updateData.reading_time = calculateReadingTime(validated.content);
  }
  if (validated.excerpt !== undefined) updateData.excerpt = validated.excerpt;
  if (validated.coverImageUrl !== undefined) updateData.cover_image_url = validated.coverImageUrl;
  if (validated.published !== undefined) {
    updateData.published = validated.published;
    if (validated.published && !existingBlog) {
      updateData.published_at = new Date().toISOString();
    }
  }

  const { error: updateError } = await supabase
    .from('blogs')
    .update(updateData)
    .eq('id', blogId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Update tags
  if (validated.tags) {
    // Delete existing tags
    await supabase.from('blog_tags').delete().eq('blog_id', blogId);

    // Insert new tags
    if (validated.tags.length > 0) {
      const tagInserts = validated.tags.map(tag => ({
        blog_id: blogId,
        tag_name: tag.toLowerCase(),
      }));

      await supabase.from('blog_tags').insert(tagInserts);
    }
  }

  revalidatePath('/discover');
  revalidatePath('/profile');
  revalidatePath(`/blog/${existingBlog.slug}`);
  
  return { success: true, slug: updateData.slug || existingBlog.slug };
}

export async function deleteBlog(blogId: string) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'Unauthorized' };
  }

  // Verify ownership
  const { data: existingBlog, error: fetchError } = await supabase
    .from('blogs')
    .select('author_id')
    .eq('id', blogId)
    .single();

  if (fetchError || !existingBlog) {
    return { error: 'Blog not found' };
  }

  if (existingBlog.author_id !== user.id) {
    return { error: 'Unauthorized' };
  }

  // Delete blog (tags will be deleted via CASCADE)
  const { error: deleteError } = await supabase
    .from('blogs')
    .delete()
    .eq('id', blogId);

  if (deleteError) {
    return { error: deleteError.message };
  }

  revalidatePath('/discover');
  revalidatePath('/profile');
  
  return { success: true };
}

export async function publishBlog(blogId: string) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'Unauthorized' };
  }

  // Verify ownership and update
  const { data, error } = await supabase
    .from('blogs')
    .update({
      published: true,
      published_at: new Date().toISOString(),
    })
    .eq('id', blogId)
    .eq('author_id', user.id)
    .select('slug')
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/discover');
  revalidatePath(`/blog/${data.slug}`);
  
  return { success: true, slug: data.slug };
}

export async function uploadBlogImage(formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'Unauthorized' };
  }

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided' };
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { error: 'File must be an image' };
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'File size must be less than 5MB' };
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return { error: error.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(data.path);

  return { success: true, url: publicUrl };
}
