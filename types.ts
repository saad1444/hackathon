export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  authorName: string;
  authorEmail: string; // Used to identify ownership for deletion
  content: string;
  imageUrl?: string;
  timestamp: number;
  likes: number;
  likedBy: string[]; // Array of emails
  comments: Comment[];
}

export enum SortOption {
  LATEST = 'LATEST',
  OLDEST = 'OLDEST',
  MOST_LIKED = 'MOST_LIKED',
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
