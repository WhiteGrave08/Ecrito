'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { likeBlog } from '@/app/actions/interaction-actions';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  blogId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({ blogId, initialLiked, initialCount }: LikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    // Optimistic update
    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : count - 1;
    setLiked(newLiked);
    setCount(newCount);

    const result = await likeBlog(blogId);
    
    if (result.error) {
      // Revert on error
      setLiked(!newLiked);
      setCount(count);
      alert(result.error);
    } else {
      router.refresh();
    }
    
    setLoading(false);
  };

  return (
    <Button
      variant={liked ? 'default' : 'outline'}
      className="gap-2 transition-all duration-200 hover:scale-105"
      onClick={handleLike}
      disabled={loading}
    >
      <Heart 
        className={`w-4 h-4 transition-all duration-200 ${liked ? 'fill-current' : ''} ${isAnimating ? 'heart-pop' : ''}`} 
      />
      {count} {count === 1 ? 'Like' : 'Likes'}
    </Button>
  );
}
