
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import FeedPage from './pages/FeedPage';
import CategoriesPage from './pages/CategoriesPage';
import ThreadPage from './pages/ThreadPage';
import ProfilePage from './pages/ProfilePage';
import CreateThreadPage from './pages/CreateThreadPage';
import MembersPage from './pages/MembersPage';
import BadgesPage from './pages/BadgesPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/trending" element={<FeedPage />} />
          <Route path="/bookmarks" element={<FeedPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/thread/:id" element={<ThreadPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create" element={<CreateThreadPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
