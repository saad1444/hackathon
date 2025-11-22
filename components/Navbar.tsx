import React from 'react';
import { LogOut, Moon, Sun, Zap } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, isDarkMode, toggleTheme, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              SocialPulse
            </span>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">@{user.email.split('@')[0]}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
