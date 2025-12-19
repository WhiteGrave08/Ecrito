'use client';

import { useState } from 'react';
import { WelcomeModal } from '@/components/onboarding/welcome-modal';
import { WelcomeTour } from '@/components/onboarding/welcome-tour';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [showTour, setShowTour] = useState(false);

  const handleStartTour = () => {
    setShowTour(true);
  };

  const handleSkipTour = () => {
    setShowTour(false);
  };

  const handleCompleteTour = () => {
    setShowTour(false);
  };

  return (
    <>
      {children}
      <WelcomeModal onStart={handleStartTour} onSkip={handleSkipTour} />
      <WelcomeTour run={showTour} onComplete={handleCompleteTour} />
    </>
  );
}
