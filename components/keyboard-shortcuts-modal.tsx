'use client';

import { useState } from 'react';
import { X, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { category: 'Navigation', items: [
      { keys: ['Ctrl', 'K'], description: 'Open search' },
      { keys: ['Ctrl', 'N'], description: 'New blog post' },
      { keys: ['/'], description: 'Focus search' },
      { keys: ['G', 'D'], description: 'Go to Discover' },
      { keys: ['G', 'S'], description: 'Go to Search' },
      { keys: ['G', 'P'], description: 'Go to Profile' },
      { keys: ['G', 'C'], description: 'Go to Create' },
    ]},
    { category: 'Editor', items: [
      { keys: ['Ctrl', 'S'], description: 'Save draft' },
      { keys: ['Ctrl', 'Enter'], description: 'Publish post' },
      { keys: ['Ctrl', 'B'], description: 'Bold text' },
      { keys: ['Ctrl', 'I'], description: 'Italic text' },
    ]},
    { category: 'General', items: [
      { keys: ['?'], description: 'Show this help' },
      { keys: ['Esc'], description: 'Close modals' },
    ]},
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-background rounded-2xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-8">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-lg font-semibold mb-4 text-primary">
                {section.category}
              </h3>
              <div className="space-y-3">
                {section.items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <span className="text-foreground">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center">
                          <kbd className="px-2 py-1 text-xs font-semibold bg-muted border border-border rounded">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-muted-foreground">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t p-4 text-center text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 text-xs font-semibold bg-muted border border-border rounded">?</kbd> to toggle this help
        </div>
      </div>
    </div>
  );
}
