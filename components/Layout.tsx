
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

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

  // Sync state with URL changes (e.g. back button or clearing search)
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Update the URL immediately for live filtering
    if (value.trim()) {
      // If we are not on the home/feed page, redirect there to show results
      const basePath = location.pathname === '/trending' || location.pathname === '/bookmarks' ? location.pathname : '/';
      navigate(`${basePath}?q=${encodeURIComponent(value.trim())}`, { replace: true });
    } else {
      navigate(location.pathname, { replace: true });
      // If we want to clear and go home:
      if (!value) navigate('/', { replace: true });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on Enter
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-slate-200 dark:border-border-dark flex-col fixed h-full bg-white dark:bg-background-dark z-20">
        <div className="p-6 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white">forum</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">ForumHub</h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
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
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
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
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-border-dark px-4 lg:px-8 py-3 flex items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              type="text"
              placeholder="Search discussions..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm transition-all"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>

          <div className="flex items-center gap-2 lg:gap-4 ml-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-border-dark hidden sm:block"></div>
            <Link to="/profile" className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold">Alex Rivers</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Pro Contributor</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 dark:border-border-dark">
                <img src="https://picsum.photos/seed/alex/100/100" alt="Avatar" className="h-full w-full object-cover" />
              </div>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-8 flex-1">
          {children}
        </main>

        <footer className="mt-auto py-8 border-t border-slate-200 dark:border-border-dark flex flex-col md:flex-row justify-between items-center text-slate-500 text-[11px] font-bold uppercase tracking-widest px-8">
          <p>© 2024 ForumHub Community.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-primary">Guidelines</Link>
            <Link to="#" className="hover:text-primary">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary">Terms of Service</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
