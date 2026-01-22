
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { postService } from '../services/postService';

type TabType = 'profile' | 'preferences' | 'security';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [user, setUser] = useState<User>(postService.getCurrentUser());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    role: user.role,
    avatar: user.avatar,
    emailNotifications: true,
    newsletter: false,
    publicProfile: true
  });

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate network
    setTimeout(() => {
      const updated = postService.updateCurrentUser({
        name: formData.name,
        username: formData.username,
        role: formData.role,
        avatar: formData.avatar
      });
      setUser(updated);
      setIsSaving(false);
      setSaveSuccess(true);
      // Force layout refresh if needed
      window.dispatchEvent(new Event('storage'));
    }, 800);
  };

  const handleToggle = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-[800px] mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 font-black">Account Settings</span>
        </nav>
        <h1 className="text-4xl font-black tracking-tight mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your community profile and application preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-48 shrink-0">
          <div className="flex md:flex-col gap-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <span className="material-symbols-outlined text-lg">person</span>
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'preferences' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              Preferences
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <span className="material-symbols-outlined text-lg">security</span>
              Security
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-2xl overflow-hidden shadow-sm">
            {activeTab === 'profile' && (
              <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-border-dark">
                  <div className="relative group">
                    <img src={formData.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md" />
                    <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white">photo_camera</span>
                    </button>
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Your Photo</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">JPG or PNG. Max size 2MB.</p>
                    <div className="flex gap-2 mt-2">
                      <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Upload New</button>
                      <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Display Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                      <input 
                        type="text" 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none" 
                      />
                    </div>
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role / Bio</label>
                    <input 
                      type="text" 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-widest">Email Notifications</h3>
                      <p className="text-xs text-slate-500 font-medium">Receive updates about your post activity.</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('emailNotifications')}
                      className={`w-12 h-6 rounded-full transition-colors relative ${formData.emailNotifications ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.emailNotifications ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-widest">Weekly Newsletter</h3>
                      <p className="text-xs text-slate-500 font-medium">Get a summary of trending discussions.</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('newsletter')}
                      className={`w-12 h-6 rounded-full transition-colors relative ${formData.newsletter ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.newsletter ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-widest">Public Profile</h3>
                      <p className="text-xs text-slate-500 font-medium">Allow anyone to view your profile and activity.</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('publicProfile')}
                      className={`w-12 h-6 rounded-full transition-colors relative ${formData.publicProfile ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.publicProfile ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Password</label>
                    <input type="password" placeholder="New Password" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none" />
                  </div>
                  <div className="pt-4">
                    <h3 className="font-black text-sm uppercase tracking-widest mb-4">Active Sessions</h3>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-border-dark flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">laptop_mac</span>
                        <div>
                          <p className="text-xs font-black">MacBook Pro - San Francisco, CA</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Current Session</p>
                        </div>
                      </div>
                      <button className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:underline">Log Out</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-border-dark flex items-center justify-between">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Changes Saved Successfully
                  </div>
                )}
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`bg-primary text-white text-[10px] font-black uppercase tracking-widest py-2.5 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 ${isSaving ? 'opacity-50' : 'hover:bg-primary/90 hover:-translate-y-0.5'}`}
              >
                {isSaving ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border-2 border-dashed border-red-500/20 bg-red-500/5">
            <h3 className="font-black text-red-500 text-sm uppercase tracking-widest mb-2">Danger Zone</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="px-6 py-2 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
