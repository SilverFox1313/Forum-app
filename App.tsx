
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import FeedPage from './pages/FeedPage';
import CategoriesPage from './pages/CategoriesPage';
import ThreadPage from './pages/ThreadPage';
import ProfilePage from './pages/ProfilePage';
import CreateThreadPage from './pages/CreateThreadPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/trending" element={<FeedPage />} />
          <Route path="/bookmarks" element={<FeedPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/members" element={<div className="p-8 text-center font-black uppercase tracking-widest opacity-50">Members Directory Coming Soon</div>} />
          <Route path="/badges" element={<div className="p-8 text-center font-black uppercase tracking-widest opacity-50">Badges Dashboard Coming Soon</div>} />
          <Route path="/settings" element={<div className="p-8 text-center font-black uppercase tracking-widest opacity-50">Account Settings Coming Soon</div>} />
          <Route path="/thread/:id" element={<ThreadPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create" element={<CreateThreadPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
