
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Comment as CommentType, Post } from '../types';
import { postService } from '../services/postService';

interface CommentProps {
  comment: CommentType;
  depth?: number;
}

const CommentItem: React.FC<CommentProps> = ({ comment, depth = 0 }) => {
  return (
    <div className={`flex gap-4 ${depth > 0 ? 'ml-6 sm:ml-10 border-l border-slate-100 dark:border-border-dark pl-4' : ''}`}>
      <div className="flex flex-col items-center shrink-0">
        <img src={comment.author.avatar} alt={comment.author.name} className="h-8 w-8 rounded-full border-2 border-primary/20" />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{comment.author.name}</span>
          <span className="text-[10px] uppercase font-bold text-slate-400">{comment.timestamp}</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{comment.body}</p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
            <button className="text-slate-400 hover:text-primary transition-colors flex items-center">
              <span className="material-symbols-outlined text-[18px]">expand_less</span>
            </button>
            <span className="text-xs font-bold min-w-[1ch] text-center">{comment.upvotes}</span>
            <button className="text-slate-400 hover:text-red-500 transition-colors flex items-center">
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </div>
          <button className="text-[10px] font-black text-slate-500 hover:text-primary uppercase tracking-widest transition-colors">Reply</button>
          <button className="text-[10px] font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase tracking-widest transition-colors">Share</button>
        </div>
        
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ThreadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPost = postService.getPostById(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        // Post not found
      }
    }
  }, [id]);

  const handlePostComment = () => {
    if (!commentText.trim() || !id || !post) return;
    
    setIsSubmitting(true);
    // Simulate slight delay for feedback
    setTimeout(() => {
      const newComment = postService.addComment(id, commentText);
      if (newComment) {
        setPost({
          ...post,
          comments: [...post.comments, newComment],
          commentsCount: post.commentsCount + 1
        });
        setCommentText('');
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleUpvote = (delta: number) => {
    if (!id || !post) return;
    const newCount = postService.upvotePost(id, delta);
    setPost({ ...post, upvotes: newCount });
  };

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4"></div>
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/categories" className="hover:text-primary transition-colors">Categories</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 font-black">{post.category}</span>
        </nav>

        <article className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl min-w-[54px]">
                <button 
                  onClick={() => handleUpvote(1)}
                  className="hover:text-primary transition-all active:scale-125"
                >
                  <span className="material-symbols-outlined text-2xl">expand_less</span>
                </button>
                <span className="font-black text-sm tracking-tight">{post.upvotes > 999 ? (post.upvotes/1000).toFixed(1) + 'k' : post.upvotes}</span>
                <button 
                  onClick={() => handleUpvote(-1)}
                  className="hover:text-red-500 transition-all active:scale-125"
                >
                  <span className="material-symbols-outlined text-2xl">expand_more</span>
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Link to="/profile" className="flex items-center gap-2 group">
                    <img src={post.author.avatar} alt="" className="h-6 w-6 rounded-full border border-slate-200 dark:border-border-dark group-hover:border-primary transition-colors" />
                    <span className="text-xs font-black uppercase tracking-widest group-hover:text-primary transition-colors">u/{post.author.username}</span>
                  </Link>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">• {post.timestamp}</span>
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{post.category}</span>
                </div>
                
                <h1 className="text-2xl lg:text-4xl font-black leading-tight tracking-tight mb-6 text-slate-900 dark:text-white">{post.title}</h1>
                
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg leading-relaxed space-y-4">
                  <p>{post.body}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-8">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200/50 dark:border-white/5">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-slate-100 dark:border-border-dark">
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">mode_comment</span>
                {post.commentsCount} Comments
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">share</span>
                Share
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">bookmark</span>
                Save
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-500 transition-colors ml-auto">
                <span className="material-symbols-outlined text-[20px]">flag</span>
                Report
              </button>
            </div>
          </div>
        </article>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Join the Discussion</h3>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Sort by:
              <select className="bg-transparent border-none py-0 px-1 text-primary focus:ring-0 font-black cursor-pointer uppercase">
                <option>Newest</option>
                <option>Best</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark overflow-hidden focus-within:border-primary/50 transition-all mb-10 shadow-sm">
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 p-6 text-sm min-h-[120px] resize-none placeholder:text-slate-500 font-medium"
              placeholder="What are your thoughts on this? Be constructive..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-border-dark">
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-500">
                  <span className="material-symbols-outlined text-lg">format_bold</span>
                </button>
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-500">
                  <span className="material-symbols-outlined text-lg">code</span>
                </button>
              </div>
              <button 
                onClick={handlePostComment}
                disabled={!commentText.trim() || isSubmitting}
                className={`bg-primary text-white text-[10px] font-black uppercase tracking-widest py-2.5 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 ${(!commentText.trim() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {post.comments.length > 0 ? (
              post.comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            ) : (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700 mb-2">forum</span>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">No comments yet. Be the first to start the discussion!</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="w-full lg:w-80 space-y-6">
        <section className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
          <div className={`h-16 w-full ${post.category === 'Engineering' ? 'bg-blue-500' : post.category === 'Design' ? 'bg-purple-500' : 'bg-primary'}`}></div>
          <div className="p-5 -mt-10">
            <div className="flex items-end gap-3 mb-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-900 border-4 border-white dark:border-card-dark shadow-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">
                  {post.category === 'Engineering' ? 'terminal' : post.category === 'Design' ? 'brush' : 'forum'}
                </span>
              </div>
              <div className="pb-1">
                <h4 className="text-lg font-black tracking-tight">{post.category} Hub</h4>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Active Community</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
              Expert discussions regarding {post.category.toLowerCase()} principles, latest trends, and best practices.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-black">12.4k</p>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Members</p>
              </div>
              <div>
                <p className="text-sm font-black">842</p>
                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Online</p>
              </div>
            </div>
            <button className="w-full bg-primary text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5">Join Community</button>
          </div>
        </section>

        <section className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">About the Author</h4>
          <div className="flex items-center gap-4 mb-4">
            <img src={post.author.avatar} alt="" className="h-12 w-12 rounded-full border border-slate-200 dark:border-border-dark" />
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100">{post.author.name}</p>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-4">
            <div className="text-center flex-1">
              <p className="text-sm font-black">{post.author.reputation > 999 ? (post.author.reputation/1000).toFixed(1) + 'k' : post.author.reputation}</p>
              <p className="text-[8px] uppercase font-black text-slate-400">Reputation</p>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-border-dark"></div>
            <div className="text-center flex-1">
              <p className="text-sm font-black">{post.author.solutionsCount}</p>
              <p className="text-[8px] uppercase font-black text-slate-400">Solutions</p>
            </div>
          </div>
          <button className="w-full py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary border border-slate-200 dark:border-border-dark rounded-xl transition-colors">View Full Profile</button>
        </section>
      </aside>
    </div>
  );
};

export default ThreadPage;
