import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthForms } from './components/AuthForms';
import { CreatePost } from './components/CreatePost';
import { PostList } from './components/PostList';
import { Post, User } from './types';

// --- LOCAL STORAGE UTILS ---
const STORAGE_KEYS = {
  USER: 'socialpulse_user',
  POSTS: 'socialpulse_posts',
  THEME: 'socialpulse_theme'
};

const App: React.FC = () => {
  // --- STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Load User
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) setUser(JSON.parse(savedUser));

    // Load Posts
    const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Default seed data
      setPosts([
        {
          id: '1',
          authorName: 'Coding Night Team',
          authorEmail: 'admin@smit.com',
          content: 'Welcome to the Coding Night Challenge! Build something amazing tonight. 🚀',
          timestamp: Date.now() - 1000000,
          likes: 42,
          likedBy: [],
          comments: []
        }
      ]);
    }

    // Load Theme
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    setIsLoading(false);
  }, []);

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    if (!isLoading) localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts, isLoading]);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else if (!isLoading) localStorage.removeItem(STORAGE_KEYS.USER);
  }, [user, isLoading]);

  // --- HANDLERS ---

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleCreatePost = (content: string, imageUrl?: string) => {
    if (!user) return;
    const newPost: Post = {
      id: Date.now().toString(),
      authorName: user.name,
      authorEmail: user.email,
      content,
      imageUrl,
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      comments: []
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const handleEditPost = (postId: string, newContent: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: newContent } : p));
  };

  const handleLikePost = (postId: string) => {
    if (!user) return;
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      
      const isLiked = post.likedBy.includes(user.email);
      const newLikedBy = isLiked 
        ? post.likedBy.filter(email => email !== user.email)
        : [...post.likedBy, user.email];
      
      return {
        ...post,
        likes: newLikedBy.length,
        likedBy: newLikedBy
      };
    }));
  };

  if (isLoading) return null; // Or a spinner

  return (
    <HashRouter>
      <Navbar 
        user={user} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        onLogout={handleLogout} 
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-6 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <AuthForms onLogin={handleLogin} /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/" 
              element={
                user ? (
                  <>
                    <CreatePost onPost={handleCreatePost} />
                    <PostList 
                      posts={posts} 
                      currentUser={user}
                      onLike={handleLikePost}
                      onDelete={handleDeletePost}
                      onEdit={handleEditPost}
                    />
                  </>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
