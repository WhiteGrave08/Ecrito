'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Heart, Clock, Edit, Trash2, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteBlog, publishBlog } from '@/app/actions/blog-actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DraftBlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image_url?: string;
    reading_time: number;
    created_at: string;
    tags?: Array<{ tag_name: string }>;
  };
}

export function DraftBlogCard({ blog }: DraftBlogCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this draft?')) return;

    setIsDeleting(true);
    const result = await deleteBlog(blog.id);
    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
    } else {
      router.refresh();
    }
  };

  const handlePublish = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm('Publish this blog?')) return;

    setIsPublishing(true);
    const result = await publishBlog(blog.id);
    if (result.error) {
      alert(result.error);
      setIsPublishing(false);
    } else {
      router.push(`/blog/${result.slug}`);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/50">
      <div className="relative">
        {/* Cover Image */}
        {blog.cover_image_url && (
          <div className="relative h-48 overflow-hidden bg-muted">
            <img
              src={blog.cover_image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.tag_name} variant="secondary" className="text-xs font-medium">
                  {tag.tag_name}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold line-clamp-2 leading-tight">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {blog.reading_time} min
            </span>
            <span className="ml-auto">
              {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              asChild
              variant="outline"
              className="flex-1"
            >
              <Link href={`/edit/${blog.id}`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
            
            <Button
              variant="default"
              className="flex-1 btn-gradient"
              onClick={handlePublish}
              disabled={isPublishing || isDeleting}
            >
              <Send className="w-4 h-4 mr-2" />
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
            
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting || isPublishing}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
