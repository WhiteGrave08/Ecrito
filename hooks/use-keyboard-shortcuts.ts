'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Ctrl/Cmd shortcuts even in inputs
        if (!event.ctrlKey && !event.metaKey) {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : true;
        const metaMatch = shortcut.meta ? event.metaKey : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && metaMatch && shiftMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, enabled]);
}

// Global keyboard shortcuts hook
export function useGlobalKeyboardShortcuts() {
  const router = useRouter();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrl: true,
      action: () => router.push('/search'),
      description: 'Open search',
    },
    {
      key: 'n',
      ctrl: true,
      action: () => router.push('/create'),
      description: 'New blog post',
    },
    {
      key: '/',
      action: () => router.push('/search'),
      description: 'Focus search',
    },
  ];

  useKeyboardShortcuts(shortcuts);
}

// Sequence-based shortcuts (like 'g d' for go to discover)
export function useSequenceShortcuts() {
  const router = useRouter();
  
  useEffect(() => {
    let sequence = '';
    let timeout: NodeJS.Timeout;

    const handleKeyPress = async (event: KeyboardEvent) => {
      // Don't trigger in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      clearTimeout(timeout);
      sequence += event.key.toLowerCase();

      // Check sequences
      if (sequence === 'gd') {
        router.push('/discover');
        sequence = '';
      } else if (sequence === 'gs') {
        router.push('/search');
        sequence = '';
      } else if (sequence === 'gp') {
        // Get current user's profile URL
        try {
          const response = await fetch('/api/user/profile-url');
          const data = await response.json();
          if (data.profileUrl) {
            router.push(data.profileUrl);
          } else {
            router.push('/settings'); // Fallback to settings
          }
        } catch (error) {
          router.push('/settings'); // Fallback on error
        }
        sequence = '';
      } else if (sequence === 'gc') {
        router.push('/create');
        sequence = '';
      }

      // Reset sequence after 1 second
      timeout = setTimeout(() => {
        sequence = '';
      }, 1000);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearTimeout(timeout);
    };
  }, [router]);
}
