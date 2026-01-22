
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Comment as CommentType } from '../types';

interface CommentProps {
  comment: CommentType;
  depth?: number;
}

const CommentItem: React.FC<CommentProps> = ({ comment, depth = 0 }) => {
  return (
    <div className={`flex gap-4 ${depth > 0 ? 'ml-6' : ''}`}>
      <div className="flex flex-col items-center">
        <img src={comment.author.avatar} alt={comment.author.name} className="h-8 w-8 rounded-full border-2 border-primary/20" />
        {comment.replies.length > 0 && <div className="w-[2px] flex-1 bg-slate-200 dark:bg-border-dark my-2 rounded-full"></div>}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold">{comment.author.name}</span>
          <span className="text-[10px] uppercase font-bold text-slate-500">{comment.timestamp}</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{comment.body}</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[18px]">expand_less</span></button>
            <span className="text-xs font-bold">{comment.upvotes}</span>
            <button className="text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[18px]">expand_more</span></button>
          </div>
          <button className="text-xs font-bold text-slate-500 hover:text-primary uppercase tracking-widest">Reply</button>
        </div>
        
        {comment.replies.map(reply => (
          <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
};

const ThreadPage: React.FC = () => {
  const { id } = useParams();
  const [commentText, setCommentText] = useState('');

  const MOCK_THREAD = {
    title: 'How to implement complex nested comment structures in React?',
    author: 'dev_architect',
    time: '4 hours ago',
    upvotes: 1200,
    body: `I'm building a forum and need to handle deep nesting efficiently. What are the best practices for performance? Recursion seems like the obvious choice, but I'm worried about rendering overhead with 100+ comments.

Are there any specific patterns like memoization or flattening the data structure that you would recommend for React 18+?`,
    code: `const Comment = ({ comment }) => {
  return (
    <div className="comment-wrapper">
      <div>{comment.body}</div>
      {comment.replies.map(reply => (
        <Comment key={reply.id} comment={reply} />
      ))}
    </div>
  );
};`
  };

  const COMMENTS: CommentType[] = [
    {
      id: 'c1',
      author: { id: 'u1', name: 'react_pro_2024', avatar: 'https://picsum.photos/seed/u1/40/40' } as any,
      body: 'Flattening the data structure is definitely the way to go. Use an object where keys are comment IDs. It makes lookups O(1) and prevents re-rendering the whole tree when one child updates.',
      timestamp: '2h ago',
      upvotes: 42,
      replies: [
        {
          id: 'c2',
          author: { id: 'u2', name: 'frontend_wiz', avatar: 'https://picsum.photos/seed/u2/40/40' } as any,
          body: 'Agreed. Also, consider using windowing (react-window) if the total number of visible comments exceeds 500. For most forums, recursion + memo is fine.',
          timestamp: '1h ago',
          upvotes: 12,
          replies: []
        }
      ]
    }
  ];

  return (
    <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <Link to="/categories" className="hover:text-primary">Categories</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">Thread Detail</span>
        </nav>

        <article className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-800/30 p-2 rounded-lg min-w-[48px]">
                <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">expand_less</span></button>
                <span className="font-bold text-sm">1.2k</span>
                <button className="hover:text-red-500 transition-colors"><span className="material-symbols-outlined">expand_more</span></button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-slate-300 overflow-hidden">
                    <img src="https://picsum.photos/seed/architect/40/40" alt="" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">u/{MOCK_THREAD.author}</span>
                  <span className="text-xs text-slate-500 font-bold">• {MOCK_THREAD.time}</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-black leading-tight tracking-tight mb-4">{MOCK_THREAD.title}</h1>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium space-y-4">
                  <p>{MOCK_THREAD.body}</p>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm overflow-x-auto border border-white/5">
                    <code>{MOCK_THREAD.code}</code>
                  </pre>
                </div>

                <div className="flex gap-2 mt-6">
                  {['React', 'JavaScript', 'WebDev'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-border-dark">
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">mode_comment</span>
                142 Comments
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">share</span>
                Share
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">bookmark</span>
                Save
              </button>
            </div>
          </div>
        </article>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black uppercase tracking-widest">Discussion</h3>
            <select className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-primary focus:ring-0 cursor-pointer">
              <option>Top</option>
              <option>Newest</option>
            </select>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark p-4 mb-8">
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-sm min-h-[100px] resize-none placeholder:text-slate-500 font-medium"
              placeholder="What are your thoughts?"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button className="bg-primary text-white text-[10px] font-black uppercase tracking-widest py-2.5 px-6 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Post Comment</button>
            </div>
          </div>

          <div className="space-y-4">
            {COMMENTS.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </section>
      </div>

      <aside className="w-full lg:w-80 space-y-6">
        <section className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden">
          <div className="bg-primary h-12 w-full"></div>
          <div className="p-4 -mt-8">
            <div className="flex items-end gap-3 mb-3">
              <div className="h-14 w-14 rounded-xl bg-background-dark border-4 border-background-dark shadow-lg flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">terminal</span>
              </div>
              <h4 className="text-lg font-black tracking-tight mb-1">DevCommunity</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
              A place for professional developers to share knowledge and discuss trends.
            </p>
            <div className="flex gap-4 mb-4">
              <div>
                <p className="text-sm font-black">124k</p>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Members</p>
              </div>
              <div>
                <p className="text-sm font-black">1.2k</p>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Online</p>
              </div>
            </div>
            <button className="w-full bg-primary text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Join Community</button>
          </div>
        </section>

        <section className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark p-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Community Rules</h4>
          <ul className="space-y-3">
            {[
              'Be respectful and professional',
              'No spam or self-promotion',
              'Use clear, descriptive titles',
              'Check for duplicates'
            ].map((rule, i) => (
              <li key={i} className="text-xs flex gap-3 font-bold">
                <span className="text-primary">{i+1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
};

export default ThreadPage;
