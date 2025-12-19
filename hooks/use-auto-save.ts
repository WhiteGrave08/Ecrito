'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  data: any;
  onSave: (data: any) => Promise<{ error?: string }>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave({
  data,
  onSave,
  delay = 30000, // 30 seconds
  enabled = true,
}: UseAutoSaveOptions) {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const previousDataRef = useRef<any>(data);
  const isSavingRef = useRef(false);

  const saveNow = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;

    // Check if data has actually changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    isSavingRef.current = true;
    setStatus('saving');

    try {
      const result = await onSave(data);
      
      if (result?.error) {
        setStatus('error');
        toast.error('Failed to auto-save draft');
      } else {
        setStatus('saved');
        previousDataRef.current = data;
        
        // Reset to idle after 2 seconds
        setTimeout(() => setStatus('idle'), 2000);
      }
    } catch (error) {
      setStatus('error');
      toast.error('Failed to auto-save draft');
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      saveNow();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, saveNow]);

  return {
    status,
    saveNow,
  };
}
