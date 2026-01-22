
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

const CATEGORIES: Category[] = [
  {
    id: 'tech',
    name: 'Technology',
    description: 'Latest software development trends, hardware reviews, and AI breakthroughs.',
    icon: 'developer_mode',
    topicsCount: '1.2k',
    postsCount: '8.4k',
    status: 'Active',
    color: 'blue',
    latestPost: {
      title: 'Why React 19 is a game changer...',
      author: 'Felix',
      time: '5m ago',
      avatar: 'https://picsum.photos/seed/felix/40/40'
    }
  },
  {
    id: 'design',
    name: 'Design',
    description: 'UI/UX feedback, design systems, illustration, and branding tools.',
    icon: 'brush',
    topicsCount: '845',
    postsCount: '4.1k',
    status: 'Creative',
    color: 'purple',
    latestPost: {
      title: 'Dark mode design patterns in 2024',
      author: 'Sarah',
      time: '1h ago',
      avatar: 'https://picsum.photos/seed/sarah/40/40'
    }
  },
  {
    id: 'general',
    name: 'General',
    description: 'Community lounge, introductions, and off-topic conversations.',
    icon: 'public',
    topicsCount: '2.5k',
    postsCount: '15k',
    status: 'Social',
    color: 'orange',
    latestPost: {
      title: 'Introduce yourself to the group!',
      author: 'Marco',
      time: '12m ago',
      avatar: 'https://picsum.photos/seed/marco/40/40'
    }
  }
];

const CategoriesPage: React.FC = () => {
  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-slate-900 dark:text-slate-100 font-bold">Categories</span>
      </nav>

      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Community Categories</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl font-medium">Connect with like-minded individuals across specialized tracks. Share knowledge and solve problems.</p>
      </div>

      <div className="mb-8 border-b border-slate-200 dark:border-border-dark flex gap-8">
        <button className="pb-4 text-xs font-black uppercase tracking-widest border-b-2 border-primary text-primary transition-all">All Categories</button>
        <button className="pb-4 text-xs font-black uppercase tracking-widest border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all">Subscribed</button>
        <button className="pb-4 text-xs font-black uppercase tracking-widest border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all">Hot Topics</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="group bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex gap-5 flex-1">
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center bg-${cat.color}-500/10 text-${cat.color}-500`}>
                  <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{cat.name}</h3>
                    <span className={`bg-${cat.color}-500/10 text-${cat.color}-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest`}>{cat.status}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 font-medium">{cat.description}</p>
                  <div className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">forum</span>
                      {cat.topicsCount} Topics
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">chat_bubble_outline</span>
                      {cat.postsCount} Posts
                    </div>
                  </div>
                </div>
              </div>

              {cat.latestPost && (
                <div className="flex flex-col items-end gap-3 w-full lg:w-72 shrink-0">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg w-full border border-slate-100 dark:border-border-dark">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Latest Post</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{cat.latestPost.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <img src={cat.latestPost.avatar} alt="" className="w-4 h-4 rounded-full" />
                      <span className="text-[10px] text-slate-500 font-bold">by {cat.latestPost.author} • {cat.latestPost.time}</span>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/user${i}/40/40`} className="w-6 h-6 rounded-full border-2 border-white dark:border-card-dark" alt="User" />
                    ))}
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-card-dark flex items-center justify-center text-[8px] font-black text-slate-500">+12</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
