
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Notification } from '../types';
import { postService } from '../services/postService';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const toggleTimeoutRef = useRef<number | null>(null);
  
  // Theme management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setNotifications(postService.getNotifications());
    
    // Listen for outside clicks to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.add('theme-transitioning');
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    if (toggleTimeoutRef.current) window.clearTimeout(toggleTimeoutRef.current);
    toggleTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 350);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Trending', path: '/trending', icon: 'trending_up' },
    { name: 'Bookmarks', path: '/bookmarks', icon: 'bookmark' },
  ];

  const communityItems = [
    { name: 'Members', path: '/members', icon: 'groups' },
    { name: 'Badges', path: '/badges', icon: 'workspace_premium' },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      const basePath = location.pathname === '/trending' || location.pathname === '/bookmarks' ? location.pathname : '/';
      navigate(`${basePath}?q=${encodeURIComponent(value.trim())}`, { replace: true });
    } else {
      navigate(location.pathname, { replace: true });
      if (!value) navigate('/', { replace: true });
    }
  };

  const handleMarkAsRead = (id: string) => {
    const updated = postService.markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = postService.markAllAsRead();
    setNotifications(updated);
  };

  const handleClearNotifications = () => {
    const updated = postService.clearNotifications();
    setNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-slate-200 dark:border-border-dark flex-col fixed h-full bg-white dark:bg-background-dark z-20">
        <div className="p-6 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white">forum</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ForumHub</h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </Link>
          ))}

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Community</div>
          {communityItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Account</div>
          <Link to="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive('/settings') ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <Link to="/create" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-sm">add</span>
            Start Discussion
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-border-dark px-4 lg:px-8 py-3 flex items-center justify-between">
          <form className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              type="text"
              placeholder="Search discussions..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-slate-100"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>

          <div className="flex items-center gap-2 lg:gap-4 ml-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className={`material-symbols-outlined transition-transform duration-300 ${theme === 'dark' ? 'text-yellow-400 rotate-180' : 'text-slate-600 -rotate-12'}`}>
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notifications Dropdown Container */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-background-dark text-[8px] font-black text-white flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                  <div className="p-4 border-b border-slate-100 dark:border-border-dark flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Notifications</h3>
                    <div className="flex gap-3">
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline"
                      >
                        Mark all as read
                      </button>
                      <button 
                        onClick={handleClearNotifications}
                        className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100 dark:divide-border-dark">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <Link 
                          key={n.id}
                          to={n.link}
                          onClick={() => { handleMarkAsRead(n.id); setShowNotifications(false); }}
                          className={`flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!n.isRead ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                        >
                          <div className="shrink-0 pt-1">
                            {n.avatar ? (
                              <img src={n.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" />
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${n.type === 'badge' ? 'bg-amber-100 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                                <span className="material-symbols-outlined text-xl">
                                  {n.type === 'badge' ? 'workspace_premium' : n.type === 'upvote' ? 'thumb_up' : n.type === 'mention' ? 'alternate_email' : 'notifications'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!n.isRead ? 'font-black text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-400'}`}>
                              {n.message}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{n.timestamp}</p>
                          </div>
                          {!n.isRead && <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>}
                        </Link>
                      ))
                    ) : (
                      <div className="py-12 text-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-20">notifications_off</span>
                        <p className="text-[10px] font-black uppercase tracking-widest">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-border-dark hidden sm:block"></div>
            <Link to="/profile" className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Alex Rivers</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Pro Contributor</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 dark:border-border-dark">
                <img src="https://picsum.photos/seed/alex/100/100" alt="Avatar" className="h-full w-full object-cover" />
              </div>
            </Link>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-1">
          {children}
        </main>

        <footer className="mt-auto py-8 border-t border-slate-200 dark:border-border-dark flex flex-col md:flex-row justify-between items-center text-slate-500 text-[11px] font-bold uppercase tracking-widest px-8">
          <p>© 2024 ForumHub Community.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-primary transition-colors duration-200">Guidelines</Link>
            <Link to="#" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors duration-200">Terms of Service</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
