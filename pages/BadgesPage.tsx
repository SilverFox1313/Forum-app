
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../types';
import { postService } from '../services/postService';

const BadgesPage: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    setBadges(postService.getBadges());
  }, []);

  const categories = ['All', 'Engagement', 'Expertise', 'Social', 'Special'];

  const filteredBadges = useMemo(() => {
    if (activeCategory === 'All') return badges;
    return badges.filter(b => b.category === activeCategory);
  }, [badges, activeCategory]);

  const stats = useMemo(() => {
    const earned = badges.filter(b => b.isEarned).length;
    return {
      earned,
      total: badges.length,
      percentage: Math.round((earned / (badges.length || 1)) * 100)
    };
  }, [badges]);

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'Common': return 'text-slate-400 bg-slate-100 dark:bg-slate-800';
      case 'Rare': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'Epic': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'Legendary': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      default: return 'text-slate-400 bg-slate-100';
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full space-y-8 animate-in fade-in duration-500">
      {/* Header & Dashboard */}
      <div className="space-y-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100 font-black">Badges</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tight mb-2">Achievement Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Showcase your contributions and unlock exclusive community rewards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-border-dark shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Earned</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black">{stats.earned}</span>
              <span className="text-slate-400 font-bold mb-1">/ {stats.total}</span>
            </div>
          </div>
          <div className="md:col-span-2 bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion Progress</p>
              <span className="text-xs font-black text-primary">{stats.percentage}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white dark:bg-card-dark text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-border-dark'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map(badge => (
          <div 
            key={badge.id}
            className={`group relative bg-white dark:bg-card-dark border rounded-2xl p-6 transition-all duration-300 ${
              badge.isEarned 
                ? 'border-slate-200 dark:border-border-dark hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5' 
                : 'border-slate-100 dark:border-slate-800 opacity-60 grayscale'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
                badge.isEarned ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                <span className="material-symbols-outlined text-3xl font-light">{badge.icon}</span>
              </div>
              <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${getRarityColor(badge.rarity)}`}>
                {badge.rarity}
              </span>
            </div>

            <h3 className="text-lg font-black mb-1 group-hover:text-primary transition-colors">{badge.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
              {badge.description}
            </p>

            {!badge.isEarned && badge.progress && (
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>Progress</span>
                  <span>{badge.progress.current} / {badge.progress.target}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-300 dark:bg-slate-600"
                    style={{ width: `${(badge.progress.current / badge.progress.target) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {badge.isEarned && (
              <div className="flex items-center gap-1.5 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">verified</span>
                Achievement Unlocked
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesPage;
