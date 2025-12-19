import { DeployButton } from "@/components/deploy-button";
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen smooth-scroll">
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
