'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateBlog, uploadBlogImage, deleteBlog } from '@/app/actions/blog-actions';
import { Loader2, Save, Send, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Dynamically import TiptapEditor to avoid SSR issues
const TiptapEditor = dynamic(
  () => import('@/components/editor/tiptap-editor').then(mod => ({ default: mod.TiptapEditor })),
  { 
    ssr: false,
    loading: () => (
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <div className="p-8 text-center text-muted-foreground">
          Loading editor...
        </div>
      </div>
    )
  }
);

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [blogId, setBlogId] = useState('');
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadBlog();
  }, []);

  const loadBlog = async () => {
    const { id } = await params;
    setBlogId(id);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const { data: blog, error } = await supabase
      .from('blogs')
      .select(`
        *,
        tags:blog_tags(tag_name)
      `)
      .eq('id', id)
      .eq('author_id', user.id)
      .single();

    if (error || !blog) {
      alert('Blog not found or you do not have permission to edit it');
      router.push('/discover');
      return;
    }

    setTitle(blog.title);
    setContent(blog.content);
    setExcerpt(blog.excerpt || '');
    setCoverImage(blog.cover_image_url || '');
    setTags(blog.tags?.map((t: any) => t.tag_name) || []);
    setLoading(false);
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadBlogImage(formData);
    if (result.error) {
      alert(result.error);
    } else {
      setCoverImage(result.url!);
    }
    setUploading(false);
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput.toLowerCase())) {
      setTags([...tags, tagInput.toLowerCase()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('excerpt', excerpt);
    formData.append('coverImageUrl', coverImage);
    formData.append('tags', JSON.stringify(tags));
    formData.append('published', publish.toString());

    const result = await updateBlog(blogId, formData);
    
    if (result.error) {
      alert(result.error);
      setSaving(false);
    } else {
      if (publish) {
        router.push(`/blog/${result.slug}`);
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single();
        router.push(`/profile/${profile?.username}?tab=drafts`);
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    const result = await deleteBlog(blogId);
    
    if (result.error) {
      alert(result.error);
      setDeleting(false);
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      router.push(`/profile/${profile?.username}?tab=drafts`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Edit Blog</h1>
        <p className="text-muted-foreground">Update your blog post</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-lg font-semibold">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title..."
            className="mt-2 text-2xl font-bold h-14"
          />
        </div>

        {/* Cover Image */}
        <div>
          <Label htmlFor="cover" className="text-lg font-semibold">Cover Image</Label>
          <Input
            id="cover"
            type="file"
            accept="image/*"
            onChange={handleCoverImageUpload}
            disabled={uploading}
            className="mt-2"
          />
          {coverImage && (
            <img src={coverImage} alt="Cover" className="mt-4 rounded-lg max-h-64 object-cover" />
          )}
        </div>

        {/* Excerpt */}
        <div>
          <Label htmlFor="excerpt" className="text-lg font-semibold">Excerpt (Optional)</Label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description of your blog..."
            className="mt-2 w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
            maxLength={200}
          />
        </div>

        {/* Tags */}
        <div>
          <Label className="text-lg font-semibold">Tags</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag..."
            />
            <Button onClick={addTag} variant="outline">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-primary/20 rounded-full text-sm flex items-center gap-2">
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-destructive">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div>
          <Label className="text-lg font-semibold mb-2 block">Content</Label>
          <Suspense fallback={<div>Loading editor...</div>}>
            <TiptapEditor content={content} onChange={setContent} />
          </Suspense>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={saving || uploading || deleting}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>

            <Button
              className="btn-gradient"
              onClick={() => handleSave(true)}
              disabled={saving || uploading || deleting}
            >
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
