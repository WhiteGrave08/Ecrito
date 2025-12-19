'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';
import { createComment } from '@/app/actions/comment-actions';
import { useRouter } from 'next/navigation';

interface CommentFormProps {
  blogId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export function CommentForm({ blogId, parentId, onSuccess, onCancel, placeholder }: CommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    const result = await createComment(blogId, content, parentId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setContent('');
      setLoading(false);
      router.refresh();
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
        placeholder={placeholder || 'Write a comment...'}
        className="min-h-[100px] resize-none"
        disabled={loading}
      />
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !content.trim()}>
          {loading ? 'Posting...' : parentId ? 'Reply' : 'Comment'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
