import React, { useState, useMemo } from 'react';
import { Heart, Trash2, MessageCircle, Search, Clock, ThumbsUp, Filter, Edit2, Check, X } from 'lucide-react';
import { Post, User, SortOption } from '../types';

interface PostListProps {
  posts: Post[];
  currentUser: User;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (postId: string, newContent: string) => void;
}

export const PostList: React.FC<PostListProps> = ({ posts, currentUser, onLike, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.LATEST);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter(post => 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case SortOption.LATEST:
        return result.sort((a, b) => b.timestamp - a.timestamp);
      case SortOption.OLDEST:
        return result.sort((a, b) => a.timestamp - b.timestamp);
      case SortOption.MOST_LIKED:
        return result.sort((a, b) => b.likes - a.likes);
      default:
        return result;
    }
  }, [posts, searchTerm, sortBy]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const startEdit = (post: Post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditContent('');
  };

  const saveEdit = (postId: string) => {
    onEdit(postId, editContent);
    setEditingPostId(null);
    setEditContent('');
  };

  return (
    <div className="space-y-6">
      {/* Controls: Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-20 z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border-none rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSortBy(SortOption.LATEST)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${sortBy === SortOption.LATEST ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'}`}
          >
            <Clock size={16} /> Latest
          </button>
          <button
            onClick={() => setSortBy(SortOption.OLDEST)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${sortBy === SortOption.OLDEST ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'}`}
          >
            <Filter size={16} /> Oldest
          </button>
          <button
            onClick={() => setSortBy(SortOption.MOST_LIKED)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${sortBy === SortOption.MOST_LIKED ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'}`}
          >
            <ThumbsUp size={16} /> Popular
          </button>
        </div>
      </div>

      {/* Post List */}
      <div className="space-y-6">
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed">
            <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
          </div>
        ) : (
          filteredAndSortedPosts.map((post) => {
            const isLiked = post.likedBy.includes(currentUser.email);
            const isOwner = post.authorEmail === currentUser.email;
            const isEditing = editingPostId === post.id;

            return (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
                <div className="p-4">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white font-bold">
                        {post.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{post.authorName}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.timestamp)}</p>
                      </div>
                    </div>
                    {isOwner && !isEditing && (
                      <div className="flex gap-1">
                         <button 
                          onClick={() => startEdit(post)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                          title="Edit Post"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this post?')) onDelete(post.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  {isEditing ? (
                    <div className="mb-3">
                      <textarea
                         value={editContent}
                         onChange={(e) => setEditContent(e.target.value)}
                         className="w-full p-3 bg-gray-50 dark:bg-gray-900 border rounded-lg dark:border-gray-700 dark:text-white resize-none focus:ring-2 focus:ring-primary outline-none"
                         rows={3}
                      />
                      <div className="flex gap-2 mt-2 justify-end">
                        <button onClick={cancelEdit} className="flex items-center gap-1 px-3 py-1 text-sm rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <X size={14} /> Cancel
                        </button>
                        <button onClick={() => saveEdit(post.id)} className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-primary text-white hover:bg-primary/90">
                          <Check size={14} /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 text-lg mb-3 whitespace-pre-wrap leading-relaxed">
                      {post.content}
                    </p>
                  )}

                  {/* Image Attachment */}
                  {post.imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                      <img src={post.imageUrl} alt="Post content" className="w-full max-h-96 object-cover" loading="lazy" />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => onLike(post.id)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors group ${isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500 dark:text-gray-400'}`}
                    >
                      <div className={`p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors ${isLiked ? 'bg-pink-50 dark:bg-pink-900/20' : ''}`}>
                         <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                      </div>
                      <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
                    </button>

                    <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors group">
                       <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                        <MessageCircle size={20} />
                       </div>
                      <span>Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
