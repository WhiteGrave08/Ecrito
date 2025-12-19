'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createComment(blogId: string, content: string, parentId?: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  if (!content.trim()) {
    return { error: 'Comment cannot be empty' };
  }

  const commentData: any = {
    blog_id: blogId,
    user_id: user.id,
    content: content.trim(),
  };

  if (parentId) {
    commentData.parent_id = parentId;
  }

  const { data, error } = await supabase
    .from('comments')
    .insert(commentData)
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return { error: error.message };
  }

  revalidatePath('/blog/[slug]', 'page');
  return { success: true, comment: data };
}

export async function updateComment(commentId: string, content: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  if (!content.trim()) {
    return { error: 'Comment cannot be empty' };
  }

  const { data, error } = await supabase
    .from('comments')
    .update({ content: content.trim() })
    .eq('id', commentId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating comment:', error);
    return { error: error.message };
  }

  revalidatePath('/blog/[slug]', 'page');
  return { success: true, comment: data };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting comment:', error);
    return { error: error.message };
  }

  revalidatePath('/blog/[slug]', 'page');
  return { success: true };
}
