import { Pen, Users, Zap, Heart, TrendingUp, Shield } from 'lucide-react';

const features = [
  {
    icon: Pen,
    title: 'Powerful Editor',
    description: 'Write with our intuitive rich text editor featuring markdown shortcuts, image uploads, and real-time preview.',
  },
  {
    icon: Users,
    title: 'Build Your Audience',
    description: 'Connect with readers who share your interests. Grow your following and engage with your community.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with Next.js 14 for blazing-fast performance. Your content loads instantly, every time.',
  },
  {
    icon: Heart,
    title: 'Engage & Discover',
    description: 'Like, bookmark, and share posts you love. Discover trending content tailored to your interests.',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Growth',
    description: 'Monitor your blog performance with detailed analytics. See views, likes, and follower growth.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security. Control who sees your drafts and published work.',
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="mb-4">
            Everything You Need to
            <span className="gradient-text"> Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you create, share, and grow your blog
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-8 hover:scale-105 transition-transform duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
