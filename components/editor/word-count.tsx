'use client';

import { FileText, Clock, Type } from 'lucide-react';
import { useMemo } from 'react';

interface WordCountProps {
  content: string;
}

export function WordCount({ content }: WordCountProps) {
  const stats = useMemo(() => {
    // Remove HTML tags for accurate count
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = text.length;
    // Average reading speed: 200 words per minute
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return { wordCount, charCount, readingTime };
  }, [content]);

  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground animate-fade-in">
      <div className="flex items-center gap-2 hover:text-primary transition-colors">
        <Type className="w-4 h-4" />
        <span className="font-medium">{stats.wordCount}</span>
        <span>words</span>
      </div>
      
      <div className="flex items-center gap-2 hover:text-primary transition-colors">
        <FileText className="w-4 h-4" />
        <span className="font-medium">{stats.charCount}</span>
        <span>characters</span>
      </div>
      
      <div className="flex items-center gap-2 hover:text-accent transition-colors">
        <Clock className="w-4 h-4" />
        <span className="font-medium">{stats.readingTime}</span>
        <span>min read</span>
      </div>
    </div>
  );
}
