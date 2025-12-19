'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { BlogCard } from '@/components/blog/blog-card';
import { BlogCardSkeletonGrid } from '@/components/skeletons/blog-card-skeleton';
import { TrendingTopics } from '@/components/search/trending-topics';
import { EmptySearch } from '@/components/empty-states/empty-search';

type FilterType = 'all' | 'blogs' | 'authors' | 'tags';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const { searchBlogs } = await import('@/app/actions/search-actions');
      const result = await searchBlogs(searchQuery);
      
      if (result.error) {
        console.error('Search error:', result.error);
        setResults([]);
      } else {
        setResults(result.blogs || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query) {
        handleSearch(query);
        router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [query]);

  // Filter results based on active filter
  const filteredResults = results.filter((blog) => {
    if (activeFilter === 'all') return true;
    
    if (activeFilter === 'blogs') {
      return true;
    }
    
    if (activeFilter === 'authors') {
      const author = Array.isArray(blog.author) ? blog.author[0] : blog.author;
      return author?.full_name?.toLowerCase().includes(query.toLowerCase()) ||
             author?.username?.toLowerCase().includes(query.toLowerCase());
    }
    
    if (activeFilter === 'tags') {
      return blog.tags?.some((tag: any) => 
        tag.tag_name?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground text-lg">
            Find blogs, authors, and topics that interest you
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for blogs, authors, or topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 h-14 text-lg border-2 focus:border-primary transition-colors"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-primary" />
            )}
          </div>
        </div>

        {/* Filters */}
        {query && (
          <div className="flex gap-2 mb-8 flex-wrap animate-fade-in">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
              className="transition-all duration-200"
            >
              All
              {activeFilter === 'all' && results.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {results.length}
                </span>
              )}
            </Button>
            <Button 
              variant={activeFilter === 'blogs' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('blogs')}
              className="transition-all duration-200"
            >
              Blogs
            </Button>
            <Button 
              variant={activeFilter === 'authors' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('authors')}
              className="transition-all duration-200"
            >
              Authors
            </Button>
            <Button 
              variant={activeFilter === 'tags' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('tags')}
              className="transition-all duration-200"
            >
              Tags
            </Button>
          </div>
        )}

        {/* Results */}
        <div>
          {isLoading ? (
            <BlogCardSkeletonGrid count={6} />
          ) : filteredResults.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6 animate-fade-in">
                <span className="font-semibold text-foreground">{filteredResults.length}</span> result{filteredResults.length !== 1 ? 's' : ''} found
                {activeFilter !== 'all' && ` in ${activeFilter}`}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResults.map((blog, index) => (
                  <div key={blog.id} className="stagger-item" style={{ animationDelay: `${index * 50}ms` }}>
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>
            </>
          ) : query ? (
            <EmptySearch query={query} />
          ) : (
            <TrendingTopics />
          )}
        </div>
      </div>
    </div>
  );
}
