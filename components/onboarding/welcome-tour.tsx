'use client';

import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS, EVENTS } from 'react-joyride';

interface WelcomeTourProps {
  run: boolean;
  onComplete: () => void;
}

export function WelcomeTour({ run, onComplete }: WelcomeTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Only render on client-side to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Welcome to Écrito! 🎉</h3>
          <p>Let's take a quick tour of the key features. This will only take a minute!</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="discover"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Discover Page 🔍</h3>
          <p>Explore amazing stories from writers around the world. Filter by All, Following, or Popular content.</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="search"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Search 🔎</h3>
          <p>Find specific blogs, authors, or topics. Use filters to narrow down results.</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="create"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Create Blog ✍️</h3>
          <p>Write and publish your own stories! Features auto-save, rich text editing, and preview mode.</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="profile"]',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Your Profile 👤</h3>
          <p>Manage your blogs, view drafts, and customize your profile settings.</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold">Pro Tips! ⚡</h3>
          <div className="space-y-2 text-sm">
            <p>• Press <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> to see all keyboard shortcuts</p>
            <p>• Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+K</kbd> for quick search</p>
            <p>• Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+N</kbd> to create a new blog</p>
            <p>• Use <kbd className="px-2 py-1 bg-muted rounded text-xs">G+D</kbd>, <kbd className="px-2 py-1 bg-muted rounded text-xs">G+S</kbd>, <kbd className="px-2 py-1 bg-muted rounded text-xs">G+P</kbd> for quick navigation</p>
          </div>
        </div>
      ),
      placement: 'center',
    },
    {
      target: 'body',
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">You're All Set! 🚀</h3>
          <p>Start exploring, writing, and connecting with the Écrito community!</p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      localStorage.setItem('hasSeenWelcome', 'true');
      localStorage.setItem('hasCompletedTour', 'true');
      onComplete();
    }

    // Handle step navigation
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Move to next step
      setStepIndex(index + (action === 'prev' ? -1 : 1));
    }
  };

  // Don't render until mounted on client
  if (!isMounted) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'hsl(var(--primary))',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          borderRadius: 8,
          padding: '8px 16px',
        },
        buttonBack: {
          color: 'hsl(var(--muted-foreground))',
          marginRight: 8,
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
}
