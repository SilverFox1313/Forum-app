
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
  reputation: number;
  joinedAt: string;
  postsCount: number;
  solutionsCount: number;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  author: User;
  body: string;
  timestamp: string;
  upvotes: number;
  replies: Comment[];
}

export interface Post {
  id: string;
  title: string;
  body: string;
  author: User;
  category: 'Engineering' | 'Design' | 'Performance' | 'General';
  tags: string[];
  upvotes: number;
  commentsCount: number;
  timestamp: string;
  thumbnail?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  topicsCount: string;
  postsCount: string;
  status: string;
  color: string;
  latestPost?: {
    title: string;
    author: string;
    time: string;
    avatar: string;
  };
}
