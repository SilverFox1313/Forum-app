
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gemini } from '../services/geminiService';
import { postService } from '../services/postService';

const CreateThreadPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [tags, setTags] = useState<string[]>(['javascript', 'react']);
  const [tagInput, setTagInput] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSuggestTags = async () => {
    if (!title || !content) return;
    setIsSuggesting(true);
    const suggested = await gemini.suggestTags(title, content);
    if (suggested.length > 0) {
      setTags(Array.from(new Set([...tags, ...suggested])));
    }
    setIsSuggesting(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && tags.length < 5) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please provide both a title and content for your discussion.");
      return;
    }

    setIsPublishing(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      postService.createPost({
        title,
        body: content,
        category,
        tags
      });

      navigate('/');
    } catch (error) {
      console.error("Failed to publish:", error);
      alert("Something went wrong while publishing. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6">
        <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Home</button>
        <span className="material-symbols-outlined text-xs leading-none">chevron_right</span>
        <span className="text-slate-900 dark:text-slate-100 font-black">Create New</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight mb-2">Create New Discussion</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Share your technical challenges, showcase projects, or ask for help.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Title</label>
            <input 
              className="w-full bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl px-4 py-4 text-xl font-black focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-400"
              placeholder="What's on your mind? Be descriptive..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Content</label>
            <div className="border border-slate-200 dark:border-border-dark rounded-xl bg-white dark:bg-card-dark overflow-hidden flex flex-col min-h-[400px]">
              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-slate-800/30">
                {['format_bold', 'format_italic', 'code', 'link', 'format_list_bulleted', 'image'].map(icon => (
                  <button key={icon} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  </button>
                ))}
                <div className="flex-grow"></div>
                <button className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary px-2 transition-colors">Preview Markdown</button>
              </div>
              <textarea 
                className="flex-grow w-full bg-transparent border-none resize-none p-6 focus:ring-0 text-base leading-relaxed placeholder:text-slate-400 font-medium"
                placeholder="Explain your topic in detail..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-200 dark:border-border-dark flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500 text-[14px]">check_circle</span>
                  <span>Draft saved 2m ago</span>
                </div>
                <span>Markdown supported</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl p-5 space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Category</label>
            <div className="relative">
              <select 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 appearance-none focus:ring-2 focus:ring-primary/50 outline-none font-bold text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Performance">Performance</option>
                <option value="General">General</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">unfold_more</span>
            </div>
          </div>

          <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tags</label>
              <button 
                onClick={handleSuggestTags}
                disabled={isSuggesting || !title || !content}
                className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline disabled:opacity-50"
              >
                {isSuggesting ? 'Suggesting...' : 'Suggest AI Tags'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 uppercase tracking-widest">
                  {tag} <button onClick={() => removeTag(tag)} className="material-symbols-outlined text-[14px] hover:text-red-500">close</button>
                </span>
              ))}
            </div>
            <input 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-medium" 
              placeholder="Add tags (enter to add)" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            <p className="text-[10px] text-slate-400 italic font-bold">Max 5 tags. Help others find your post.</p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-3">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              <span>Posting Tips</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-3 font-bold">
              <li className="flex gap-2"><span className="text-primary mt-0.5">•</span> Be specific about the problem.</li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">•</span> Include code snippets.</li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">•</span> Check for duplicates.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-border-dark">
        <button onClick={() => navigate(-1)} className="w-full sm:w-auto px-6 py-3 text-slate-500 hover:text-red-500 font-black uppercase tracking-widest transition-colors text-[10px]">Cancel & Discard</button>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
          <button className="w-full sm:w-auto px-8 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">drafts</span>
            Save Draft
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className={`w-full sm:w-auto px-10 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 ${isPublishing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isPublishing ? 'sync' : 'send'}
            </span>
            {isPublishing ? 'Publishing...' : 'Publish Discussion'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateThreadPage;
