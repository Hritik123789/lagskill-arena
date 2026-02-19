import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HighlightMoment {
  number: number;
  time_sec: number;
  score: number;
  types: string[];
}

interface HighlightResult {
  status: string;
  highlight_video?: string;
  num_highlights?: number;
  total_duration_sec?: number;
  moments?: HighlightMoment[];
  message?: string;
  suggestions?: string[];
}

export default function HighlightsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<HighlightResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 1000);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/generate-highlights', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error generating highlights:', error);
      setResult({
        status: 'error',
        message: 'Failed to generate highlights. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getMomentTypeIcon = (type: string) => {
    switch (type) {
      case 'multi_enemy':
        return '👥';
      case 'combat':
        return '⚔️';
      case 'intense_action':
        return '🔥';
      case 'enemy_encounter':
        return '🎯';
      case 'quick_kill':
        return '⚡';
      case 'elimination':
        return '💀';
      default:
        return '✨';
    }
  };

  const getMomentTypeLabel = (type: string) => {
    switch (type) {
      case 'multi_enemy':
        return 'Multi-Enemy';
      case 'combat':
        return 'Combat';
      case 'intense_action':
        return 'Intense Action';
      case 'enemy_encounter':
        return 'Enemy Encounter';
      case 'quick_kill':
        return 'Quick Kill';
      case 'elimination':
        return 'Elimination';
      default:
        return type;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-purple-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-300 mb-6">Please login to generate highlight reels</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            🎬 Highlight Reel Generator
          </h1>
          <p className="text-xl text-gray-300">
            AI-powered automatic highlight detection from your gameplay
          </p>
          <p className="text-gray-400 mt-2">
            Upload your full gameplay and get an epic montage of your best moments
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30 p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">📤 Upload Gameplay</h2>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Select Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              disabled={isProcessing}
            />
            {selectedFile && (
              <p className="text-green-400 mt-2">
                ✓ Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedFile || isProcessing}
            className={`w-full py-4 rounded-lg font-bold text-lg transition ${
              !selectedFile || isProcessing
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            }`}
          >
            {isProcessing ? '🔄 Generating Highlights...' : '✨ Generate Highlight Reel'}
          </button>

          {isProcessing && (
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-gray-300 mt-2">{progress}% - Analyzing gameplay...</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30 p-8">
            {result.status === 'success' && result.highlight_video && (
              <>
                <h2 className="text-3xl font-bold text-green-400 mb-4">
                  ✅ Highlight Reel Generated!
                </h2>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-400">{result.num_highlights}</div>
                    <div className="text-gray-300">Highlights</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-pink-400">{result.total_duration_sec}s</div>
                    <div className="text-gray-300">Total Duration</div>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-yellow-400">
                      {result.moments ? Math.max(...result.moments.map(m => m.score)) : 0}
                    </div>
                    <div className="text-gray-300">Top Score</div>
                  </div>
                </div>

                {/* Video Player */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-3">🎥 Your Highlight Reel</h3>
                  <video
                    controls
                    className="w-full rounded-lg border border-purple-500/30"
                    src={`http://localhost:8000/outputs/${result.highlight_video}`}
                  />
                  <a
                    href={`http://localhost:8000/outputs/${result.highlight_video}`}
                    download
                    className="mt-4 inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    ⬇️ Download Highlight Reel
                  </a>
                </div>

                {/* Moments Breakdown */}
                {result.moments && result.moments.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">📊 Highlight Moments</h3>
                    <div className="space-y-3">
                      {result.moments.map((moment) => (
                        <div
                          key={moment.number}
                          className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{getMomentTypeIcon(moment.types[0])}</div>
                            <div>
                              <div className="text-white font-bold">
                                Highlight #{moment.number} - {moment.time_sec.toFixed(1)}s
                              </div>
                              <div className="text-gray-300 text-sm">
                                {moment.types.map(getMomentTypeLabel).join(', ')}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-yellow-400">{moment.score}</div>
                            <div className="text-gray-400 text-sm">Excitement Score</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {result.status === 'no_highlights' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                  ⚠️ No Highlights Detected
                </h2>
                <p className="text-gray-300 mb-4">{result.message}</p>
                {result.suggestions && (
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-white font-bold mb-2">💡 Suggestions:</h3>
                    <ul className="text-gray-300 space-y-1">
                      {result.suggestions.map((suggestion, idx) => (
                        <li key={idx}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {result.status === 'error' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-400 mb-4">❌ Error</h2>
                <p className="text-gray-300">{result.message}</p>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-purple-500/20 p-6">
          <h3 className="text-xl font-bold text-white mb-3">ℹ️ How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <h4 className="font-bold text-purple-400 mb-2">What We Detect:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Multi-enemy encounters</li>
                <li>• Quick eliminations</li>
                <li>• Intense combat sequences</li>
                <li>• High-action moments</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-pink-400 mb-2">Best Results:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Upload 2-5 minute gameplay</li>
                <li>• Include combat and action</li>
                <li>• Clear enemy encounters</li>
                <li>• Good video quality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
