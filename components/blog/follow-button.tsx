'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { followUser } from '@/app/actions/interaction-actions';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
  userId: string;
  initialFollowing: boolean;
}

export function FollowButton({ userId, initialFollowing }: FollowButtonProps) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    
    // Optimistic update
    const newFollowing = !following;
    setFollowing(newFollowing);

    const result = await followUser(userId);
    
    if (result.error) {
      // Revert on error
      setFollowing(!newFollowing);
      alert(result.error);
    } else {
      router.refresh();
    }
    
    setLoading(false);
  };

  return (
    <Button
      variant={following ? 'outline' : 'default'}
      className={following ? '' : 'btn-gradient'}
      onClick={handleFollow}
      disabled={loading}
    >
      {loading ? 'Loading...' : following ? 'Following' : 'Follow'}
    </Button>
  );
}
