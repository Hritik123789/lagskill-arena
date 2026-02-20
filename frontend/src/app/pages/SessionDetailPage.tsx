import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Video, Zap, Target, Activity, 
  TrendingUp, Monitor, Award, AlertCircle, CheckCircle,
  BarChart3, Eye, Brain, Crown, Download, Trophy, Flame, Map
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import domtoimage from 'dom-to-image-more';
import { HeatMapVisualization } from '../components/HeatMapVisualization';
import { API_URL } from '../../config.ts';
import { TimelineVisualization } from '../components/TimelineVisualization';

interface SessionDetail {
  id: string;
  created_at: string;
  video_filename: string;
  game_preset?: string;
  
  // Video stats
  total_frames: number;
  video_fps: number;
  avg_motion_intensity: number;
  motion_stability: number;
  
  // Character detection
  avg_characters: number;
  max_characters: number;
  scene_complexity_score: number;
  
  // Reaction stats
  estimated_reaction_time_ms: number;
  min_reaction_time_ms: number;
  max_reaction_time_ms: number;
  sudden_enemy_encounters: number;
  successful_eliminations: number;
  reaction_time_details?: Array<{
    encounter_num: number;
    reaction_time_ms: number;
    time_sec: number;
  }>;
  
  // Performance
  performance_score: number;
  frame_time_ms: number;
  
  // Verdict
  verdict?: {
    type: string;
    title: string;
    description: string;
    recommendations: string[];
  };
  
  // AI Coach Tips
  ai_tips?: string[];
  
  // Benchmarks
  benchmarks?: {
    reaction_time: {
      percentile: string;
      rank: number;
      color: string;
    };
    fps: {
      percentile: string;
      rank: number;
      color: string;
    };
    performance: {
      percentile: string;
      rank: number;
      color: string;
    };
  };
  
  // Advanced Analytics
  heat_map?: number[][];
  timeline?: Array<{
    frame: number;
    time: number;
    persons: number;
    motion: number;
    detections: Array<{ x: number; y: number; confidence: number }>;
  }>;
}

