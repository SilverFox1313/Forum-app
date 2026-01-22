
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { Post } from '../types';
import { postService } from '../services/postService';

type ViewType = 'home' | 'trending' | 'bookmarks';

const FeedPage: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get('q');
  
  const currentView = useMemo<ViewType>(() => {
    if (location.pathname === '/trending') return 'trending';
    if (location.pathname === '/bookmarks') return 'bookmarks';
    return 'home';
  }, [location.pathname]);

  useEffect(() => {
    setAllPosts(postService.getPosts());
    setBookmarkedIds(postService.getBookmarkedIds());
  }, [location.key]);

  const toggleBookmark = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    postService.toggleBookmark(postId);
    setBookmarkedIds(postService.getBookmarkedIds());
  };

  const filteredPosts = useMemo(() => {
    let posts = [...allPosts];
    if (currentView === 'bookmarks') posts = posts.filter(post => bookmarkedIds.includes(post.id));
    if (query) {
      const q = query.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(q) || post.body.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) || post.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    if (currentView === 'trending') posts.sort((a, b) => b.upvotes - a.upvotes);
    else posts.sort((a, b) => (parseFloat(b.id) || 0) - (parseFloat(a.id) || 0));
    return posts;
  }, [allPosts, query, currentView, bookmarkedIds]);

  const trendingTopics = useMemo(() => {
    const counts: Record<string, number> = {};
    allPosts.forEach(post => post.tags.forEach(tag => {
      const formatted = tag.startsWith('#') ? tag : `#${tag}`;
      counts[formatted] = (counts[formatted] || 0) + 1;
    }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([tag]) => tag);
  }, [allPosts]);

  return (
    <div className="max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-border-dark mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 sm:gap-6 min-w-max">
              {query ? (
                <div className="flex flex-col items-center justify-center border-b-2 border-primary pb-3 pt-2 text-primary">
                  <span className="text-sm font-bold tracking-wide">Search Results</span>
                </div>
              ) : (
                <>
                  <Link to="/" className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-all ${currentView === 'home' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>
                    <span className="text-sm font-bold tracking-wide">Home</span>
                  </Link>
                  <Link to="/trending" className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-all ${currentView === 'trending' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>
                    <span className="text-sm font-bold tracking-wide">Trending</span>
                  </Link>
                  <Link to="/bookmarks" className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-2 transition-all ${currentView === 'bookmarks' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>
                    <span className="text-sm font-bold tracking-wide">Bookmarks</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {filteredPosts.map(post => (
              <Link 
                key={post.id} 
                to={`/thread/${post.id}`}
                className="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark hover:border-primary/40 shadow-sm transition-all relative"
              >
                {/* Upvotes (Horizontal on Mobile) */}
                <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-1.5 sm:min-w-[44px] w-full sm:w-auto">
                  <button className="hover:text-primary p-0.5" onClick={(e) => { e.preventDefault(); postService.upvotePost(post.id, 1); setAllPosts(postService.getPosts()); }}>
                    <span className="material-symbols-outlined">expand_less</span>
                  </button>
                  <span className="text-xs font-bold">{post.upvotes > 999 ? (post.upvotes/1000).toFixed(1) + 'k' : post.upvotes}</span>
                  <button className="hover:text-red-500 p-0.5" onClick={(e) => { e.preventDefault(); postService.upvotePost(post.id, -1); setAllPosts(postService.getPosts()); }}>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                  <div className="flex-1 sm:hidden"></div>
                  <button 
                    onClick={(e) => toggleBookmark(e, post.id)}
                    className={`sm:hidden p-1.5 rounded-lg transition-colors ${bookmarkedIds.includes(post.id) ? 'text-primary bg-primary/10' : 'text-slate-400'}`}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${bookmarkedIds.includes(post.id) ? 'fill-1' : ''}`}>bookmark</span>
                  </button>
                </div>

                <div className="flex-1 flex flex-col gap-2 min-w-0 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                      <img src={post.author.avatar} alt={post.author.name} className="size-5 rounded-full" />
                      <span className="text-slate-700 dark:text-slate-200 truncate max-w-[80px] sm:max-w-[120px]">{post.author.name}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-primary">{post.category}</span>
                    </div>
                    <button 
                      onClick={(e) => toggleBookmark(e, post.id)}
                      className={`hidden sm:flex p-1.5 rounded-lg transition-colors ${bookmarkedIds.includes(post.id) ? 'text-primary bg-primary/10' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${bookmarkedIds.includes(post.id) ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${bookmarkedIds.includes(post.id) ? 1 : 0}` }}>
                        bookmark
                      </span>
                    </button>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{post.body}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>

                {post.thumbnail && (
                  <div 
                    className="hidden lg:block w-32 aspect-video bg-center bg-cover rounded-lg shrink-0 border border-slate-200 dark:border-border-dark"
                    style={{ backgroundImage: `url(${post.thumbnail})` }}
                  />
                )}
              </Link>
            ))}
            
            {filteredPosts.length === 0 && (
              <div className="py-20 text-center bg-white dark:bg-card-dark rounded-2xl border border-dashed border-slate-200 dark:border-border-dark px-6">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">{currentView === 'bookmarks' ? 'bookmark_border' : 'search_off'}</span>
                <p className="text-slate-500 font-bold uppercase tracking-widest">{currentView === 'bookmarks' ? "No saved discussions." : "No discussions found."}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-6 w-[320px] shrink-0">
          <div className="p-5 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark shadow-sm">
            <h4 className="text-[11px] font-black mb-4 uppercase tracking-[0.1em] text-slate-500">Community Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-2xl font-black">12.5k</p><p className="text-[10px] uppercase font-bold text-slate-500">Members</p></div>
              <div><p className="text-2xl font-black">{allPosts.length}</p><p className="text-[10px] uppercase font-bold text-slate-500">Total Posts</p></div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark shadow-sm">
            <h4 className="text-[11px] font-black mb-4 uppercase tracking-[0.1em] text-slate-500">Trending Topics</h4>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map(tag => (
                <Link key={tag} to={`/?q=${tag.replace('#', '')}`} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors">{tag}</Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPage;
