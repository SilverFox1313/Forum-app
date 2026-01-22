
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { postService } from '../services/postService';

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(postService.getPosts());
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-border-dark mb-6">
            <div className="flex gap-6">
              <button className="flex flex-col items-center justify-center border-b-2 border-primary text-primary pb-3 pt-2">
                <span className="text-sm font-bold tracking-wide">Trending</span>
              </button>
              <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 pb-3 pt-2 transition-colors">
                <span className="text-sm font-bold tracking-wide">New</span>
              </button>
              <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 pb-3 pt-2 transition-colors">
                <span className="text-sm font-bold tracking-wide">Following</span>
              </button>
            </div>
            <Link to="/create" className="lg:hidden flex items-center justify-center size-9 bg-primary text-white rounded-lg">
              <span className="material-symbols-outlined">add</span>
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {posts.map(post => (
              <Link 
                key={post.id} 
                to={`/thread/${post.id}`}
                className="group flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark hover:border-primary/40 shadow-sm transition-all"
              >
                <div className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-1 min-w-[44px]">
                  <button className="hover:text-primary transition-colors" onClick={(e) => e.preventDefault()}>
                    <span className="material-symbols-outlined">expand_less</span>
                  </button>
                  <span className="text-xs font-bold">{post.upvotes > 999 ? (post.upvotes/1000).toFixed(1) + 'k' : post.upvotes}</span>
                  <button className="hover:text-red-500 transition-colors" onClick={(e) => e.preventDefault()}>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>

                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                    <img src={post.author.avatar} alt={post.author.name} className="size-5 rounded-full" />
                    <span className="text-slate-700 dark:text-slate-200">{post.author.name}</span>
                    <span>•</span>
                    <span>{post.timestamp}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-primary">{post.category}</span>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors truncate">{post.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{post.body}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                      <span>{post.commentsCount} Comments</span>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold uppercase tracking-wider transition-colors" onClick={(e) => e.preventDefault()}>
                      <span className="material-symbols-outlined text-sm">share</span>
                      <span>Share</span>
                    </button>
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
            {posts.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-500 font-bold uppercase tracking-widest opacity-50">No discussions found.</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button className="px-6 py-2 rounded-lg border border-slate-200 dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs uppercase tracking-widest transition-colors">
              Load more discussions
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-6 w-[320px]">
          <div className="p-5 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark">
            <h4 className="text-[11px] font-black mb-4 uppercase tracking-[0.1em] text-slate-500">Community Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-black">{12.4 + (posts.length * 0.001).toFixed(1)}k</p>
                <p className="text-[10px] uppercase font-bold text-slate-500">Members</p>
              </div>
              <div>
                <p className="text-2xl font-black">{posts.length}</p>
                <p className="text-[10px] uppercase font-bold text-slate-500">Total Posts</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark">
            <h4 className="text-[11px] font-black mb-4 uppercase tracking-[0.1em] text-slate-500">Trending Topics</h4>
            <div className="flex flex-wrap gap-2">
              {['#ReactJS', '#UIDesign', '#Wasm', '#Productivity', '#AI', '#Frontend'].map(tag => (
                <Link 
                  key={tag} 
                  to="#" 
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <span className="material-symbols-outlined text-xl">verified_user</span>
              <h4 className="text-xs font-black uppercase tracking-widest">Forum Rules</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Share your expertise, ask meaningful questions, and support others in their learning journey.
            </p>
            <button className="mt-3 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Read Guidelines →</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPage;
