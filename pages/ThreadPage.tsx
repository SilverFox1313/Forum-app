
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Comment as CommentType, Post } from '../types';
import { postService } from '../services/postService';

interface CommentProps {
  comment: CommentType;
  postId: string;
  onNewReply: (parentCommentId: string, newReply: CommentType) => void;
  depth?: number;
}

const CommentItem: React.FC<CommentProps> = ({ comment, postId, onNewReply, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostReply = () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const reply = postService.addReply(postId, comment.id, replyText);
      if (reply) { onNewReply(comment.id, reply); setReplyText(''); setIsReplying(false); }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className={`flex gap-3 sm:gap-4 ${depth > 0 ? 'ml-4 sm:ml-10 border-l border-slate-200 dark:border-border-dark pl-3 sm:pl-4' : ''}`}>
      <img src={comment.author.avatar} alt="" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-primary/20 shrink-0" />
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-black text-slate-900 dark:text-slate-100">{comment.author.name}</span>
          <span className="text-[9px] uppercase font-black text-slate-400">{comment.timestamp}</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{comment.body}</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
            <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-[18px]">expand_less</span></button>
            <span className="text-[11px] font-black text-slate-600 dark:text-slate-400">{comment.upvotes}</span>
            <button className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-[18px]">expand_more</span></button>
          </div>
          <button onClick={() => setIsReplying(!isReplying)} className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary">{isReplying ? 'Cancel' : 'Reply'}</button>
        </div>
        {isReplying && (
          <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <textarea className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-border-dark rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px]" placeholder={`Reply to ${comment.author.name}...`} value={replyText} onChange={(e) => setReplyText(e.target.value)} autoFocus />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setIsReplying(false)} className="px-4 py-1.5 text-[9px] font-black uppercase text-slate-400">Cancel</button>
              <button onClick={handlePostReply} disabled={!replyText.trim() || isSubmitting} className="px-5 py-1.5 bg-primary text-white text-[9px] font-black uppercase rounded-lg">Post</button>
            </div>
          </div>
        )}
        <div className="mt-4 space-y-4">{comment.replies.map(reply => <CommentItem key={reply.id} comment={reply} postId={postId} onNewReply={onNewReply} depth={depth + 1} />)}</div>
      </div>
    </div>
  );
};

const ThreadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPost = postService.getPostById(id);
      if (foundPost) { setPost(foundPost); setIsBookmarked(postService.isBookmarked(id)); }
    }
  }, [id]);

  const handleUpvote = (delta: number) => {
    if (!id || !post) return;
    const newCount = postService.upvotePost(id, delta);
    setPost({ ...post, upvotes: newCount });
  };

  const toggleBookmark = () => {
    if (!id) return;
    setIsBookmarked(postService.toggleBookmark(id));
  };

  const handlePostComment = () => {
    if (!commentText.trim() || !id || !post) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const newComment = postService.addComment(id, commentText);
      if (newComment) { setPost({ ...post, comments: [...post.comments, newComment], commentsCount: post.commentsCount + 1 }); setCommentText(''); }
      setIsSubmitting(false);
    }, 400);
  };

  if (!post) return <div className="flex justify-center py-20"><span className="animate-spin material-symbols-outlined text-primary text-4xl">sync</span></div>;

  return (
    <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8 pb-10">
      <div className="flex-1 min-w-0">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 font-black">{post.category}</span>
        </nav>

        <article className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Upvote Widget (Vertical on Desktop, Horizontal on Mobile) */}
              <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2 sm:p-2.5 rounded-xl border border-slate-100 dark:border-border-dark w-full sm:w-auto">
                <button onClick={() => handleUpvote(1)} className="hover:text-primary p-1"><span className="material-symbols-outlined text-2xl">expand_less</span></button>
                <span className="font-black text-sm">{post.upvotes > 999 ? (post.upvotes/1000).toFixed(1) + 'k' : post.upvotes}</span>
                <button onClick={() => handleUpvote(-1)} className="hover:text-red-500 p-1"><span className="material-symbols-outlined text-2xl">expand_more</span></button>
                <div className="flex-1 sm:hidden"></div>
                <button onClick={toggleBookmark} className={`sm:hidden p-2 rounded-lg ${isBookmarked ? 'text-primary bg-primary/10' : 'text-slate-500'}`}>
                  <span className={`material-symbols-outlined text-xl ${isBookmarked ? 'fill-1' : ''}`}>bookmark</span>
                </button>
              </div>

              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <img src={post.author.avatar} alt="" className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-slate-200" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 truncate max-w-[100px]">u/{post.author.username}</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">• {post.timestamp}</span>
                </div>
                
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight tracking-tight mb-4 sm:mb-6 text-slate-900 dark:text-white break-words">{post.title}</h1>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 break-words">
                  {post.body}
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-black uppercase rounded-lg border border-slate-200/50 dark:border-white/5">#{tag}</span>)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-border-dark overflow-x-auto">
              <div className="flex items-center gap-4 sm:gap-6 min-w-max">
                <button className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase text-slate-500"><span className="material-symbols-outlined text-[18px]">mode_comment</span>{post.commentsCount}</button>
                <button className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase text-slate-500"><span className="material-symbols-outlined text-[18px]">share</span>Share</button>
              </div>
              <button onClick={toggleBookmark} className={`hidden sm:flex items-center gap-2 text-[10px] font-black uppercase transition-colors ${isBookmarked ? 'text-primary' : 'text-slate-500'}`}>
                <span className={`material-symbols-outlined text-[18px] ${isBookmarked ? 'fill-1' : ''}`}>bookmark</span>{isBookmarked ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </article>

        <section className="mt-8 sm:mt-10">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-lg">forum</span>Discussion ({post.commentsCount})</h3>
          <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark overflow-hidden mb-8 shadow-sm">
            <textarea className="w-full bg-transparent border-none focus:ring-0 p-5 sm:p-6 text-sm min-h-[100px] resize-none font-medium" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
            <div className="flex items-center justify-end px-5 sm:px-6 py-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-border-dark">
              <button onClick={handlePostComment} disabled={!commentText.trim() || isSubmitting} className="bg-primary text-white text-[10px] font-black uppercase py-2 px-6 rounded-xl shadow-md transition-all disabled:opacity-50">Post Comment</button>
            </div>
          </div>
          <div className="space-y-6">
            {post.comments.map(comment => <CommentItem key={comment.id} comment={comment} postId={id!} onNewReply={(p, n) => setPost({ ...post, comments: post.comments.map(c => c.id === p ? { ...c, replies: [...c.replies, n] } : c), commentsCount: post.commentsCount + 1 })} />)}
          </div>
        </section>
      </div>

      <aside className="w-full lg:w-80 space-y-6">
        <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark p-5 sm:p-6 shadow-sm">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-5">Author</h4>
          <div className="flex items-center gap-4 mb-4">
            <img src={post.author.avatar} alt="" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-slate-100" />
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100">{post.author.name}</p>
              <p className="text-[10px] font-bold text-primary uppercase">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-4">
            <div className="flex-1 text-center"><p className="text-sm font-black">{post.author.reputation}</p><p className="text-[8px] uppercase font-black text-slate-400">Rep</p></div>
            <div className="w-px h-6 bg-slate-200 dark:bg-border-dark"></div>
            <div className="flex-1 text-center"><p className="text-sm font-black">{post.author.solutionsCount}</p><p className="text-[8px] uppercase font-black text-slate-400">Solved</p></div>
          </div>
          <Link to="/profile" className="block w-full text-center py-2.5 text-[9px] font-black uppercase text-slate-500 border border-slate-200 dark:border-border-dark rounded-xl">Profile</Link>
        </div>
      </aside>
    </div>
  );
};

export default ThreadPage;
