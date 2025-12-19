import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-hero opacity-20 animate-pulse-glow" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center animate-slide-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-card">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Welcome to the future of blogging</span>
        </div>
        
        {/* Main heading */}
        <h1 className="mb-6 leading-tight">
          Share Your Stories,
          <br />
          <span className="gradient-text">Inspire the World</span>
        </h1>
        
        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Create beautiful blog posts with our powerful editor, discover amazing content, 
          and connect with writers from around the globe.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/auth/sign-up"
            className="btn-gradient px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center gap-2 shadow-2xl"
          >
            Start Writing Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link 
            href="/auth/login"
            className="glass-card px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
          >
            Sign In
          </Link>
        </div>
        
        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">10K+</div>
            <div className="text-sm text-muted-foreground">Active Writers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Blog Posts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">1M+</div>
            <div className="text-sm text-muted-foreground">Monthly Readers</div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  );
}
