
import React from 'react';
import { User } from '../types';

const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  username: 'arivera',
  avatar: 'https://picsum.photos/seed/alex/200/200',
  role: 'Community Expert & Developer',
  reputation: 8500,
  joinedAt: 'Oct 2021',
  postsCount: 1248,
  solutionsCount: 42
};

const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-[960px] mx-auto w-full space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 rounded-xl bg-white dark:bg-card-dark shadow-sm border border-slate-200 dark:border-border-dark">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-slate-800 bg-cover bg-center shadow-lg" style={{ backgroundImage: `url(${MOCK_USER.avatar})` }}></div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-black tracking-tight">{MOCK_USER.name}</h1>
            <p className="text-primary font-bold uppercase text-xs tracking-widest mt-1">{MOCK_USER.role}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-base">calendar_month</span>
              <span>Member since {MOCK_USER.joinedAt}</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto flex gap-3">
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Edit Profile</button>
          <button className="p-2.5 border border-slate-200 dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"><span className="material-symbols-outlined">share</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Posts', value: MOCK_USER.postsCount, icon: 'article', trend: '+12% this month' },
          { label: 'Solutions', value: MOCK_USER.solutionsCount, icon: 'verified', badge: 'Top 5% Helper' },
          { label: 'Reputation', value: '8.5k', icon: 'military_tech', sub: 'Gold Tier Contributor' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark hover:border-primary/50 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">{stat.icon}</span>
            </div>
            <p className="text-3xl font-black mb-1">{stat.value}</p>
            {stat.trend && <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><span className="material-symbols-outlined text-xs">trending_up</span> {stat.trend}</p>}
            {stat.badge && <div className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded inline-block">{stat.badge}</div>}
            {stat.sub && <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.sub}</p>}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden">
        <div className="border-b border-slate-200 dark:border-border-dark px-6">
          <div className="flex gap-8">
            <button className="border-b-2 border-primary py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Activity</button>
            <button className="border-b-2 border-transparent py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors">Saved Posts</button>
            <button className="border-b-2 border-transparent py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors">Badges</button>
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-border-dark">
          {[
            { title: 'How to optimize React performance in large apps', tag: 'Development', time: '2 hours ago', icon: 'article', count: 124 },
            { title: 'Solution: Fixing CSS Grid overflow on mobile', tag: 'Design', time: '5 hours ago', icon: 'check_circle', solved: true },
            { title: 'What\'s the best approach for global state in 2024?', tag: 'Architecture', time: 'Yesterday', icon: 'forum', count: 48 }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg shrink-0 ${item.solved ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-primary'}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black truncate">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">{item.tag}</span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{item.time}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                {item.solved ? (
                  <div className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-[9px] font-black tracking-widest">SOLVED</div>
                ) : (
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">thumb_up</span>
                    <span>{item.count}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 text-center">
          <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Activity</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
