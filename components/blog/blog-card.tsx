import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Heart, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { createExcerpt } from '@/lib/utils/text';

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image_url?: string;
    reading_time: number;
    view_count: number;
    created_at: string;
    author: {
      username: string;
      full_name: string;
      avatar_url?: string;
    };
    tags?: Array<{ tag_name: string }>;
    likes_count?: number;
  };
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="group overflow-hidden hover-lift hover-glow border-border/50 transition-all duration-300">
      <Link href={`/blog/${blog.slug}`}>
        {/* Cover Image */}
        {blog.cover_image_url && (
          <div className="relative h-48 overflow-hidden bg-muted">
            <img
              src={blog.cover_image_url}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
            
            {/* Reading Time Badge */}
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-1.5 text-white text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              {blog.reading_time} min read
            </div>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag.tag_name} 
                  variant="secondary" 
                  className="text-xs font-medium hover:bg-primary/20 hover:text-primary transition-colors duration-200 cursor-pointer"
                >
                  #{tag.tag_name}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-tight">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {createExcerpt(blog.excerpt, 150)}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 pt-2">
            {blog.author.avatar_url ? (
              <img
                src={blog.author.avatar_url}
                alt={blog.author.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                <span className="text-sm font-semibold text-primary">
                  {blog.author.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{blog.author.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">
                @{blog.author.username}
              </p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
            <span className="flex items-center gap-1 hover:text-primary transition-colors">
              <Eye className="w-3.5 h-3.5" />
              {blog.view_count}
            </span>
            {blog.likes_count !== undefined && (
              <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
                <Heart className="w-3.5 h-3.5" />
                {blog.likes_count}
              </span>
            )}
            <span className="ml-auto text-xs">
              {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
