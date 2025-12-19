'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { bookmarkBlog } from '@/app/actions/interaction-actions';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
  blogId: string;
  initialBookmarked: boolean;
}

export function BookmarkButton({ blogId, initialBookmarked }: BookmarkButtonProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    setLoading(true);
    
    // Optimistic update
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);

    const result = await bookmarkBlog(blogId);
    
    if (result.error) {
      // Revert on error
      setBookmarked(!newBookmarked);
      alert(result.error);
    } else {
      router.refresh();
    }
    
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={handleBookmark}
      disabled={loading}
    >
      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
      {bookmarked ? 'Saved' : 'Save'}
    </Button>
  );
}
