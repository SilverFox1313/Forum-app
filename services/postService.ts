
import { Post, User, Comment, Badge } from '../types';

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
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: '1740000000001',
    title: 'How to scale React applications for enterprise use?',
    body: 'Exploring architecture patterns like micro-frontends, state management performance, and code-splitting strategies for large teams.',
    author: MOCK_USERS[0],
    category: 'Engineering',
    tags: ['react', 'enterprise', 'architecture'],
    upvotes: 1242,
    commentsCount: 1,
    timestamp: '2 hours ago',
    thumbnail: 'https://picsum.photos/seed/tech1/320/180',
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
    const allUsers = [...MOCK_USERS, ...authors, CURRENT_USER];
    return Array.from(new Map(allUsers.map(u => [u.id, u])).values());
  },

  getBadges: (): Badge[] => {
    return [
      {
        id: 'b1',
        name: 'First Word',
        description: 'Publish your first discussion thread in the community.',
        icon: 'edit_note',
        category: 'Engagement',
        rarity: 'Common',
        isEarned: true
      },
      {
        id: 'b2',
        name: 'Problem Solver',
        description: 'Get 5 comments marked as the solution by authors.',
        icon: 'task_alt',
        category: 'Expertise',
        rarity: 'Rare',
        isEarned: false,
        progress: { current: 3, target: 5 }
      },
      {
        id: 'b3',
        name: 'Rising Star',
        description: 'Reach a reputation score of 1,000.',
        icon: 'auto_awesome',
        category: 'Engagement',
        rarity: 'Epic',
        isEarned: true
      },
      {
        id: 'b4',
        name: 'Code Mentor',
        description: 'Provide 50 high-quality answers in the Engineering category.',
        icon: 'psychology',
        category: 'Expertise',
        rarity: 'Legendary',
        isEarned: false,
        progress: { current: 12, target: 50 }
      },
      {
        id: 'b5',
        name: 'Networker',
        description: 'Connect with 10 different community members.',
        icon: 'diversity_3',
        category: 'Social',
        rarity: 'Common',
        isEarned: true
      },
      {
        id: 'b6',
        name: 'Beta Tester',
        description: 'Joined during the early access phase of ForumHub.',
        icon: 'bug_report',
        category: 'Special',
        rarity: 'Rare',
        isEarned: true
      },
      {
        id: 'b7',
        name: 'Pixel Perfect',
        description: 'Earn 100 upvotes in the Design category.',
        icon: 'palette',
        category: 'Expertise',
        rarity: 'Epic',
        isEarned: false,
        progress: { current: 45, target: 100 }
      }
    ];
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
    if (addReplyRecursively(posts[postIndex].comments)) {
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
      list.forEach(c => { if (c.replies.length > 0) count(c.replies); });
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
