
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { postService } from '../services/postService';

type SortType = 'reputation' | 'name' | 'newest';

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortType>('reputation');

  useEffect(() => {
    setMembers(postService.getUsers());
  }, []);

  const roles = ['All', 'Engineering', 'Design', 'Performance', 'Pro Contributor'];

  const filteredAndSortedMembers = useMemo(() => {
    let result = [...members];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.username.toLowerCase().includes(q)
      );
    }

    // Role filter
    if (activeRole !== 'All') {
      result = result.filter(m => m.role.includes(activeRole));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'reputation') return b.reputation - a.reputation;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'newest') return b.joinedAt.localeCompare(a.joinedAt);
      return 0;
    });

    return result;
  }, [members, searchQuery, activeRole, sortBy]);

  const topContributorsCount = members.filter(m => m.reputation > 5000).length;

  return (
    <div className="max-w-[1200px] mx-auto w-full space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-border-dark">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100 font-black">Members</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tight mb-2">Community Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Connect with {members.length} developers building the future of the web.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm min-w-[140px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Members</p>
            <p className="text-2xl font-black">{members.length}</p>
          </div>
          <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20 shadow-sm min-w-[140px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Elite (5k+ Rep)</p>
            <p className="text-2xl font-black text-primary">{topContributorsCount}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar - Removed sticky behavior */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center py-4">
        <div className="relative w-full md:max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text"
            placeholder="Search by name or @username..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                activeRole === role 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white dark:bg-card-dark text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-border-dark'
              }`}
            >
              {role}
            </button>
          ))}
          <div className="w-px h-6 bg-slate-200 dark:bg-border-dark mx-2"></div>
          <select 
            className="bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
          >
            <option value="reputation">Sort: Reputation</option>
            <option value="name">Sort: Name</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedMembers.map(user => (
          <Link 
            key={user.id}
            to="/profile" 
            className="group bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-4">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-lg object-cover"
                />
                <div className={`absolute bottom-0 right-0 w-5 h-5 border-2 border-white dark:border-slate-800 rounded-full ${user.reputation > 5000 ? 'bg-amber-400' : 'bg-primary'}`}>
                  <span className="material-symbols-outlined text-[10px] text-white flex items-center justify-center h-full">
                    {user.reputation > 5000 ? 'workspace_premium' : 'bolt'}
                  </span>
                </div>
              </div>
              
              <h3 className="font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{user.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">@{user.username}</p>
              
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 mb-6">
                {user.role}
              </span>

              <div className="grid grid-cols-2 w-full gap-2 border-t border-slate-100 dark:border-border-dark pt-4">
                <div className="text-center">
                  <p className="text-sm font-black">{user.reputation > 999 ? (user.reputation/1000).toFixed(1) + 'k' : user.reputation}</p>
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Reputation</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black">{user.postsCount}</p>
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Posts</p>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filteredAndSortedMembers.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white dark:bg-card-dark rounded-2xl border border-dashed border-slate-200 dark:border-border-dark">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">person_search</span>
            <p className="text-slate-500 font-bold uppercase tracking-widest">No members found matching your search.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveRole('All'); }}
              className="mt-4 text-primary text-xs font-black uppercase tracking-widest hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;
