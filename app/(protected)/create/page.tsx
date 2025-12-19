'use client';

import { useState, Suspense, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBlog, updateBlog, uploadBlogImage } from '@/app/actions/blog-actions';
import { Loader2, Save, Send, Eye, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { BlogPreviewModal } from '@/components/blog/blog-preview-modal';
import { useAutoSave } from '@/hooks/use-auto-save';
import { WordCount } from '@/components/editor/word-count';

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

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const draftIdRef = useRef<string | null>(null);

  // Auto-save functionality
  const handleAutoSave = useCallback(async (data: any): Promise<{ error?: string }> => {
    const formData = new FormData();
    formData.append('title', data.title || 'Untitled Draft');
    formData.append('content', data.content);
    formData.append('excerpt', data.excerpt);
    formData.append('coverImageUrl', data.coverImage);
    formData.append('tags', JSON.stringify(data.tags));
    formData.append('published', 'false');

    try {
      // If we have a draft ID, update instead of create
      if (draftIdRef.current) {
        const result = await updateBlog(draftIdRef.current, formData);
        return { error: result?.error };
      } else {
        // For new drafts, we can't use createBlog because it redirects
        // So we'll just return success and not actually save
        // This is a limitation - we need a non-redirecting create action
        return {};
      }
    } catch (error) {
      return { error: 'Failed to save draft' };
    }
  }, []);

  // Update ref when draftId changes
  useEffect(() => {
    draftIdRef.current = draftId;
  }, [draftId]);

  const { status: autoSaveStatus } = useAutoSave({
    data: { title, content, excerpt, coverImage, tags },
    onSave: handleAutoSave,
    delay: 30000, // 30 seconds
    enabled: !!(title || content) && !!draftId, // Only enable if there's content AND a draft exists
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadBlogImage(formData);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.url!;
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await handleImageUpload(file);
      setCoverImage(url);
    } catch (error) {
      console.error('Failed to upload cover image:', error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (published: boolean) => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('excerpt', excerpt);
    formData.append('coverImageUrl', coverImage);
    formData.append('tags', JSON.stringify(tags));
    formData.append('published', published.toString());

    const result = await createBlog(formData);
    
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
    }
    // If successful, the action will redirect
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header with Auto-Save Status */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Create New Blog Post</h1>
            <p className="text-muted-foreground text-lg">Share your story with the world</p>
          </div>
          
          {/* Auto-Save Indicator */}
          <div className="flex items-center gap-2 text-sm">
            {autoSaveStatus === 'saving' && (
              <>
                <Clock className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Saving draft...</span>
              </>
            )}
            {autoSaveStatus === 'saved' && (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-500">Draft saved</span>
              </>
            )}
            {autoSaveStatus === 'error' && (
              <span className="text-destructive">Failed to save</span>
            )}
          </div>
        </div>

        <div className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-lg font-semibold">Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter your blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 text-2xl font-bold h-14"
          />
        </div>

        {/* Cover Image */}
        <div>
          <Label htmlFor="cover-image" className="text-lg font-semibold">Cover Image</Label>
          <div className="mt-2">
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Input
                id="cover-image"
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
              />
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <Label htmlFor="excerpt" className="text-lg font-semibold">Excerpt (Optional)</Label>
          <Input
            id="excerpt"
            type="text"
            placeholder="Brief description of your blog..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-2"
            maxLength={300}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {excerpt.length}/300 characters
          </p>
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags" className="text-lg font-semibold">Tags (Max 5)</Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="tags"
              type="text"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              disabled={tags.length >= 5}
            />
            <Button type="button" onClick={addTag} disabled={tags.length >= 5}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <Label className="text-lg font-semibold mb-2 block">Content</Label>
          <Suspense fallback={
            <div className="border border-border rounded-xl overflow-hidden bg-card p-8 text-center text-muted-foreground">
              Loading editor...
            </div>
          }>
            <TiptapEditor
              content={content}
              onChange={setContent}
              onImageUpload={handleImageUpload}
            />
          </Suspense>
          
          {/* Word Count Stats */}
          {content && (
            <div className="mt-4 p-4 glass-card">
              <WordCount content={content} />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(true)}
            disabled={!title || !content}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </>
            )}
          </Button>
          
          <Button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="btn-gradient"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Publish
              </>
            )}
          </Button>
        </div>
        </div>
      </div>

      {/* Preview Modal */}
      <BlogPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={title}
        content={content}
        coverImage={coverImage}
        tags={tags}
        excerpt={excerpt}
      />
    </div>
  );
}
