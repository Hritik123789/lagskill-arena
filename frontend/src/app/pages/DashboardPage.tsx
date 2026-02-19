import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Target, Clock, TrendingUp, BarChart3, Shield, Award, Zap, AlertTriangle, CheckCircle, Trophy, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../../config';

interface Session {
  id: string;
  created_at: string;
  video_filename: string;
  avg_characters: number;
  max_characters: number;
  total_frames: number;
  video_fps: number;
  estimated_reaction_time_ms: number;
  performance_score: number;
  motion_stability?: number;
  verdict?: {
    type: string;
    title: string;
    description: string;
    recommendations: string[];
  };
  ai_tips?: string[];
}

export function DashboardPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log('DashboardPage: user =', user);
  console.log('DashboardPage: user?.is_pro =', user?.is_pro);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    fetchSessions();
  }, [user, token, navigate]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const avgReactionTime = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.estimated_reaction_time_ms, 0) / sessions.length)
    : 0;

  const avgPerformanceScore = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.performance_score, 0) / sessions.length)
    : 0;

  // Performance Tier System
  const getPerformanceTier = (score: number) => {
    if (score >= 90) return { name: 'Diamond', color: 'cyan', icon: '💎', min: 90, max: 100, bgClass: 'from-cyan-900/40 to-blue-900/40', borderClass: 'border-cyan-500/50', textClass: 'text-cyan-400' };
    if (score >= 75) return { name: 'Platinum', color: 'purple', icon: '🏆', min: 75, max: 90, bgClass: 'from-purple-900/40 to-indigo-900/40', borderClass: 'border-purple-500/50', textClass: 'text-purple-400' };
    if (score >= 60) return { name: 'Gold', color: 'yellow', icon: '🥇', min: 60, max: 75, bgClass: 'from-yellow-900/40 to-orange-900/40', borderClass: 'border-yellow-500/50', textClass: 'text-yellow-400' };
    if (score >= 40) return { name: 'Silver', color: 'gray', icon: '🥈', min: 40, max: 60, bgClass: 'from-gray-900/40 to-slate-900/40', borderClass: 'border-gray-500/50', textClass: 'text-gray-400' };
    return { name: 'Bronze', color: 'orange', icon: '🥉', min: 0, max: 40, bgClass: 'from-orange-900/40 to-red-900/40', borderClass: 'border-orange-500/50', textClass: 'text-orange-400' };
  };

  const currentTier = getPerformanceTier(avgPerformanceScore);
  const nextTier = getPerformanceTier(currentTier.max + 1);
  const progressToNextTier = currentTier.name !== 'Diamond'
    ? ((avgPerformanceScore - currentTier.min) / (currentTier.max - currentTier.min)) * 100 
    : 100;

  // Get latest session with verdict
  const latestSessionWithVerdict = sessions.find(s => s.verdict);

  const getVerdictColor = (type: string) => {
    switch (type) {
      case 'excellent': return 'green';
      case 'good': return 'blue';
      case 'needs_work': return 'yellow';
      case 'upgrade': return 'red';
      case 'average': return 'orange';
      default: return 'gray';
    }
  };

  const getVerdictIcon = (type: string) => {
    switch (type) {
      case 'excellent': return <Award className="w-8 h-8 text-green-400" />;
      case 'good': return <CheckCircle className="w-8 h-8 text-blue-400" />;
      case 'needs_work': return <Target className="w-8 h-8 text-yellow-400" />;
      case 'upgrade': return <AlertTriangle className="w-8 h-8 text-red-400" />;
      case 'average': return <Activity className="w-8 h-8 text-orange-400" />;
      default: return <Zap className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                {user.is_pro && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    PRO
                  </span>
                )}
              </div>
              <p className="text-gray-400">Welcome back, {user.username}!</p>
            </div>
            <div className="flex items-center gap-4">
              {!user.is_pro && (
                <button
                  onClick={() => navigate('/upgrade')}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg transition-all flex items-center gap-2 font-medium"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Pro
                </button>
              )}
              {user.is_admin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Plan Status Card */}
          <div className={`${
            user.is_pro 
              ? 'bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-yellow-500/50' 
              : 'bg-gradient-to-r from-gray-900/40 to-slate-900/40 border-gray-600/50'
          } border-2 rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${
                  user.is_pro ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                } rounded-lg flex items-center justify-center`}>
                  {user.is_pro ? (
                    <Crown className="w-6 h-6 text-yellow-400" />
                  ) : (
                    <Zap className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400">Current Plan:</span>
                    <span className={`text-lg font-bold ${
                      user.is_pro ? 'text-yellow-400' : 'text-gray-300'
                    }`}>
                      {user.is_pro ? 'Pro' : 'Free'}
                    </span>
                  </div>
                  {!user.is_pro && (
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">{user.credits}/3 credits left today</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">Resets daily</span>
                    </div>
                  )}
                  {user.is_pro && (
                    <div className="text-sm text-yellow-300">
                      ✨ Unlimited analysis • Advanced AI insights • Full history
                    </div>
                  )}
                </div>
              </div>
              {!user.is_pro && (
                <button
                  onClick={() => navigate('/upgrade')}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg transition-all font-medium flex items-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Upgrade Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview with Performance Tier */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Total Sessions</h3>
            </div>
            <p className="text-3xl font-bold text-white">{sessions.length}</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Avg Reaction</h3>
            </div>
            <p className="text-3xl font-bold text-white">{avgReactionTime}ms</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/20 rounded flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Performance</h3>
            </div>
            <p className="text-3xl font-bold text-white">{avgPerformanceScore}</p>
          </div>

          {/* Performance Tier Card - GAMIFIED */}
          <div className={`bg-gradient-to-br ${currentTier.bgClass} border-2 ${currentTier.borderClass} rounded-lg p-6 relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-2xl">{currentTier.icon}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-300">Performance Tier</h3>
              </div>
              <p className={`text-3xl font-bold ${currentTier.textClass} mb-1`}>
                {currentTier.name}
              </p>
              {currentTier.name !== 'Diamond' ? (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>To {nextTier.name}</span>
                    <span>{Math.round(progressToNextTier)}%</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r from-${currentTier.color}-500 to-${nextTier.color}-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${progressToNextTier}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {currentTier.max - avgPerformanceScore} points to next tier
                  </p>
                </div>
              ) : (
                <p className="text-xs text-cyan-300 mt-2">🎉 Maximum tier reached!</p>
              )}
            </div>
          </div>
        </div>

        {/* AI Verdict Card */}
        {latestSessionWithVerdict && latestSessionWithVerdict.verdict && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-indigo-900/40 border-2 border-purple-500/50 rounded-xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">AI Coach Verdict</h2>
                <span className="ml-auto text-xs text-gray-400">
                  Latest Analysis • {new Date(latestSessionWithVerdict.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-start gap-6">
                <div className={`flex-shrink-0 w-20 h-20 bg-${getVerdictColor(latestSessionWithVerdict.verdict.type)}-500/20 rounded-xl flex items-center justify-center border-2 border-${getVerdictColor(latestSessionWithVerdict.verdict.type)}-500/30`}>
                  {getVerdictIcon(latestSessionWithVerdict.verdict.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-3xl font-bold text-white">
                      {latestSessionWithVerdict.verdict.title}
                    </h3>
                    <span className={`px-4 py-1.5 bg-${getVerdictColor(latestSessionWithVerdict.verdict.type)}-500/20 text-${getVerdictColor(latestSessionWithVerdict.verdict.type)}-400 text-sm font-medium rounded-full border border-${getVerdictColor(latestSessionWithVerdict.verdict.type)}-500/30`}>
                      {latestSessionWithVerdict.verdict.type.replace('_', '-').toUpperCase()}
                    </span>
                  </div>

                  <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                    {latestSessionWithVerdict.verdict.description}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#0d1117]/50 rounded-lg p-4 border border-[#30363d]">
                      <div className="text-sm text-gray-400 mb-1">Reaction Time</div>
                      <div className={`text-2xl font-bold ${
                        latestSessionWithVerdict.estimated_reaction_time_ms < 200 ? 'text-green-400' :
                        latestSessionWithVerdict.estimated_reaction_time_ms < 250 ? 'text-blue-400' :
                        'text-yellow-400'
                      }`}>
                        {latestSessionWithVerdict.estimated_reaction_time_ms}ms
                      </div>
                    </div>
                    <div className="bg-[#0d1117]/50 rounded-lg p-4 border border-[#30363d]">
                      <div className="text-sm text-gray-400 mb-1">System FPS</div>
                      <div className={`text-2xl font-bold ${
                        latestSessionWithVerdict.video_fps >= 60 ? 'text-green-400' :
                        latestSessionWithVerdict.video_fps >= 45 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {Math.round(latestSessionWithVerdict.video_fps)}
                      </div>
                    </div>
                    <div className="bg-[#0d1117]/50 rounded-lg p-4 border border-[#30363d]">
                      <div className="text-sm text-gray-400 mb-1">Performance</div>
                      <div className={`text-2xl font-bold ${
                        latestSessionWithVerdict.performance_score >= 80 ? 'text-green-400' :
                        latestSessionWithVerdict.performance_score >= 60 ? 'text-blue-400' :
                        'text-orange-400'
                      }`}>
                        {Math.round(latestSessionWithVerdict.performance_score)}%
                      </div>
                    </div>
                  </div>

                  {/* Top Recommendations */}
                  {latestSessionWithVerdict.verdict.recommendations && latestSessionWithVerdict.verdict.recommendations.length > 0 && (
                    <div className="bg-[#0d1117]/50 rounded-lg p-4 border border-[#30363d]">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Top Recommendations:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {latestSessionWithVerdict.verdict.recommendations.slice(0, 4).map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className={`w-4 h-4 text-${getVerdictColor(latestSessionWithVerdict.verdict!.type)}-400 flex-shrink-0 mt-0.5`} />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/session/${latestSessionWithVerdict.id}`)}
                    className={`mt-6 w-full px-6 py-3 bg-${getVerdictColor(latestSessionWithVerdict.verdict.type)}-600 hover:bg-${getVerdictColor(latestSessionWithVerdict.verdict.type)}-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2`}
                  >
                    View Full Analysis Report
                    <TrendingUp className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400 italic">
                "Know if it's your skills or your system holding you back" - Our AI analyzes both to give you the truth.
              </p>
            </div>
          </div>
        )}

        {/* No Verdict Yet - CTA */}
        {!latestSessionWithVerdict && sessions.length === 0 && (
          <div className="mb-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-2 border-dashed border-purple-500/30 rounded-xl p-12 text-center">
            <Zap className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Get Your AI Verdict</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Upload your gameplay video and let our AI analyze whether it's your skills or your system holding you back. 
              Get personalized recommendations to improve your performance.
            </p>
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-lg"
            >
              Upload Your First Video
            </button>
          </div>
        )}

        {/* Sessions List */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Your Sessions</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading sessions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No sessions yet</p>
              <button
                onClick={() => navigate('/demo')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Start Your First Session
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#30363d]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Video</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Reaction Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">FPS</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr 
                      key={session.id} 
                      className="border-b border-[#30363d] hover:bg-[#0d1117] transition-colors cursor-pointer"
                      onClick={() => navigate(`/session/${session.id}`)}
                    >
                      <td className="py-3 px-4 text-sm text-gray-300">
                        {new Date(session.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">{session.video_filename}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`${
                          session.estimated_reaction_time_ms < 200 ? 'text-green-400' :
                          session.estimated_reaction_time_ms < 250 ? 'text-blue-400' :
                          'text-yellow-400'
                        }`}>
                          {session.estimated_reaction_time_ms}ms
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">{Math.round(session.video_fps)}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`font-medium ${
                          session.performance_score >= 80 ? 'text-green-400' :
                          session.performance_score >= 60 ? 'text-blue-400' :
                          'text-orange-400'
                        }`}>
                          {Math.round(session.performance_score)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/session/${session.id}`);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          View Report →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
