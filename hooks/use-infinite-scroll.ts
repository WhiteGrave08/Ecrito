'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollOptions<T> {
  initialData: T[];
  fetchMore: (page: number) => Promise<T[]>;
  pageSize?: number;
}

export function useInfiniteScroll<T>({
  initialData,
  fetchMore,
  pageSize = 9,
}: UseInfiniteScrollOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newData = await fetchMore(page + 1);
      
      if (newData.length === 0 || newData.length < pageSize) {
        setHasMore(false);
      }

      if (newData.length > 0) {
        setData((prev) => [...prev, ...newData]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchMore, page, isLoading, hasMore, pageSize]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  const reset = useCallback((newData: T[]) => {
    setData(newData);
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    data,
    isLoading,
    hasMore,
    ref,
    reset,
  };
}
