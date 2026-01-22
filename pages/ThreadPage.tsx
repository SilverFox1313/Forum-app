
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
    
    // Slight artificial delay for UX feedback
    setTimeout(() => {
      const reply = postService.addReply(postId, comment.id, replyText);
      if (reply) {
        onNewReply(comment.id, reply);
        setReplyText('');
        setIsReplying(false);
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className={`flex gap-4 ${depth > 0 ? 'ml-6 sm:ml-10 border-l border-slate-200 dark:border-border-dark pl-4' : ''}`}>
      <div className="flex flex-col items-center shrink-0">
        <img src={comment.author.avatar} alt={comment.author.name} className="h-8 w-8 rounded-full border-2 border-primary/20 shadow-sm" />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-black text-slate-900 dark:text-slate-100">{comment.author.name}</span>
          <span className="text-[10px] uppercase font-black text-slate-400">{comment.timestamp}</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{comment.body}</p>
        
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
            <button className="text-slate-400 hover:text-primary transition-colors flex items-center">
              <span className="material-symbols-outlined text-[18px]">expand_less</span>
            </button>
            <span className="text-xs font-black min-w-[1ch] text-center text-slate-600 dark:text-slate-400">{comment.upvotes}</span>
            <button className="text-slate-400 hover:text-red-500 transition-colors flex items-center">
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </div>
          <button 
            onClick={() => setIsReplying(!isReplying)}
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isReplying ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
          >
            {isReplying ? 'Cancel' : 'Reply'}
          </button>
          <button className="text-[10px] font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase tracking-widest transition-colors">Share</button>
        </div>

        {isReplying && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <textarea
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-border-dark rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none min-h-[80px] font-medium transition-all"
              placeholder={`Reply to ${comment.author.name}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
              <button 
                onClick={() => setIsReplying(false)}
                className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handlePostReply}
                disabled={!replyText.trim() || isSubmitting}
                className="px-6 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg disabled:opacity-50 transition-all hover:bg-primary/90"
              >
                {isSubmitting ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              postId={postId} 
              onNewReply={onNewReply} 
              depth={depth + 1} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ThreadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPost = postService.getPostById(id);
      if (foundPost) setPost(foundPost);
    }
  }, [id]);

  const handlePostComment = () => {
    if (!commentText.trim() || !id || !post) return;
    setIsSubmitting(true);
    
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

  const handleNewReply = (parentCommentId: string, newReply: CommentType) => {
    if (!post) return;
    
    const updateCommentsRecursively = (comments: CommentType[]): CommentType[] => {
      return comments.map(c => {
        if (c.id === parentCommentId) {
          return { ...c, replies: [...c.replies, newReply] };
        }
        if (c.replies.length > 0) {
          return { ...c, replies: updateCommentsRecursively(c.replies) };
        }
        return c;
      });
    };

    const updatedComments = updateCommentsRecursively(post.comments);
    setPost({
      ...post,
      comments: updatedComments,
      commentsCount: post.commentsCount + 1
    });
  };

  const handleUpvote = (delta: number) => {
    if (!id || !post) return;
    const newCount = postService.upvotePost(id, delta);
    setPost({ ...post, upvotes: newCount });
  };

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Loading Discussion...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1 min-w-0">
        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 font-black">{post.category}</span>
        </nav>

        <article className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl min-w-[54px] border border-slate-100 dark:border-border-dark">
                <button onClick={() => handleUpvote(1)} className="hover:text-primary transition-all active:scale-125">
                  <span className="material-symbols-outlined text-2xl leading-none">expand_less</span>
                </button>
                <span className="font-black text-sm tracking-tight">{post.upvotes > 999 ? (post.upvotes/1000).toFixed(1) + 'k' : post.upvotes}</span>
                <button onClick={() => handleUpvote(-1)} className="hover:text-red-500 transition-all active:scale-125">
                  <span className="material-symbols-outlined text-2xl leading-none">expand_more</span>
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <img src={post.author.avatar} alt="" className="h-6 w-6 rounded-full border border-slate-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">u/{post.author.username}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">• {post.timestamp}</span>
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{post.category}</span>
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-black leading-tight tracking-tight mb-6 text-slate-900 dark:text-white">{post.title}</h1>
                
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium text-base leading-relaxed mb-8">
                  <p>{post.body}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200/50 dark:border-white/5">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-100 dark:border-border-dark">
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">mode_comment</span>
                {post.commentsCount} Comments
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">share</span>
                Share
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors ml-auto">
                <span className="material-symbols-outlined text-[18px]">bookmark</span>
                Save
              </button>
            </div>
          </div>
        </article>

        <section className="mt-10">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">forum</span>
            Discussions ({post.commentsCount})
          </h3>

          <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all mb-10 shadow-sm">
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 p-6 text-sm min-h-[120px] resize-none placeholder:text-slate-400 font-medium leading-relaxed"
              placeholder="What are your thoughts? Join the conversation..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-border-dark">
              <div className="flex gap-1 text-slate-400">
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
                  <span className="material-symbols-outlined text-lg">format_bold</span>
                </button>
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
                  <span className="material-symbols-outlined text-lg">code</span>
                </button>
              </div>
              <button 
                onClick={handlePostComment}
                disabled={!commentText.trim() || isSubmitting}
                className={`bg-primary text-white text-[10px] font-black uppercase tracking-widest py-2.5 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 ${(!commentText.trim() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0'}`}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {post.comments.length > 0 ? (
              post.comments.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  postId={id!} 
                  onNewReply={handleNewReply} 
                />
              ))
            ) : (
              <div className="py-20 text-center bg-slate-50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-border-dark">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700 mb-4">forum</span>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="w-full lg:w-80 space-y-6">
        <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">About the Author</h4>
          <div className="flex items-center gap-4 mb-4">
            <img src={post.author.avatar} alt="" className="h-12 w-12 rounded-full border border-slate-100" />
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100">{post.author.name}</p>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{post.author.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-4 text-center">
            <div className="flex-1">
              <p className="text-sm font-black tracking-tight">{post.author.reputation > 999 ? (post.author.reputation/1000).toFixed(1) + 'k' : post.author.reputation}</p>
              <p className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Rep</p>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-border-dark mx-2"></div>
            <div className="flex-1">
              <p className="text-sm font-black tracking-tight">{post.author.solutionsCount}</p>
              <p className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Solutions</p>
            </div>
          </div>
          <button className="w-full py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary border border-slate-200 dark:border-border-dark rounded-xl transition-colors">View Profile</button>
        </div>
      </aside>
    </div>
  );
};

export default ThreadPage;
