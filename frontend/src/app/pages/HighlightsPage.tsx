import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Share2, Copy, Check, Youtube, Instagram } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ total_highlights_generated: 0, total_moments_detected: 0 });

  // Fetch stats on mount
  React.useEffect(() => {
    fetch('http://localhost:8000/highlight-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, [result]); // Refresh when new highlight is generated

  const handleShare = (platform: string) => {
    if (!result?.highlight_video) return;

    const videoUrl = `${window.location.origin}/outputs/${result.highlight_video}`;
    const downloadUrl = `http://localhost:8000/download-highlight/${result.highlight_video}`;
    const shareText = `Check out my gaming highlights! 🎮 ${result.num_highlights} epic moments with a top score of ${result.moments ? Math.max(...result.moments.map(m => m.score)) : 0}! Generated with LagSkillArena`;

    switch (platform) {
      case 'youtube':
        // Auto-download, copy description, open YouTube Studio
        navigator.clipboard.writeText(`${shareText}\n\nGenerated with LagSkillArena - AI-powered highlight detection`);
        window.open(downloadUrl, '_blank');
        setTimeout(() => {
          window.open('https://studio.youtube.com/channel/UC/videos/upload', '_blank');
        }, 500);
        alert('✅ Video downloading!\n📋 Description copied!\n🎬 YouTube Studio opening...');
        break;
      case 'instagram':
        // Auto-download, copy caption, open Instagram
        navigator.clipboard.writeText(shareText);
        window.open(downloadUrl, '_blank');
        setTimeout(() => {
          window.open('https://www.instagram.com/', '_blank');
        }, 500);
        alert('✅ Video downloading!\n📋 Caption copied!\n📸 Instagram opening...\n\nNote: Use Instagram mobile app to upload Reels');
        break;
      case 'discord':
        // Copy message and open Discord
        const discordMessage = `${shareText}\n${videoUrl}`;
        navigator.clipboard.writeText(discordMessage);
        window.open('https://discord.com/channels/@me', '_blank');
        alert('✅ Message copied!\n💬 Discord opening...\n\nPaste in your server or DM!');
        break;
      case 'copy':
        navigator.clipboard.writeText(videoUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

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

      if (!response.ok) {
        if (response.status === 401) {
          setResult({
            status: 'error',
            message: 'Please login to use the highlight generator.',
          });
        } else {
          const errorData = await response.json();
          setResult({
            status: 'error',
            message: errorData.detail || 'Failed to generate highlights.',
          });
        }
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error generating highlights:', error);
      clearInterval(progressInterval);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Guest Mode Warning */}
        {!user && (
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-yellow-400 font-bold">Guest Mode</h3>
                <p className="text-yellow-200 text-sm">
                  You're using as a guest. Highlights won't be saved.{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="underline hover:text-white font-bold"
                  >
                    Login to save
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
        
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
          
          {/* Stats */}
          {stats.total_highlights_generated > 0 && (
            <div className="flex justify-center gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.total_highlights_generated}</div>
                <div className="text-gray-400 text-sm">Highlights Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">{stats.total_moments_detected}</div>
                <div className="text-gray-400 text-sm">Epic Moments Found</div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Section - Hide when results are shown */}
        {!result && (
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
        )}

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
                  >
                    Your browser doesn't support video playback. Please download the file instead.
                  </video>
                  <p className="text-gray-400 text-sm mt-2">
                    💡 If video doesn't play, use the download button or open in new tab
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <a
                      href={`http://localhost:8000/download-highlight/${result.highlight_video}`}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-bold flex items-center gap-2"
                    >
                      ⬇️ Download
                    </a>
                    <button
                      onClick={() => {
                        setResult(null);
                        setSelectedFile(null);
                        setProgress(0);
                      }}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-bold"
                    >
                      ✨ Generate Another
                    </button>
                    <a
                      href={`http://localhost:8000/outputs/${result.highlight_video}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-bold"
                    >
                      🎬 Open in New Tab
                    </a>
                  </div>

                  {/* Social Share Section */}
                  <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-2 mb-3">
                      <Share2 className="w-5 h-5 text-purple-400" />
                      <h4 className="text-white font-bold">Share Your Highlights</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleShare('youtube')}
                        className="px-4 py-2 bg-[#FF0000] hover:bg-[#cc0000] text-white rounded-lg transition flex items-center gap-2"
                      >
                        <Youtube className="w-4 h-4" />
                        Upload to YouTube
                      </button>
                      <button
                        onClick={() => handleShare('instagram')}
                        className="px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white rounded-lg transition flex items-center gap-2"
                      >
                        <Instagram className="w-4 h-4" />
                        Post on Instagram
                      </button>
                      <button
                        onClick={() => handleShare('discord')}
                        className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded-lg transition flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        Share on Discord
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>
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
