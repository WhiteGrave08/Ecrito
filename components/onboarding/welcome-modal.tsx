'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';

interface WelcomeModalProps {
  onStart: () => void;
  onSkip: () => void;
}

export function WelcomeModal({ onStart, onSkip }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleStart = () => {
    setIsVisible(false);
    onStart();
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsVisible(false);
    onSkip();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl mx-4 bg-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with gradient */}
        <div className="relative p-8 pb-6 bg-gradient-to-br from-primary/20 via-accent/10 to-background">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Welcome to Écrito!</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Your journey to amazing storytelling starts here
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <Feature
              icon="✍️"
              title="Write & Publish"
              description="Create beautiful blog posts with our rich text editor"
            />
            <Feature
              icon="🔍"
              title="Discover Stories"
              description="Explore amazing content from writers around the world"
            />
            <Feature
              icon="💬"
              title="Engage & Connect"
              description="Like, comment, and follow your favorite authors"
            />
            <Feature
              icon="⚡"
              title="Power User Features"
              description="Keyboard shortcuts, auto-save, and more!"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleStart}
              className="flex-1 h-12 text-base btn-gradient"
            >
              Take a Quick Tour
            </Button>
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1 h-12 text-base"
            >
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You can always access the tour later by pressing <kbd className="px-2 py-1 bg-muted rounded">?</kbd>
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <span className="text-3xl flex-shrink-0">{icon}</span>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
