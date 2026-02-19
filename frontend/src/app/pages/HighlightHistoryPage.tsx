import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Film, Calendar, Award, Download, ExternalLink, Trash2 } from 'lucide-react';
import { API_URL } from '../../config';

interface Highlight {
  _id: string;
  video_filename: string;
  highlight_filename: string;
  num_highlights: number;
  total_duration_sec: number;
  created_at: string;
  highlight_moments?: Array<{
    number: number;
    time_sec: number;
    score: number;
    types: string[];
  }>;
}

export default function HighlightHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchHighlights();
  }, [user, navigate]);

  const fetchHighlights = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/my-highlights`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.status === 'success') {
        setHighlights(data.highlights);
      } else {
        setError(data.message || 'Failed to load highlights');
      }
    } catch (err) {
      setError('Failed to load highlights');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTopScore = (moments?: Array<{ score: number }>) => {
    if (!moments || moments.length === 0) return 0;
    return Math.max(...moments.map(m => m.score));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your highlights...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            🎬 My Highlight Reels
          </h1>
          <p className="text-xl text-gray-300">
            All your generated highlights in one place
          </p>
        </div>

        {/* Stats Summary */}
        {highlights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30 p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{highlights.length}</div>
              <div className="text-gray-300">Total Reels</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30 p-4 text-center">
              <div className="text-3xl font-bold text-pink-400">
                {highlights.reduce((sum, h) => sum + h.num_highlights, 0)}
              </div>
              <div className="text-gray-300">Total Moments</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30 p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {Math.max(...highlights.map(h => getTopScore(h.highlight_moments)))}
              </div>
              <div className="text-gray-300">Best Score</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30 p-4 text-center">
              <div className="text-3xl font-bold text-green-400">
                {highlights.reduce((sum, h) => sum + h.total_duration_sec, 0)}s
              </div>
              <div className="text-gray-300">Total Duration</div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {highlights.length === 0 && !error && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30 p-12 text-center">
            <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Highlights Yet</h2>
            <p className="text-gray-400 mb-6">
              Generate your first highlight reel to see it here!
            </p>
            <button
              onClick={() => navigate('/highlights')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-bold"
            >
              Generate Highlights
            </button>
          </div>
        )}

        {/* Highlights Grid */}
        {highlights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight) => (
              <div
                key={highlight._id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30 overflow-hidden hover:border-purple-500/60 transition"
              >
                {/* Video Preview */}
                <div className="relative bg-gray-900 aspect-video">
                  <video
                    className="w-full h-full object-cover"
                    src={`${API_URL}/outputs/${highlight.highlight_filename}`}
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect fill='%23111827' width='400' height='225'/%3E%3C/svg%3E"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div className="flex items-center gap-2 text-white">
                      <Film className="w-4 h-4" />
                      <span className="text-sm font-bold">{highlight.num_highlights} Moments</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(highlight.created_at)}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-bold">
                        Score: {getTopScore(highlight.highlight_moments)}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {highlight.total_duration_sec}s
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`${API_URL}/download-highlight/${highlight.highlight_filename}`}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center justify-center gap-2 text-sm font-bold"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                    <a
                      href={`${API_URL}/outputs/${highlight.highlight_filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generate More Button */}
        {highlights.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/highlights')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition font-bold text-lg"
            >
              ✨ Generate More Highlights
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
