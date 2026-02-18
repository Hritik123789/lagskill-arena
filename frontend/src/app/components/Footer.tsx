import { Link } from 'react-router-dom';
import { Target, Github, Mail, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#161b22] border-t border-[#30363d] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">LagSkillArena</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-Powered Gameplay Performance & Skill Analysis
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Try Demo
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Example Report
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/get-started" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-[#21262d] hover:bg-[#30363d] rounded flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#21262d] hover:bg-[#30363d] rounded flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#21262d] hover:bg-[#30363d] rounded flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#30363d] text-center text-gray-500 text-sm">
          <p>&copy; 2026 LagSkillArena. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
