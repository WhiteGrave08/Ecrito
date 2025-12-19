'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  excerpt?: string;
}

export function BlogPreviewModal({
  isOpen,
  onClose,
  title,
  content,
  coverImage,
  tags,
  excerpt,
}: BlogPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl m-4">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Preview Content */}
        <article className="p-8">
          {/* Cover Image */}
          {coverImage && (
            <div className="relative h-64 rounded-xl overflow-hidden mb-6">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4">{title || 'Untitled Blog'}</h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-lg text-muted-foreground mb-6">{excerpt}</p>
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content || '<p>No content yet...</p>' }}
          />
        </article>
      </div>
    </div>
  );
}
