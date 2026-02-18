import { useState, useEffect, useRef } from 'react';
import { Target, Upload, Play, BarChart3, Clock, Crosshair, TrendingUp, Zap, Activity, Award, Users, Gamepad2, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Game presets
const GAME_PRESETS = [
  { id: 'bgmi', name: 'BGMI', color: 'orange', avgReaction: 220 },
  { id: 'valorant', name: 'Valorant', color: 'red', avgReaction: 200 },
  { id: 'csgo', name: 'CS:GO', color: 'blue', avgReaction: 195 },
];

export function DemoPage() {
  const [selectedGame, setSelectedGame] = useState(GAME_PRESETS[0]);

  return (
    <div className="py-20 bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Try LagSkillArena
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the platform with our interactive demos and example analyses
          </p>
        </div>

        {/* Game Selector */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Select Your Game</h2>
          </div>
          <div className="flex gap-4">
            {GAME_PRESETS.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedGame.id === game.id
                    ? `bg-${game.color}-600 text-white border-2 border-${game.color}-400`
                    : 'bg-[#161b22] text-gray-400 border-2 border-[#30363d] hover:border-gray-500'
                }`}
              >
                {game.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Game preset affects benchmarks and recommendations
          </p>
        </div>

        <div className="space-y-12">
          {/* Reaction Test Demo */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Reaction Time Test</h2>
                <p className="text-sm text-gray-400">
                  {selectedGame.name} Average: {selectedGame.avgReaction}ms
                </p>
              </div>
            </div>
            <ReactionTest selectedGame={selectedGame} />
          </section>

          {/* Video Upload Demo */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Gameplay Video Analysis</h2>
                <p className="text-sm text-gray-400">
                  Upload your {selectedGame.name} gameplay for AI analysis
                </p>
              </div>
            </div>
            <VideoUploadDemo selectedGame={selectedGame} />
          </section>

          {/* Community Benchmarks */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Community Benchmarks</h2>
            </div>
            <CommunityBenchmarks selectedGame={selectedGame} />
          </section>
        </div>
      </div>
    </div>
  );
}

function ReactionTest({ selectedGame }: { selectedGame: typeof GAME_PRESETS[0] }) {
  const [selectedMode, setSelectedMode] = useState<'click' | 'target' | 'precision'>('click');

  const modes = [
    {
      id: 'click' as const,
      name: 'Click Reaction',
      description: 'Click when the screen turns green',
      icon: Zap,
      color: 'blue'
    },
    {
      id: 'target' as const,
      name: 'Target Tracking',
      description: 'Click moving targets as they appear',
      icon: Crosshair,
      color: 'purple'
    },
    {
      id: 'precision' as const,
      name: 'Precision Clicking',
      description: 'Click small targets accurately',
      icon: Target,
      color: 'green'
    }
  ];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
      {/* Mode Selector */}
      <div className="mb-6">
        <h3 className="text-white font-medium mb-3">Select Test Mode:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMode === mode.id
                    ? `border-${mode.color}-500 bg-${mode.color}-500/10`
                    : 'border-[#30363d] bg-[#0d1117] hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 bg-${mode.color}-500/20 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${mode.color}-400`} />
                  </div>
                  <h4 className="text-white font-semibold text-left">{mode.name}</h4>
                </div>
                <p className="text-sm text-gray-400 text-left">{mode.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render selected game mode */}
      {selectedMode === 'click' && <ClickReactionGame selectedGame={selectedGame} />}
      {selectedMode === 'target' && <TargetTrackingGame selectedGame={selectedGame} />}
      {selectedMode === 'precision' && <PrecisionClickingGame selectedGame={selectedGame} />}
    </div>
  );
}

// Click Reaction Game (Original)
function ClickReactionGame({ selectedGame }: { selectedGame: typeof GAME_PRESETS[0] }) {
  const [state, setState] = useState<'waiting' | 'ready' | 'click' | 'result'>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | undefined>(undefined);

  const startTest = () => {
    setState('ready');
    const delay = Math.random() * 3000 + 2000;
    timeoutRef.current = setTimeout(() => {
      setState('click');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (state === 'click') {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setAttempts([...attempts, time]);
      setState('result');
    } else if (state === 'ready') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('waiting');
    }
  };

  const reset = () => {
    setState('waiting');
    setReactionTime(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const avgTime = attempts.length > 0
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
    : null;

  const getPerformanceRating = (time: number) => {
    if (time < selectedGame.avgReaction - 30) return { text: 'Excellent', color: 'text-green-400' };
    if (time < selectedGame.avgReaction) return { text: 'Good', color: 'text-blue-400' };
    if (time < selectedGame.avgReaction + 30) return { text: 'Average', color: 'text-yellow-400' };
    return { text: 'Below Average', color: 'text-orange-400' };
  };

  return (
    <div>
      <div
        className={`relative h-80 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
          state === 'waiting' ? 'bg-[#0d1117]' :
          state === 'ready' ? 'bg-red-900/30' :
          state === 'click' ? 'bg-green-900/30' :
          'bg-blue-900/30'
        }`}
        onClick={handleClick}
      >
        {state === 'waiting' && (
          <div className="text-center">
            <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-white mb-2">Click to Start</p>
            <p className="text-sm text-gray-400">
              Click when the screen turns green
            </p>
          </div>
        )}

        {state === 'ready' && (
          <div className="text-center">
            <Clock className="w-16 h-16 text-red-400 mx-auto mb-4 animate-pulse" />
            <p className="text-xl text-white">Wait for it...</p>
          </div>
        )}

        {state === 'click' && (
          <div className="text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 animate-pulse" />
            <p className="text-2xl font-bold text-white">CLICK NOW!</p>
          </div>
        )}

        {state === 'result' && reactionTime && (
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-400 mb-2">
              {reactionTime}ms
            </div>
            <p className={`text-lg mb-2 ${getPerformanceRating(reactionTime).color}`}>
              {getPerformanceRating(reactionTime).text}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {selectedGame.name} Average: {selectedGame.avgReaction}ms
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {attempts.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#0d1117] border border-[#30363d] rounded p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{avgTime}ms</div>
              <div className="text-sm text-gray-400">Average</div>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{Math.min(...attempts)}ms</div>
              <div className="text-sm text-gray-400">Best</div>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded p-4 text-center">
              <div className="text-2xl font-bold text-gray-400 mb-1">{attempts.length}</div>
              <div className="text-sm text-gray-400">Attempts</div>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {attempts.length >= 3 ? Math.round((Math.max(...attempts) - Math.min(...attempts)) / avgTime! * 100) : 0}%
              </div>
              <div className="text-sm text-gray-400">Variance</div>
            </div>
          </div>

          {attempts.length >= 3 && (
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Your Progress
              </h4>
              <div className="relative h-32 bg-[#161b22] rounded border border-[#30363d] p-2">
                <svg className="w-full h-full" viewBox="0 0 400 100">
                  <line x1="0" y1="90" x2="400" y2="90" stroke="#30363d" strokeWidth="1" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#30363d" strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="0" y1="30" x2="400" y2="30" stroke="#30363d" strokeWidth="1" strokeDasharray="2,2" />
                  
                  <line x1="0" y1={90 - (selectedGame.avgReaction / 5)} x2="400" y2={90 - (selectedGame.avgReaction / 5)} 
                        stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                  
                  <polyline
                    points={attempts.slice(-10).map((time, i) => {
                      const x = (i / Math.max(attempts.slice(-10).length - 1, 1)) * 380 + 10;
                      const y = 90 - Math.min(time / 5, 85);
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  
                  {attempts.slice(-10).map((time, i) => {
                    const x = (i / Math.max(attempts.slice(-10).length - 1, 1)) * 380 + 10;
                    const y = 90 - Math.min(time / 5, 85);
                    return <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" />;
                  })}
                </svg>
                <div className="absolute top-2 right-2 text-xs text-yellow-400">
                  --- {selectedGame.name} Avg
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Target Tracking Game
function TargetTrackingGame({ selectedGame }: { selectedGame: typeof GAME_PRESETS[0] }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; hit: boolean }>>([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const gameIntervalRef = useRef<number | undefined>(undefined);
  const timerIntervalRef = useRef<number | undefined>(undefined);
  const targetCreatedTimeRef = useRef<number>(0);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setMisses(0);
    setTimeLeft(30);
    setReactionTimes([]);
    spawnTarget();
    
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const spawnTarget = () => {
    const newTarget = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 10,
      hit: false
    };
    setTargets([newTarget]);
    targetCreatedTimeRef.current = Date.now();
    
    gameIntervalRef.current = setTimeout(() => {
      if (gameState === 'playing') {
        setMisses((prev) => prev + 1);
        spawnTarget();
      }
    }, 1500);
  };

  const hitTarget = (targetId: number) => {
    const reactionTime = Date.now() - targetCreatedTimeRef.current;
    setReactionTimes((prev) => [...prev, reactionTime]);
    setScore((prev) => prev + 1);
    setTargets((prev) => prev.map(t => t.id === targetId ? { ...t, hit: true } : t));
    
    if (gameIntervalRef.current) clearTimeout(gameIntervalRef.current);
    setTimeout(() => {
      if (gameState === 'playing') {
        spawnTarget();
      }
    }, 200);
  };

  const endGame = () => {
    setGameState('finished');
    if (gameIntervalRef.current) clearTimeout(gameIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) clearTimeout(gameIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const avgReactionTime = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const accuracy = score + misses > 0 ? Math.round((score / (score + misses)) * 100) : 0;

  return (
    <div>
      <div className="relative h-80 rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden">
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Crosshair className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-xl text-white mb-2">Target Tracking</p>
            <p className="text-sm text-gray-400 mb-6">Click targets as fast as you can!</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors font-medium"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <>
            <div className="absolute top-4 left-4 right-4 flex justify-between text-white">
              <div className="bg-[#161b22] px-4 py-2 rounded border border-[#30363d]">
                Score: <span className="text-purple-400 font-bold">{score}</span>
              </div>
              <div className="bg-[#161b22] px-4 py-2 rounded border border-[#30363d]">
                Time: <span className="text-blue-400 font-bold">{timeLeft}s</span>
              </div>
              <div className="bg-[#161b22] px-4 py-2 rounded border border-[#30363d]">
                Misses: <span className="text-red-400 font-bold">{misses}</span>
              </div>
            </div>

            {targets.map((target) => (
              <div
                key={target.id}
                onClick={() => !target.hit && hitTarget(target.id)}
                className={`absolute w-16 h-16 rounded-full cursor-pointer transition-all ${
                  target.hit
                    ? 'bg-green-500 scale-0'
                    : 'bg-purple-500 hover:bg-purple-400 animate-pulse'
                }`}
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            ))}
          </>
        )}

        {gameState === 'finished' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1117]">
            <Award className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-2xl text-white mb-4">Game Over!</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{score}</div>
                <div className="text-sm text-gray-400">Hits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{avgReactionTime}ms</div>
                <div className="text-sm text-gray-400">Avg Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{accuracy}%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {gameState === 'finished' && reactionTimes.length > 0 && (
        <div className="mt-6 bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Performance Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">{avgReactionTime}ms</div>
              <div className="text-xs text-gray-400">Avg Reaction</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{Math.min(...reactionTimes)}ms</div>
              <div className="text-xs text-gray-400">Fastest</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-400">{Math.max(...reactionTimes)}ms</div>
              <div className="text-xs text-gray-400">Slowest</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">{accuracy}%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Precision Clicking Game
function PrecisionClickingGame({ selectedGame }: { selectedGame: typeof GAME_PRESETS[0] }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [currentTarget, setCurrentTarget] = useState<{ x: number; y: number; size: number } | null>(null);
  const [round, setRound] = useState(0);
  const [totalRounds] = useState(10);
  const [scores, setScores] = useState<number[]>([]);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const targetCreatedTimeRef = useRef<number>(0);

  const startGame = () => {
    setGameState('playing');
    setRound(0);
    setScores([]);
    setReactionTimes([]);
    spawnTarget(0);
  };

  const spawnTarget = (roundNum: number) => {
    const size = Math.max(20, 60 - roundNum * 3);
    setCurrentTarget({
      x: Math.random() * 70 + 15,
      y: Math.random() * 60 + 15,
      size
    });
    targetCreatedTimeRef.current = Date.now();
  };

  const handleTargetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTarget || gameState !== 'playing') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const targetCenterX = (currentTarget.x / 100) * rect.width;
    const targetCenterY = (currentTarget.y / 100) * rect.height;
    
    const distance = Math.sqrt(
      Math.pow(clickX - targetCenterX, 2) + Math.pow(clickY - targetCenterY, 2)
    );

    const reactionTime = Date.now() - targetCreatedTimeRef.current;
    setReactionTimes((prev) => [...prev, reactionTime]);

    const targetRadius = currentTarget.size / 2;
    const hitScore = distance <= targetRadius ? 100 : 0;
    setScores((prev) => [...prev, hitScore]);

    const nextRound = round + 1;
    if (nextRound >= totalRounds) {
      setGameState('finished');
    } else {
      setRound(nextRound);
      setTimeout(() => spawnTarget(nextRound), 300);
    }
  };

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const avgReactionTime = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const hits = scores.filter(s => s > 0).length;
  const accuracy = totalRounds > 0 ? Math.round((hits / totalRounds) * 100) : 0;

  return (
    <div>
      <div 
        className="relative h-80 rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden cursor-crosshair"
        onClick={handleTargetClick}
      >
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Target className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-xl text-white mb-2">Precision Clicking</p>
            <p className="text-sm text-gray-400 mb-6">Click the center of shrinking targets!</p>
            <button
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded transition-colors font-medium pointer-events-auto"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'playing' && currentTarget && (
          <>
            <div className="absolute top-4 left-4 right-4 flex justify-between text-white pointer-events-none">
              <div className="bg-[#161b22] px-4 py-2 rounded border border-[#30363d]">
                Round: <span className="text-green-400 font-bold">{round + 1}/{totalRounds}</span>
              </div>
              <div className="bg-[#161b22] px-4 py-2 rounded border border-[#30363d]">
                Hits: <span className="text-blue-400 font-bold">{hits}/{round}</span>
              </div>
            </div>

            <div
              className="absolute rounded-full border-4 border-green-500 bg-green-500/20 pointer-events-none"
              style={{
                left: `${currentTarget.x}%`,
                top: `${currentTarget.y}%`,
                width: `${currentTarget.size}px`,
                height: `${currentTarget.size}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
            </div>
          </>
        )}

        {gameState === 'finished' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1117] pointer-events-none">
            <Award className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-2xl text-white mb-4">Challenge Complete!</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{hits}/{totalRounds}</div>
                <div className="text-sm text-gray-400">Hits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{avgReactionTime}ms</div>
                <div className="text-sm text-gray-400">Avg Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{accuracy}%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors pointer-events-auto"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {gameState === 'finished' && reactionTimes.length > 0 && (
        <div className="mt-6 bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Performance Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{avgReactionTime}ms</div>
              <div className="text-xs text-gray-400">Avg Reaction</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">{Math.min(...reactionTimes)}ms</div>
              <div className="text-xs text-gray-400">Fastest</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">{accuracy}%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-400">{avgScore}</div>
              <div className="text-xs text-gray-400">Avg Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VideoUploadDemo({ selectedGame }: { selectedGame: typeof GAME_PRESETS[0] }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, token } = useAuth();

  const API_URL = 'http://localhost:8000';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Analyze video
      const analyzeUrl = user && token 
        ? `${API_URL}/api/analyze-video?game_preset=${selectedGame.id}`
        : `${API_URL}/analyze-video-vision`;
      
      console.log('Upload Debug:', {
        hasUser: !!user,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'null',
        url: analyzeUrl,
        gamePreset: selectedGame.id
      });
      
      const headers: HeadersInit = {};
      if (user && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(analyzeUrl, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to analyze video');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze video');
      console.error('Video analysis error:', err);
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleDownloadAnnotated = () => {
    if (results?.annotated_video) {
      window.open(`${API_URL}/download-video/${results.annotated_video}`, '_blank');
    }
  };

  const reset = () => {
    setFile(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
      {/* Credit Warning for Free Users */}
      {user && !user.is_pro && (
        <div className="mb-6 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-yellow-400">Free Plan Limits</h4>
                <span className="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded">
                  {user.credits} credits left today
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-2">
                Each video analysis uses 1 credit. Free users get 3 credits per day.
              </p>
              <button
                onClick={() => window.location.href = '/upgrade'}
                className="text-xs text-yellow-400 hover:text-yellow-300 underline"
              >
                Upgrade to Pro for unlimited analysis →
              </button>
            </div>
          </div>
        </div>
      )}

      {!file ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/mov,video/avi,video/mkv"
            onChange={handleFileSelect}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="block border-2 border-dashed border-[#30363d] rounded-lg p-12 text-center cursor-pointer hover:border-green-500/50 hover:bg-green-500/5 transition-colors"
          >
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">Upload Gameplay Video</h3>
            <p className="text-sm text-gray-400 mb-4">
              Click to select • MP4, MOV, AVI, MKV • Max 500MB
            </p>
            <span className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
              Select Video
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded flex items-center justify-center">
                  <Play className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{file.name}</div>
                  <div className="text-sm text-gray-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              </div>
            </div>

            {!results && !analyzing && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors font-medium"
              >
                {uploading ? 'Uploading...' : 'Analyze Video with YOLO'}
              </button>
            )}

            {analyzing && (
              <div>
                <div className="w-full bg-[#21262d] rounded-full h-2 mb-2">
                  <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
                </div>
                <div className="text-xs text-gray-400">Analyzing video with YOLO AI... This may take a few minutes</div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
              <p className="text-xs text-gray-400 mt-2">Make sure the backend is running on http://localhost:8000</p>
            </div>
          )}

          {results && (
            <>
              {/* AI Verdict Section */}
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  AI Coach Verdict
                </h4>
                <AIVerdict results={results} selectedGame={selectedGame} />
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  YOLO Analysis Results
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Avg Characters</div>
                    <div className="text-xl font-bold text-green-400">{results.avg_characters}</div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Max Characters</div>
                    <div className="text-xl font-bold text-green-400">{results.max_characters}</div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Total Frames</div>
                    <div className="text-xl font-bold text-blue-400">{results.total_frames}</div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Scene Complexity</div>
                    <div className="text-xl font-bold text-purple-400">{results.scene_complexity_score}</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Performance Metrics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Video FPS</div>
                    <div className="text-xl font-bold text-cyan-400">{results.video_fps}</div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Frame Time</div>
                    <div className="text-xl font-bold text-cyan-400">{results.frame_time_ms}ms</div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Motion Stability</div>
                    <div className="text-xl font-bold text-green-400">{results.motion_stability}%</div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Avg Reaction Time</div>
                    <div className="text-xl font-bold text-yellow-400">{results.estimated_reaction_time_ms}ms</div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Best Reaction</div>
                    <div className="text-xl font-bold text-green-400">{results.min_reaction_time_ms}ms</div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Worst Reaction</div>
                    <div className="text-xl font-bold text-red-400">{results.max_reaction_time_ms}ms</div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Enemy Encounters</div>
                    <div className="text-xl font-bold text-orange-400">{results.sudden_enemy_encounters}</div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Eliminations</div>
                    <div className="text-xl font-bold text-purple-400">{results.successful_eliminations}</div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Performance Score</div>
                    <div className="text-xl font-bold text-blue-400">{results.performance_score}%</div>
                  </div>
                </div>
              </div>

              {/* Reaction Time Details */}
              {results.reaction_time_details && results.reaction_time_details.length > 0 && (
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Reaction Time Analysis (Top 10 Encounters)
                  </h4>
                  <div className="space-y-2">
                    {results.reaction_time_details.map((rt: any, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-[#161b22] border border-[#30363d] rounded p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-500/20 rounded flex items-center justify-center">
                            <span className="text-sm font-bold text-yellow-400">#{rt.encounter_num}</span>
                          </div>
                          <div>
                            <div className="text-sm text-white">Encounter at {rt.time_sec}s</div>
                            <div className="text-xs text-gray-400">Enemy appeared → Eliminated</div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${
                          rt.reaction_time_ms < 200 ? 'text-green-400' :
                          rt.reaction_time_ms < 300 ? 'text-yellow-400' :
                          'text-orange-400'
                        }`}>
                          {rt.reaction_time_ms}ms
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded p-3">
                    <p className="text-xs text-blue-300">
                      <strong>How it works:</strong> The AI tracks when new enemies appear in your view and measures 
                      the time until they disappear (elimination). This gives you real gameplay reaction times!
                    </p>
                  </div>
                </div>
              )}

              {/* Encounter Timeline */}
              {results.encounter_details && results.encounter_details.length > 0 && (
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-400" />
                    Enemy Encounter Timeline
                  </h4>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#30363d]" />
                    <div className="space-y-4">
                      {results.encounter_details.map((encounter: any, i: number) => (
                        <div key={i} className="relative pl-12">
                          <div className="absolute left-0 w-8 h-8 bg-orange-500/20 border-2 border-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-orange-400">{encounter.encounter_num}</span>
                          </div>
                          <div className="bg-[#161b22] border border-[#30363d] rounded p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm text-white font-medium">
                                  {encounter.new_enemies} {encounter.new_enemies === 1 ? 'Enemy' : 'Enemies'} Appeared
                                </div>
                                <div className="text-xs text-gray-400">At {encounter.time_sec}s</div>
                              </div>
                              <div className="text-xs text-orange-400">
                                Combat Situation
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FPS Graph */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  FPS Analysis
                </h4>
                <div className="relative h-48 bg-[#161b22] rounded border border-[#30363d] p-4">
                  <svg className="w-full h-full" viewBox="0 0 400 150">
                    <line x1="0" y1="130" x2="400" y2="130" stroke="#30363d" strokeWidth="1" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#30363d" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="0" y1="70" x2="400" y2="70" stroke="#30363d" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="0" y1="40" x2="400" y2="40" stroke="#30363d" strokeWidth="1" strokeDasharray="2,2" />
                    
                    <polyline
                      points="0,40 40,42 80,38 120,45 160,40 200,43 240,41 280,39 320,42 360,40 400,41"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                    />
                    
                    <polygon
                      points="0,130 0,40 40,42 80,38 120,45 160,40 200,43 240,41 280,39 320,42 360,40 400,41 400,130"
                      fill="url(#gradient2)"
                      opacity="0.3"
                    />
                    
                    <defs>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#0d1117" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute bottom-2 left-4 text-xs text-gray-500">Start</div>
                  <div className="absolute bottom-2 right-4 text-xs text-gray-500">End</div>
                  <div className="absolute top-2 left-4 text-xs text-gray-500">{results.video_fps} FPS</div>
                </div>
              </div>

              {/* Character Detection Graph */}
              {results.persons_per_frame && results.persons_per_frame.length > 0 && (
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-cyan-400" />
                    Character Detection Over Time
                  </h4>
                  <div className="relative h-48 bg-[#161b22] rounded border border-[#30363d] p-4">
                    <svg className="w-full h-full" viewBox="0 0 400 150">
                      <line x1="0" y1="130" x2="400" y2="130" stroke="#30363d" strokeWidth="1" />
                      <line x1="0" y1="100" x2="400" y2="100" stroke="#30363d" strokeWidth="1" strokeDasharray="2,2" />
                      <line x1="0" y1="70" x2="400" y2="70" stroke="#30363d" strokeWidth="1" strokeDasharray="2,2" />
                      <line x1="0" y1="40" x2="400" y2="40" stroke="#30363d" strokeWidth="1" strokeDasharray="2,2" />
                      
                      <polyline
                        points={results.persons_per_frame.map((count: number, i: number) => {
                          const x = (i / (results.persons_per_frame.length - 1)) * 400;
                          const y = 130 - (count * 20);
                          return `${x},${Math.max(y, 10)}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                      />
                      
                      <polygon
                        points={`0,130 ${results.persons_per_frame.map((count: number, i: number) => {
                          const x = (i / (results.persons_per_frame.length - 1)) * 400;
                          const y = 130 - (count * 20);
                          return `${x},${Math.max(y, 10)}`;
                        }).join(' ')} 400,130`}
                        fill="url(#gradient)"
                        opacity="0.3"
                      />
                      
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#0d1117" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute bottom-2 left-4 text-xs text-gray-500">Frame 0</div>
                    <div className="absolute bottom-2 right-4 text-xs text-gray-500">Frame {results.persons_per_frame.length}</div>
                    <div className="absolute top-2 left-4 text-xs text-gray-500">{results.max_characters} max</div>
                  </div>
                </div>
              )}

              {results.annotated_video && (
                <div className="bg-[#0d1117] border border-green-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded flex items-center justify-center">
                      <Play className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Annotated Video Ready!</h4>
                      <p className="text-sm text-gray-400">Video with bounding boxes around detected characters</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadAnnotated}
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Annotated Video
                  </button>
                </div>
              )}
            </>
          )}

          <button
            onClick={reset}
            className="w-full px-6 py-2 bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] rounded transition-colors"
          >
            Upload Different Video
          </button>
        </div>
      )}
    </div>
  );
}


// AI Verdict Component
function AIVerdict({ results, selectedGame }: { results: any; selectedGame: typeof GAME_PRESETS[0] }) {
  const getVerdict = () => {
    const fps = results.video_fps;
    const reactionTime = results.estimated_reaction_time_ms;
    const stability = results.motion_stability;
    const performanceScore = results.performance_score;

    // Determine if skill-limited, system-limited, or mixed
    const goodFPS = fps >= 60;
    const goodStability = stability >= 70;
    const goodReaction = reactionTime <= selectedGame.avgReaction + 20;
    
    if (goodFPS && goodStability && !goodReaction) {
      return {
        type: 'Skill-Limited',
        color: 'green',
        icon: Target,
        title: 'Your Skills Need Work',
        description: 'Your system is performing well, but your reaction time and gameplay mechanics could use improvement.',
        recommendations: [
          'Practice reaction time drills daily',
          'Focus on crosshair placement',
          'Review your gameplay to identify mistakes',
          'Consider aim training tools'
        ]
      };
    } else if (!goodFPS || !goodStability) {
      if (goodReaction) {
        return {
          type: 'System-Limited',
          color: 'red',
          icon: Activity,
          title: 'Hardware is Holding You Back',
          description: 'Your skills are solid, but your system cannot keep up with your gameplay demands.',
          recommendations: [
            'Upgrade GPU for better FPS',
            'Lower graphics settings',
            'Close background applications',
            'Consider upgrading RAM or CPU'
          ]
        };
      } else {
        return {
          type: 'Mixed',
          color: 'yellow',
          icon: BarChart3,
          title: 'Both Skills and System Need Attention',
          description: 'You have opportunities to improve both your gameplay skills and system performance.',
          recommendations: [
            'Practice while optimizing settings',
            'Upgrade hardware gradually',
            'Focus on consistent practice',
            'Monitor performance metrics regularly'
          ]
        };
      }
    } else {
      return {
        type: 'Excellent',
        color: 'purple',
        icon: Award,
        title: 'You\'re Performing Great!',
        description: 'Both your skills and system are in excellent shape. Keep up the great work!',
        recommendations: [
          'Maintain consistent practice',
          'Challenge yourself with harder opponents',
          'Share your setup with the community',
          'Consider competitive play'
        ]
      };
    }
  };

  const verdict = getVerdict();
  const Icon = verdict.icon;

  return (
    <div>
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-16 h-16 bg-${verdict.color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-8 h-8 text-${verdict.color}-400`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-2xl font-bold text-white">{verdict.title}</h3>
            <span className={`px-3 py-1 bg-${verdict.color}-500/20 text-${verdict.color}-400 text-sm rounded-full`}>
              {verdict.type}
            </span>
          </div>
          <p className="text-gray-300 mb-4">{verdict.description}</p>
        </div>
      </div>
      
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">AI Recommendations:</h4>
        <ul className="space-y-2">
          {verdict.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className={`text-${verdict.color}-400 mt-1`}>•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Community Benchmarks Component
function CommunityBenchmarks({ selectedGame }: { selectedGame: typeof GAME_PRESETS[0] }) {
  const benchmarks = {
    bgmi: {
      reactionTime: { avg: 220, top10: 180, top1: 150 },
      fps: { avg: 60, top10: 120, top1: 144 },
      accuracy: { avg: 45, top10: 65, top1: 80 }
    },
    valorant: {
      reactionTime: { avg: 200, top10: 165, top1: 140 },
      fps: { avg: 90, top10: 144, top1: 240 },
      accuracy: { avg: 50, top10: 70, top1: 85 }
    },
    csgo: {
      reactionTime: { avg: 195, top10: 160, top1: 135 },
      fps: { avg: 100, top10: 200, top1: 300 },
      accuracy: { avg: 48, top10: 68, top1: 82 }
    }
  };

  const data = benchmarks[selectedGame.id as keyof typeof benchmarks];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reaction Time Benchmark */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Reaction Time</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Average Player</span>
              <span className="text-lg font-bold text-gray-300">{data.reactionTime.avg}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Top 10%</span>
              <span className="text-lg font-bold text-blue-400">{data.reactionTime.top10}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Top 1%</span>
              <span className="text-lg font-bold text-purple-400">{data.reactionTime.top1}ms</span>
            </div>
          </div>
          <div className="mt-4 h-2 bg-[#161b22] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-gray-500" style={{ width: '100%' }} />
          </div>
        </div>

        {/* FPS Benchmark */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">Average FPS</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Average Player</span>
              <span className="text-lg font-bold text-gray-300">{data.fps.avg}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Top 10%</span>
              <span className="text-lg font-bold text-green-400">{data.fps.top10}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Top 1%</span>
              <span className="text-lg font-bold text-cyan-400">{data.fps.top1}</span>
            </div>
          </div>
          <div className="mt-4 h-2 bg-[#161b22] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 via-green-500 to-gray-500" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Accuracy Benchmark */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-orange-400" />
            <h3 className="text-white font-semibold">Accuracy</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Average Player</span>
              <span className="text-lg font-bold text-gray-300">{data.accuracy.avg}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Top 10%</span>
              <span className="text-lg font-bold text-orange-400">{data.accuracy.top10}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Top 1%</span>
              <span className="text-lg font-bold text-red-400">{data.accuracy.top1}%</span>
            </div>
          </div>
          <div className="mt-4 h-2 bg-[#161b22] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-gray-500" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-300 text-center">
          <strong>Note:</strong> Benchmarks are based on community data for {selectedGame.name} players. 
          Your performance will be compared against these metrics in your session report.
        </p>
      </div>
    </div>
  );
}
