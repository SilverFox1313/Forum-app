
import { Post, User, Comment } from '../types';

const STORAGE_KEY = 'forumhub_posts';
const BOOKMARKS_KEY = 'forumhub_bookmarks';

const CURRENT_USER: User = {
  id: 'u-current',
  name: 'Alex Rivers',
  username: 'alex_rivers',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  role: 'Pro Contributor',
  reputation: 1250,
  joinedAt: 'Jan 2024',
  postsCount: 12,
  solutionsCount: 3
};

const MOCK_USERS: User[] = [
  {
    id: 's1',
    name: 'Sarah Chen',
    username: 'sarah_dev',
    avatar: 'https://picsum.photos/seed/sarah/150/150',
    role: 'Engineering',
    reputation: 12400,
    joinedAt: 'Jan 2022',
    postsCount: 45,
    solutionsCount: 12
  },
  {
    id: 'a1',
    name: 'Alex Rivera',
    username: 'arivera',
    avatar: 'https://picsum.photos/seed/arivera/150/150',
    role: 'Design',
    reputation: 8500,
    joinedAt: 'Oct 2021',
    postsCount: 1248,
    solutionsCount: 42
  },
  {
    id: 'm1',
    name: 'Marcus Thorne',
    username: 'mthorne',
    avatar: 'https://picsum.photos/seed/marcus/150/150',
    role: 'Performance',
    reputation: 5200,
    joinedAt: 'Mar 2023',
    postsCount: 89,
    solutionsCount: 15
  },
  {
    id: 'f1',
    name: 'Felix Wang',
    username: 'felix_w',
    avatar: 'https://picsum.photos/seed/felix/150/150',
    role: 'Engineering',
    reputation: 3800,
    joinedAt: 'Jun 2023',
    postsCount: 34,
    solutionsCount: 8
  },
  {
    id: 'e1',
    name: 'Elena Belova',
    username: 'ebelova',
    avatar: 'https://picsum.photos/seed/elena/150/150',
    role: 'Design',
    reputation: 7100,
    joinedAt: 'Aug 2022',
    postsCount: 112,
    solutionsCount: 22
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: '1740000000001',
    title: 'How to scale React applications for enterprise use?',
    body: 'Exploring architecture patterns like micro-frontends, state management performance, and code-splitting strategies for large teams. I am looking for real-world experience on how to handle 50+ engineers working on the same codebase.',
    author: MOCK_USERS[0],
    category: 'Engineering',
    tags: ['react', 'enterprise', 'architecture'],
    upvotes: 1242,
    commentsCount: 1,
    timestamp: '2 hours ago',
    thumbnail: 'https://picsum.photos/seed/tech1/320/180',
    comments: [
      {
        id: 'c1',
        author: { id: 'u1', name: 'Markus T.', username: 'mt_dev', avatar: 'https://picsum.photos/seed/markus/40/40' } as any,
        body: 'In our experience, Module Federation has been the key. It allows teams to deploy independently without breaking the shell app.',
        timestamp: '1h ago',
        upvotes: 12,
        replies: []
      }
    ]
  },
  {
    id: '1740000000000',
    title: 'Modern UI design patterns for 2024',
    body: 'Diving deep into the return of skeuomorphism, the refinement of bento grids, and high-density information displays. What do you think about the "Linear" style spreading across SaaS apps?',
    author: MOCK_USERS[1],
    category: 'Design',
    tags: ['ui-ux', 'trends', 'design'],
    upvotes: 856,
    commentsCount: 0,
    timestamp: '5 hours ago',
    thumbnail: 'https://picsum.photos/seed/design1/320/180',
    comments: []
  }
];

export const postService = {
  getPosts: (): Post[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(stored);
  },

  getUsers: (): User[] => {
    const posts = postService.getPosts();
    const authors = posts.map(p => p.author);
    
    // Combine mock users and authors, removing duplicates by ID
    const allUsers = [...MOCK_USERS, ...authors, CURRENT_USER];
    const uniqueUsers = Array.from(new Map(allUsers.map(u => [u.id, u])).values());
    
    return uniqueUsers;
  },

  createPost: (data: { title: string; body: string; category: string; tags: string[] }): Post => {
    const posts = postService.getPosts();
    const newPost: Post = {
      id: Date.now().toString(),
      title: data.title,
      body: data.body,
      author: CURRENT_USER,
      category: data.category as any || 'General',
      tags: data.tags,
      upvotes: 1,
      commentsCount: 0,
      timestamp: 'Just now',
      thumbnail: `https://picsum.photos/seed/${Date.now()}/320/180`,
      comments: []
    };
    
    const updatedPosts = [newPost, ...posts];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    return newPost;
  },

  getPostById: (id: string): Post | undefined => {
    return postService.getPosts().find(p => p.id === id);
  },

  addComment: (postId: string, text: string): Comment | null => {
    const posts = postService.getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return null;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: CURRENT_USER,
      body: text,
      timestamp: 'Just now',
      upvotes: 0,
      replies: []
    };

    posts[postIndex].comments.push(newComment);
    posts[postIndex].commentsCount = postService.calculateTotalComments(posts[postIndex].comments);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return newComment;
  },

  addReply: (postId: string, parentCommentId: string, text: string): Comment | null => {
    const posts = postService.getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return null;

    const newReply: Comment = {
      id: `r-${Date.now()}`,
      author: CURRENT_USER,
      body: text,
      timestamp: 'Just now',
      upvotes: 0,
      replies: []
    };

    const addReplyRecursively = (comments: Comment[]): boolean => {
      for (const comment of comments) {
        if (comment.id === parentCommentId) {
          comment.replies.push(newReply);
          return true;
        }
        if (comment.replies.length > 0) {
          if (addReplyRecursively(comment.replies)) return true;
        }
      }
      return false;
    };

    const success = addReplyRecursively(posts[postIndex].comments);
    if (success) {
      posts[postIndex].commentsCount = postService.calculateTotalComments(posts[postIndex].comments);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
      return newReply;
    }
    return null;
  },

  calculateTotalComments: (comments: Comment[]): number => {
    let total = 0;
    const count = (list: Comment[]) => {
      total += list.length;
      list.forEach(c => {
        if (c.replies.length > 0) count(c.replies);
      });
    };
    count(comments);
    return total;
  },

  upvotePost: (postId: string, delta: number): number => {
    const posts = postService.getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return 0;

    posts[postIndex].upvotes += delta;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return posts[postIndex].upvotes;
  },

  getBookmarkedIds: (): string[] => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  toggleBookmark: (postId: string): boolean => {
    const bookmarks = postService.getBookmarkedIds();
    const index = bookmarks.indexOf(postId);
    let isBookmarked = false;
    if (index === -1) {
      bookmarks.push(postId);
      isBookmarked = true;
    } else {
      bookmarks.splice(index, 1);
      isBookmarked = false;
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return isBookmarked;
  },

  isBookmarked: (postId: string): boolean => {
    return postService.getBookmarkedIds().includes(postId);
  }
};
