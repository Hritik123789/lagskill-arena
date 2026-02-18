import { Link, useLocation } from 'react-router-dom';
import { Target, Menu, X, LogIn, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/demo', label: 'Demo' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/get-started', label: 'Get Started' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
              LagSkillArena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#21262d] text-blue-400'
                    : 'text-gray-300 hover:bg-[#21262d] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Auth Buttons */}
            {user ? (
              <Link
                to="/dashboard"
                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-gray-300 hover:bg-[#21262d] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#30363d]">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded transition-colors ${
                    isActive(link.path)
                      ? 'bg-[#21262d] text-blue-400'
                      : 'text-gray-300 hover:bg-[#21262d] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Auth Button */}
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
