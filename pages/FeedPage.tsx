
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { Post } from '../types';
import { postService } from '../services/postService';

type TabType = 'trending' | 'new' | 'bookmarks';

const FeedPage: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get('q');
  
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (location.pathname === '/trending') return 'trending';
    if (location.pathname === '/bookmarks') return 'bookmarks';
    return 'trending';
  });

  useEffect(() => {
    setAllPosts(postService.getPosts());
    setBookmarkedIds(postService.getBookmarkedIds());
  }, []);

  useEffect(() => {
    if (location.pathname === '/trending') {
      setActiveTab('trending');
    } else if (location.pathname === '/bookmarks') {
      setActiveTab('bookmarks');
    }
  }, [location.pathname]);

  const toggleBookmark = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    postService.toggleBookmark(postId);
    setBookmarkedIds(postService.getBookmarkedIds());
  };

  const filteredPosts = useMemo(() => {
    let posts = [...allPosts];
    
    // 1. Filter by bookmarks if active tab is bookmarks
    if (activeTab === 'bookmarks') {
      posts = posts.filter(post => bookmarkedIds.includes(post.id));
    }

    // 2. Filter by search query if exists
    if (query) {
      const q = query.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // 3. Sort based on active tab
    if (activeTab === 'trending') {
      posts.sort((a, b) => b.upvotes - a.upvotes);
    } else if (activeTab === 'new') {
      posts.sort((a, b) => {
        const idA = parseInt(a.id) || 0;
        const idB = parseInt(b.id) || 0;
        return idB - idA;
      });
    }
    
    return posts;
  }, [allPosts, query, activeTab, bookmarkedIds]);

  const trendingTopics = useMemo(() => {
    const counts: Record<string, number> = {};
    allPosts.forEach(post => {
      post.tags.forEach(tag => {
        const formatted = tag.startsWith('#') ? tag : `#${tag}`;
        counts[formatted] = (counts[formatted] || 0) + 1;
      });
    });
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [allPosts]);

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-border-dark mb-6">
            <div className="flex gap-6">
              {query ? (
                <div className="flex flex-col items-center justify-center border-b-2 border-primary pb-3 pt-2 text-primary">
                  <span className="text-sm font-bold tracking-wide">Search Results</span>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setActiveTab('trending')}
                    className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-all ${activeTab === 'trending' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                  >
                    <span className="text-sm font-bold tracking-wide">Trending</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('new')}
                    className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-all ${activeTab === 'new' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                  >
                    <span className="text-sm font-bold tracking-wide">New</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('bookmarks')}
                    className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-all ${activeTab === 'bookmarks' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                  >
                    <span className="text-sm font-bold tracking-wide">Bookmarks</span>
                  </button>
                </>
              )}
            </div>
            {query && (
              <Link to="/" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">close</span>
                Clear Search
              </Link>
            )}
            <Link to="/create" className="lg:hidden flex items-center justify-center size-9 bg-primary text-white rounded-lg shadow-md">
              <span className="material-symbols-outlined">add</span>
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {filteredPosts.map(post => (
              <Link 
                key={post.id} 
                to={`/thread/${post.id}`}
                className="group flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark hover:border-primary/40 shadow-sm transition-all relative"
              >
                <div className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-1 min-w-[44px]">
                  <button 
                    className="hover:text-primary transition-colors" 
                    onClick={(e) => { e.preventDefault(); postService.upvotePost(post.id, 1); setAllPosts(postService.getPosts()); }}
                  >
                    <span className="material-symbols-outlined">expand_less</span>
                  </button>
                  <span className="text-xs font-bold">{post.upvotes > 999 ? (post.upvotes/1000).toFixed(1) + 'k' : post.upvotes}</span>
                  <button 
                    className="hover:text-red-500 transition-colors" 
                    onClick={(e) => { e.preventDefault(); postService.upvotePost(post.id, -1); setAllPosts(postService.getPosts()); }}
                  >
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>

                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                      <img src={post.author.avatar} alt={post.author.name} className="size-5 rounded-full" />
                      <span className="text-slate-700 dark:text-slate-200 truncate max-w-[100px]">{post.author.name}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-primary">{post.category}</span>
                    </div>
                    <button 
                      onClick={(e) => toggleBookmark(e, post.id)}
                      className={`p-1.5 rounded-lg transition-colors ${bookmarkedIds.includes(post.id) ? 'text-primary bg-primary/10' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${bookmarkedIds.includes(post.id) ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${bookmarkedIds.includes(post.id) ? 1 : 0}` }}>
                        bookmark
                      </span>
                    </button>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors truncate">{post.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{post.body}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                      <span>{post.commentsCount} Comments</span>
                    </div>
                  </div>
                </div>

                {post.thumbnail && (
                  <div 
                    className="hidden sm:block w-32 aspect-video bg-center bg-cover rounded-lg shrink-0 border border-slate-200 dark:border-border-dark"
                    style={{ backgroundImage: `url(${post.thumbnail})` }}
                  />
                )}
              </Link>
            ))}
            
            {filteredPosts.length === 0 && (
              <div className="py-20 text-center bg-white dark:bg-card-dark rounded-2xl border border-dashed border-slate-200 dark:border-border-dark px-6">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700 mb-4">
                  {activeTab === 'bookmarks' ? 'bookmark_border' : 'search_off'}
                </span>
                <p className="text-slate-500 font-bold uppercase tracking-widest">
                  {activeTab === 'bookmarks' 
                    ? "You haven't bookmarked any discussions yet." 
                    : "No discussions match your criteria."}
                </p>
                <button 
                  onClick={() => {
                    if (activeTab === 'bookmarks') {
                      setActiveTab('trending');
                    } else {
                      const params = new URLSearchParams(searchParams);
                      params.delete('q');
                      window.location.search = params.toString();
                    }
                  }}
                  className="mt-4 text-primary text-xs font-black uppercase tracking-widest hover:underline"
                >
                  {activeTab === 'bookmarks' ? "Explore Trending" : "Reset filters"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-6 w-[320px]">
          <div className="p-5 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark shadow-sm">
            <h4 className="text-[11px] font-black mb-4 uppercase tracking-[0.1em] text-slate-500">Community Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-black">12.5k</p>
                <p className="text-[10px] uppercase font-bold text-slate-500">Members</p>
              </div>
              <div>
                <p className="text-2xl font-black">{allPosts.length}</p>
                <p className="text-[10px] uppercase font-bold text-slate-500">Total Posts</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark shadow-sm">
            <h4 className="text-[11px] font-black mb-4 uppercase tracking-[0.1em] text-slate-500">Trending Topics</h4>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.length > 0 ? trendingTopics.map(tag => (
                <Link 
                  key={tag} 
                  to={`/?q=${tag.replace('#', '')}`} 
                  className={`px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${query === tag.replace('#', '') ? 'bg-primary/20 text-primary' : ''}`}
                >
                  {tag}
                </Link>
              )) : (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No topics found</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPage;
