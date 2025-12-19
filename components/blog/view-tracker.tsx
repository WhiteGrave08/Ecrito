'use client';

import { useEffect } from 'react';
import { incrementViewCount } from '@/app/actions/blog-actions';

export function ViewTracker({ blogId }: { blogId: string }) {
  useEffect(() => {
    incrementViewCount(blogId);
  }, [blogId]);

  return null;
}
