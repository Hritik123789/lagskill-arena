import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Zap, Target } from 'lucide-react';
import { API_URL } from '../../config.ts';

interface LeaderboardEntry {
  rank: number;
  username: string;
  performance_score: number;
  reaction_time: number;
  fps: number;
  game_preset: string;
  updated_at: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedGame]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/leaderboard?game_preset=${selectedGame}&limit=100`
      );
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50';
    if (rank <= 10) return 'bg-[#1c2128] border-blue-500/30';
    return 'bg-[#161b22] border-[#30363d]';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-purple-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Global Leaderboard
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Top performers ranked by overall performance score
          </p>
        </div>

        {/* Game Filter */}
        <div className="flex justify-center gap-4 mb-8">
          {['all', 'valorant', 'csgo', 'bgmi'].map((game) => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                selectedGame === game
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#161b22] text-gray-400 hover:bg-[#1c2128]'
              }`}
            >
              {game === 'all' ? 'All Games' : game.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Loading leaderboard...</p>
          </div>
        )}

        {/* Leaderboard Table */}
        {!loading && leaderboard.length > 0 && (
          <div className="space-y-3">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#161b22] border border-[#30363d] rounded-lg text-gray-400 text-sm font-semibold">
              <div className="col-span-1">Rank</div>
              <div className="col-span-3">Player</div>
              <div className="col-span-2 text-center">Performance</div>
              <div className="col-span-2 text-center">Reaction Time</div>
              <div className="col-span-2 text-center">FPS</div>
              <div className="col-span-2 text-center">Game</div>
            </div>

            {/* Leaderboard Entries */}
            {leaderboard.map((entry) => (
              <div
                key={`${entry.username}-${entry.rank}`}
                className={`grid grid-cols-12 gap-4 px-6 py-4 border rounded-lg transition-all hover:scale-[1.02] ${getRankBg(
                  entry.rank
                )}`}
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Username */}
                <div className="col-span-3 flex items-center">
                  <span className="font-semibold text-white truncate">
                    {entry.username}
                  </span>
                </div>

                {/* Performance Score */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className={`font-bold ${getPerformanceColor(entry.performance_score)}`}>
                      {entry.performance_score.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Reaction Time */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">{entry.reaction_time}ms</span>
                  </div>
                </div>

                {/* FPS */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{entry.fps.toFixed(0)}</span>
                  </div>
                </div>

                {/* Game */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className="px-3 py-1 bg-[#0d1117] rounded-full text-xs font-semibold text-gray-400 uppercase">
                    {entry.game_preset}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && leaderboard.length === 0 && (
          <div className="text-center py-12 bg-[#161b22] border border-[#30363d] rounded-lg">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No leaderboard entries yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Be the first to upload a video and claim the top spot!
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-3">How Rankings Work</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Rankings are based on your best performance score across all sessions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Performance score combines FPS, reaction time, and gameplay metrics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Upload more videos to improve your ranking and climb the leaderboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Filter by game to see how you rank in your favorite title</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
