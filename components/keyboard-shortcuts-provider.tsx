'use client';

import { useGlobalKeyboardShortcuts, useSequenceShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { KeyboardShortcutsModal } from '@/components/keyboard-shortcuts-modal';
import { useState, useEffect } from 'react';

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);

  // Enable global shortcuts
  useGlobalKeyboardShortcuts();
  useSequenceShortcuts();

  // Listen for '?' to show help
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        const target = event.target as HTMLElement;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          event.preventDefault();
          setShowModal(true);
        }
      }

      // Close modal on Escape
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      {children}
      <KeyboardShortcutsModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
