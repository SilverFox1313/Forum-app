
import { Post, User } from '../types';

const STORAGE_KEY = 'forumhub_posts';

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

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'How to scale React applications for enterprise use?',
    body: 'Exploring architecture patterns like micro-frontends, state management performance, and code-splitting strategies for large teams.',
    author: {
      id: 's1',
      name: 'Sarah Chen',
      username: 'sarah_dev',
      avatar: 'https://picsum.photos/seed/sarah/50/50',
      role: 'Engineering',
      reputation: 1200,
      joinedAt: '2022-01-01',
      postsCount: 45,
      solutionsCount: 12
    },
    category: 'Engineering',
    tags: ['react', 'enterprise', 'architecture'],
    upvotes: 1200,
    commentsCount: 45,
    timestamp: '2 hours ago',
    thumbnail: 'https://picsum.photos/seed/tech1/320/180'
  },
  {
    id: '2',
    title: 'Modern UI design patterns for 2024',
    body: 'Diving deep into the return of skeuomorphism, the refinement of bento grids, and high-density information displays.',
    author: {
      id: 'a1',
      name: 'Alex Rivera',
      username: 'arivera',
      avatar: 'https://picsum.photos/seed/alex/50/50',
      role: 'Design',
      reputation: 8500,
      joinedAt: '2021-10-01',
      postsCount: 1248,
      solutionsCount: 42
    },
    category: 'Design',
    tags: ['ui-ux', 'trends', 'design'],
    upvotes: 856,
    commentsCount: 128,
    timestamp: '5 hours ago',
    thumbnail: 'https://picsum.photos/seed/design1/320/180'
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
      thumbnail: `https://picsum.photos/seed/${Date.now()}/320/180`
    };
    
    const updatedPosts = [newPost, ...posts];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    return newPost;
  },

  getPostById: (id: string): Post | undefined => {
    return postService.getPosts().find(p => p.id === id);
  }
};
