'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            'object-cover transition-all duration-300',
            isLoading ? 'blur-sm scale-105' : 'blur-0 scale-100'
          )}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => setError(true)}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className={cn(
            'transition-all duration-300',
            isLoading ? 'blur-sm scale-105' : 'blur-0 scale-100'
          )}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => setError(true)}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}