export function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('SessionDetailPage: user =', user);
    console.log('SessionDetailPage: user?.is_pro =', user?.is_pro);
    
    if (!user || !token) {
      navigate('/login');
      return;
    }

    fetchSessionDetail();
  }, [sessionId, user, token]);

  const fetchSessionDetail = async () => {
    try {
      console.log('Fetching session:', sessionId);
      console.log('Token:', token ? token.substring(0, 20) + '...' : 'null');
      
      const response = await fetch(`${API_URL}/api/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || 'Failed to fetch session details');
      }

      const data = await response.json();
      console.log('Session data received:', data);
      setSession(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Session</h2>
          <p className="text-red-400 mb-2">{error || 'Session not found'}</p>
          <p className="text-gray-400 text-sm mb-6">
            This could happen if the session was deleted or you don't have permission to view it.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getReactionColor = (ms: number) => {
    if (ms < 200) return 'text-green-400';
    if (ms < 250) return 'text-blue-400';
    if (ms < 300) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getVerdictIcon = (type: string) => {
    switch (type) {
      case 'excellent': return <Award className="w-8 h-8 text-green-400" />;
      case 'good': return <CheckCircle className="w-8 h-8 text-blue-400" />;
      case 'needs_work': return <Target className="w-8 h-8 text-yellow-400" />;
      case 'upgrade': return <Monitor className="w-8 h-8 text-orange-400" />;
      default: return <Activity className="w-8 h-8 text-gray-400" />;
    }
  };

  const exportReport = async () => {
    console.log('Export Report clicked');
    console.log('User is Pro:', user?.is_pro);
    console.log('reportRef.current:', reportRef.current);
    
    if (!reportRef.current) {
      alert('Report content not found. Please refresh the page and try again.');
      return;
    }
    
    if (!user?.is_pro) {
      alert('Export feature is only available for Pro users. Please upgrade to Pro.');
      return;
    }
    
    try {
      setExporting(true);
      console.log('Starting export with dom-to-image...');
      
      // Get the actual dimensions
      const element = reportRef.current;
      const width = element.scrollWidth;
      const height = element.scrollHeight;
      
      console.log('Element dimensions:', width, 'x', height);
      
      // Use dom-to-image-more which supports modern CSS
      const dataUrl = await domtoimage.toPng(element, {
        quality: 0.95,
        bgcolor: '#0d1117',
        width: width,
        height: height,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      console.log('Image generated successfully');
      
      // Create a higher quality version
      const img = new Image();
      img.src = dataUrl;
      
      img.onload = () => {
        // Create a canvas with 2x scale for better quality
        const canvas = document.createElement('canvas');
        canvas.width = width * 2;
        canvas.height = height * 2;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0);
          
          const link = document.createElement('a');
          link.download = `lagskill-report-${sessionId}.png`;
          link.href = canvas.toDataURL('image/png', 1.0);
          link.click();
          
          console.log('Export successful!');
          alert('Report exported successfully! Check your Downloads folder.');
        }
        
        setExporting(false);
      };
      
      img.onerror = () => {
        console.error('Failed to load image');
        alert('Failed to process image. Please try again.');
        setExporting(false);
      };
      
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Failed to export report: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
      setExporting(false);
    }
  };

  const getBenchmarkColor = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'text-purple-400 bg-purple-500/20 border-purple-500/50',
      gold: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50',
      green: 'text-green-400 bg-green-500/20 border-green-500/50',
      blue: 'text-blue-400 bg-blue-500/20 border-blue-500/50',
      gray: 'text-gray-400 bg-gray-500/20 border-gray-500/50',
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-[#0d1117] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Session Report</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(session.created_at).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  {session.video_filename}
                </div>
                {session.game_preset && (
                  <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold uppercase">
                    {session.game_preset}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Overall Score</div>
                <div className={`text-4xl font-bold ${getPerformanceColor(session.performance_score)}`}>
                  {session.performance_score}
                </div>
              </div>
              
              {/* Export Button - Pro Only */}
              {user?.is_pro && (
                <button
                  onClick={exportReport}
                  disabled={exporting}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {exporting ? 'Exporting...' : 'Export Report'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Report Content - Wrapped for Export */}
        <div ref={reportRef} className="bg-[#0d1117]">
          {/* Branding Header for Export */}
          <div className="mb-6 pb-4 border-b border-[#30363d]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">LagSkillArena</h2>
                  <p className="text-sm text-gray-400">Performance Analysis Report</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Generated on</div>
                <div className="text-sm text-white">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          
          {/* Community Benchmarks Section */}
          {session.benchmarks && (
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Community Benchmarks</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Reaction Time Benchmark */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-400">Reaction Time</span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {session.estimated_reaction_time_ms}ms
                    </span>
                  </div>
                  <div className={`px-3 py-2 rounded-lg border text-center font-semibold ${getBenchmarkColor(session.benchmarks.reaction_time.color)}`}>
                    {session.benchmarks.reaction_time.percentile}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Better than {session.benchmarks.reaction_time.rank}% of players
                  </div>
                </div>

                {/* FPS Benchmark */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-green-400" />
                      <span className="text-sm font-medium text-gray-400">FPS</span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {session.video_fps.toFixed(0)}
                    </span>
                  </div>
                  <div className={`px-3 py-2 rounded-lg border text-center font-semibold ${getBenchmarkColor(session.benchmarks.fps.color)}`}>
                    {session.benchmarks.fps.percentile}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Better than {session.benchmarks.fps.rank}% of players
                  </div>
                </div>

                {/* Performance Benchmark */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-gray-400">Performance</span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {session.performance_score.toFixed(1)}
                    </span>
                  </div>
                  <div className={`px-3 py-2 rounded-lg border text-center font-semibold ${getBenchmarkColor(session.benchmarks.performance.color)}`}>
                    {session.benchmarks.performance.percentile}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Better than {session.benchmarks.performance.rank}% of players
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Verdict Section */}
        {session.verdict && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getVerdictIcon(session.verdict.type)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{session.verdict.title}</h2>
                <p className="text-gray-300 mb-4">{session.verdict.description}</p>
                
                {session.verdict.recommendations && session.verdict.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Recommendations:</h3>
                    <ul className="space-y-2">
                      {session.verdict.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Coach Tips Section - PRO FEATURE */}
        {user?.is_pro && session.ai_tips && session.ai_tips.length > 0 ? (
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg p-6 mb-6 relative">
            {/* Pro Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                PRO
              </span>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">AI Coach Insights</h2>
              <span className="ml-auto text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                Personalized Analysis
              </span>
            </div>
            <div className="space-y-3">
              {session.ai_tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#0d1117]/50 rounded-lg border border-[#30363d]">
                  <span className="text-blue-400 text-lg mt-0.5">
                    {tip.startsWith('✓') ? '✓' : tip.startsWith('→') ? '→' : tip.startsWith('⚠') ? '⚠' : '💡'}
                  </span>
                  <span className="text-gray-300 flex-1">{tip.replace(/^[✓→⚠💡]\s*/, '')}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300">
                <strong>How it works:</strong> Our AI analyzes your reaction time, system performance, frame stability, 
                and combat effectiveness to provide personalized insights tailored to your gameplay.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900/40 to-slate-900/40 border-2 border-dashed border-gray-600/50 rounded-lg p-8 mb-6 relative">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-500/50">
                  <Crown className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Unlock AI Coach Insights</h3>
                <p className="text-gray-300 mb-4 max-w-md">
                  Get personalized coaching tips, weakness analysis, and training suggestions from our advanced AI
                </p>
                <button
                  onClick={() => navigate('/upgrade')}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg transition-all font-medium inline-flex items-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Upgrade to Pro
                </button>
              </div>
            </div>
            
            {/* Blurred Preview */}
            <div className="opacity-30 blur-sm pointer-events-none">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">AI Coach Insights</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[#0d1117]/50 rounded-lg border border-[#30363d]">
                  <span className="text-blue-400 text-lg">💡</span>
                  <span className="text-gray-300">Your reaction speed is good, but tracking consistency needs work...</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#0d1117]/50 rounded-lg border border-[#30363d]">
                  <span className="text-blue-400 text-lg">⚠</span>
                  <span className="text-gray-300">FPS drops during high scene load suggest system bottleneck...</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#0d1117]/50 rounded-lg border border-[#30363d]">
                  <span className="text-blue-400 text-lg">✓</span>
                  <span className="text-gray-300">Focus on aim stability drills to improve consistency...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Reaction Stats */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Reaction Stats</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Average Reaction</div>
                <div className={`text-2xl font-bold ${getReactionColor(session.estimated_reaction_time_ms)}`}>
                  {session.estimated_reaction_time_ms}ms
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Best</div>
                  <div className="text-lg font-bold text-green-400">
                    {session.min_reaction_time_ms}ms
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Worst</div>
                  <div className="text-lg font-bold text-red-400">
                    {session.max_reaction_time_ms}ms
                  </div>
                </div>
              </div>
              
              {/* Reaction Time Bar Chart */}
              <div className="pt-4">
                <div className="text-xs text-gray-400 mb-2">Reaction Time Comparison</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Best</span>
                      <span className="text-green-400">{session.min_reaction_time_ms}ms</span>
                    </div>
                    <div className="w-full bg-[#0d1117] rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(session.min_reaction_time_ms / session.max_reaction_time_ms) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Average</span>
                      <span className="text-yellow-400">{session.estimated_reaction_time_ms}ms</span>
                    </div>
                    <div className="w-full bg-[#0d1117] rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{ width: `${(session.estimated_reaction_time_ms / session.max_reaction_time_ms) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Worst</span>
                      <span className="text-red-400">{session.max_reaction_time_ms}ms</span>
                    </div>
                    <div className="w-full bg-[#0d1117] rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#30363d]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Encounters</span>
                  <span className="text-white font-medium">{session.sudden_enemy_encounters}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Eliminations</span>
                  <span className="text-white font-medium">{session.successful_eliminations}</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Performance */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">System Performance</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">FPS</div>
                <div className={`text-2xl font-bold ${
                  session.video_fps >= 60 ? 'text-green-400' : 
                  session.video_fps >= 30 ? 'text-yellow-400' : 
                  'text-red-400'
                }`}>
                  {Math.round(session.video_fps)}
                </div>
              </div>
              
              {/* FPS Circular Progress */}
              <div className="flex justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#30363d"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={session.video_fps >= 60 ? '#22c55e' : session.video_fps >= 30 ? '#eab308' : '#ef4444'}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(session.video_fps / 144) * 352} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-2xl font-bold ${
                      session.video_fps >= 60 ? 'text-green-400' : 
                      session.video_fps >= 30 ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {Math.round(session.video_fps)}
                    </div>
                    <div className="text-xs text-gray-400">FPS</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-400 mb-1">Frame Time</div>
                <div className="text-lg font-bold text-white">
                  {session.frame_time_ms.toFixed(2)}ms
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#30363d]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Stability</span>
                  <span className={`font-medium ${
                    session.motion_stability >= 80 ? 'text-green-400' :
                    session.motion_stability >= 60 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {Math.round(session.motion_stability)}%
                  </span>
                </div>
                <div className="w-full bg-[#0d1117] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      session.motion_stability >= 80 ? 'bg-green-500' :
                      session.motion_stability >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${session.motion_stability}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scene Analysis */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Scene Analysis</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Complexity Score</div>
                <div className="text-2xl font-bold text-purple-400">
                  {session.scene_complexity_score.toFixed(1)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Avg Characters</div>
                  <div className="text-lg font-bold text-white">
                    {session.avg_characters.toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Max Characters</div>
                  <div className="text-lg font-bold text-white">
                    {session.max_characters}
                  </div>
                </div>
              </div>
              
              {/* Character Detection Bar Chart */}
              <div className="pt-4">
                <div className="text-xs text-gray-400 mb-2">Character Detection</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Average</span>
                      <span className="text-purple-400">{session.avg_characters.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-[#0d1117] rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${(session.avg_characters / session.max_characters) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Maximum</span>
                      <span className="text-cyan-400">{session.max_characters}</span>
                    </div>
                    <div className="w-full bg-[#0d1117] rounded-full h-2">
                      <div 
                        className="bg-cyan-500 h-2 rounded-full transition-all"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#30363d]">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Motion Intensity</span>
                  <span className="text-white font-medium">
                    {session.avg_motion_intensity.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview Chart */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Performance Overview</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Performance Score */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#30363d"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(session.performance_score / 100) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold text-blue-400">
                    {Math.round(session.performance_score)}
                  </div>
                  <div className="text-xs text-gray-400">%</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Performance</div>
            </div>

            {/* FPS Score */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#30363d"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#22c55e"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(Math.min(session.video_fps, 144) / 144) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold text-green-400">
                    {Math.round(session.video_fps)}
                  </div>
                  <div className="text-xs text-gray-400">FPS</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">System FPS</div>
            </div>

            {/* Stability Score */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#30363d"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#eab308"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(session.motion_stability / 100) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold text-yellow-400">
                    {Math.round(session.motion_stability)}
                  </div>
                  <div className="text-xs text-gray-400">%</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Stability</div>
            </div>

            {/* Reaction Score */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#30363d"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#a855f7"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${((400 - Math.min(session.estimated_reaction_time_ms, 400)) / 400) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold text-purple-400">
                    {session.estimated_reaction_time_ms}
                  </div>
                  <div className="text-xs text-gray-400">ms</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Reaction Time</div>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Section - Pro Feature */}
        {user?.is_pro && (session.heat_map || session.timeline) && (
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Advanced Analytics</h2>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  PRO
                </span>
              </div>
            </div>

            {/* Simple Explanation */}
            <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">📊 What This Shows You</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <strong className="text-purple-400">Heat Map:</strong> The colored areas show where enemies appeared most often. 
                  <span className="text-blue-400"> Blue = rarely</span>, 
                  <span className="text-yellow-400"> Yellow = sometimes</span>, 
                  <span className="text-red-400"> Red = frequently</span>.
                  Use this to predict where enemies will come from!
                </p>
                <p>
                  <strong className="text-blue-400">Timeline:</strong> Shows how many enemies appeared throughout your gameplay. 
                  <span className="text-green-400"> Green bars = enemy count</span>, 
                  <span className="text-blue-400"> Blue line = action intensity</span>.
                  Helps you see when fights happened!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Heat Map */}
              {session.heat_map && session.heat_map.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Map className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Enemy Position Heat Map</h3>
                  </div>
                  <div className="mb-4 p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong className="text-white">💡 How to use this:</strong>
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1 ml-4">
                      <li>• <strong className="text-red-400">Red/Hot areas</strong> = Enemies appear here most often</li>
                      <li>• <strong className="text-blue-400">Blue/Cool areas</strong> = Safer zones, fewer enemies</li>
                      <li>• Pre-aim at hot spots for faster reactions</li>
                      <li>• Position yourself to watch red zones</li>
                    </ul>
                  </div>
                  <HeatMapVisualization data={session.heat_map} width={600} height={400} />
                </div>
              )}

              {/* Timeline */}
              {session.timeline && session.timeline.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Combat Timeline</h3>
                  </div>
                  <div className="mb-4 p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">
                      <strong className="text-white">💡 How to read this:</strong>
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1 ml-4">
                      <li>• <strong className="text-green-400">Green bars</strong> = Number of enemies detected</li>
                      <li>• <strong className="text-blue-400">Blue line</strong> = How much action/movement</li>
                      <li>• Tall bars = Multiple enemies at once</li>
                      <li>• High blue line = Intense combat moments</li>
                    </ul>
                  </div>
                  <TimelineVisualization data={session.timeline} />
                </div>
              )}
            </div>

            {/* Action Tips */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-red-400" />
                  <h4 className="text-sm font-semibold text-red-400">Strategic Positioning</h4>
                </div>
                <p className="text-xs text-gray-300">
                  Use the heat map to position yourself where you can see the most common enemy locations. 
                  Pre-aim at red zones before peeking!
                </p>
              </div>
              
              <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-semibold text-blue-400">Combat Awareness</h4>
                </div>
                <p className="text-xs text-gray-300">
                  The timeline shows when you faced multiple enemies. Practice staying calm during these peak moments 
                  to improve your clutch performance!
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-purple-900/10 border border-purple-500/20 rounded-lg">
              <p className="text-xs text-purple-300">
                <strong>🤖 AI Analysis:</strong> Our computer vision system analyzed every frame of your gameplay, 
                tracking {session.total_frames} frames to identify patterns. This data is unique to your playstyle 
                and helps you improve strategically, not just mechanically.
              </p>
            </div>
          </div>
        )}

        {/* Detailed Reaction Times */}
        {session.reaction_time_details && session.reaction_time_details.length > 0 && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Reaction Time Breakdown</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {session.reaction_time_details.map((rt, i) => (
                <div key={i} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Encounter #{rt.encounter_num}</span>
                    <span className="text-xs text-gray-500">{rt.time_sec}s</span>
                  </div>
                  <div className={`text-2xl font-bold ${getReactionColor(rt.reaction_time_ms)}`}>
                    {rt.reaction_time_ms}ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Summary */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-bold text-white">Performance Summary</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {session.performance_score}
              </div>
              <div className="text-xs text-gray-400">Overall Score</div>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${getReactionColor(session.estimated_reaction_time_ms)} mb-1`}>
                {session.estimated_reaction_time_ms}ms
              </div>
              <div className="text-xs text-gray-400">Avg Reaction</div>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                session.video_fps >= 60 ? 'text-green-400' : 'text-yellow-400'
              } mb-1`}>
                {Math.round(session.video_fps)}
              </div>
              <div className="text-xs text-gray-400">FPS</div>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                session.motion_stability >= 80 ? 'text-green-400' : 'text-yellow-400'
              } mb-1`}>
                {Math.round(session.motion_stability)}%
              </div>
              <div className="text-xs text-gray-400">Stability</div>
            </div>
          </div>
        </div>
        </div>
        {/* End of reportRef div */}
      </div>
    </div>
  );
}
