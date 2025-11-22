import React, { useState } from 'react';
import { Image, Send, Sparkles, Loader2, X } from 'lucide-react';
import { generateMagicPost } from '../services/geminiService';

interface CreatePostProps {
  onPost: (content: string, imageUrl?: string) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl.trim()) return;
    
    onPost(content, imageUrl);
    setContent('');
    setImageUrl('');
    setShowImageInput(false);
  };

  const handleMagicPost = async () => {
    if (!content.trim()) return;
    setIsGenerating(true);
    try {
      const magicText = await generateMagicPost(content);
      setContent(magicText);
    } catch (error) {
      alert('Could not generate magic text. Check API Key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 transition-all">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 resize-none outline-none text-lg min-h-[80px]"
          />
          
          {showImageInput && (
            <div className="relative mt-3">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL here..."
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary outline-none transition-all"
                autoFocus
              />
              <button 
                type="button"
                onClick={() => { setShowImageInput(false); setImageUrl(''); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          {imageUrl && (
            <div className="mt-3 relative rounded-lg overflow-hidden max-h-60 w-full">
               <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={() => setImageUrl('')} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className={`p-2 rounded-full transition-colors flex items-center gap-2 text-sm font-medium ${showImageInput ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`}
            >
              <Image size={20} />
              <span className="hidden sm:inline">Photo</span>
            </button>
            <button
              type="button"
              onClick={handleMagicPost}
              disabled={!content.trim() || isGenerating}
              className="p-2 rounded-full text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
            >
              {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              <span className="hidden sm:inline">Magic Polish</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim() && !imageUrl.trim()}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>Post</span>
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
