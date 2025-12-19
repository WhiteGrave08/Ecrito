'use client';

import { TrendingUp, Hash } from 'lucide-react';
import Link from 'next/link';

const trendingTopics = [
  { name: 'productivity', count: 234, color: 'from-blue-500 to-cyan-500' },
  { name: 'technology', count: 189, color: 'from-purple-500 to-pink-500' },
  { name: 'design', count: 156, color: 'from-orange-500 to-red-500' },
  { name: 'writing', count: 142, color: 'from-green-500 to-emerald-500' },
  { name: 'creativity', count: 128, color: 'from-yellow-500 to-orange-500' },
  { name: 'mindfulness', count: 98, color: 'from-indigo-500 to-purple-500' },
];

export function TrendingTopics() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Trending Topics</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingTopics.map((topic, index) => (
          <Link
            key={topic.name}
            href={`/search?q=${topic.name}`}
            className="group stagger-item"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="glass-card p-6 hover-lift hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center shadow-lg`}>
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {topic.count} posts
                </span>
              </div>
              
              <h3 className="text-lg font-bold capitalize group-hover:text-primary transition-colors">
                {topic.name}
              </h3>
              
              <p className="text-sm text-muted-foreground mt-1">
                Explore {topic.name} content
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
