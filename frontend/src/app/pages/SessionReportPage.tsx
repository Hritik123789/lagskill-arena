import { Brain, Target, Gauge, Video, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export function SessionReportPage() {
  return (
    <div className="py-20 bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">Your Performance Report</h1>
            <div className="text-sm text-gray-400">
              Session: Feb 14, 2026 • 7:42 duration
            </div>
          </div>
          <p className="text-gray-400">
            Comprehensive analysis of your gameplay performance and skill metrics
          </p>
        </div>

        {/* AI Verdict */}
        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-lg p-8 mb-12">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold text-white">AI Performance Verdict</h2>
                <div className="px-4 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                  <span className="text-sm font-semibold text-yellow-400">MIXED</span>
                </div>
              </div>
              <p className="text-lg text-gray-300 mb-4">
                Your aim and reaction times are above average (top 30%), but FPS drops during 
                heavy combat scenes suggest a system bottleneck. Your skill performance is 
                consistent, but hardware limitations are affecting your gameplay during critical moments.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#0d1117] border border-[#30363d] rounded p-4 text-center">
                  <div className="text-2xl font-bold text-gray-400 mb-1">25%</div>
                  <div className="text-xs text-gray-400">Skill-Limited</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">50%</div>
                  <div className="text-xs text-yellow-400">Mixed</div>
                </div>
                <div className="bg-[#0d1117] border border-[#30363d] rounded p-4 text-center">
                  <div className="text-2xl font-bold text-gray-400 mb-1">25%</div>
                  <div className="text-xs text-gray-400">System-Limited</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Skill Tests Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skill Tests */}
            <section className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Skill Test Results</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  label="Reaction Time"
                  value="186ms"
                  trend="+5ms"
                  trendPositive={false}
                  color="blue"
                />
                <StatCard
                  label="Accuracy"
                  value="94%"
                  trend="+2%"
                  trendPositive={true}
                  color="blue"
                />
                <StatCard
                  label="Consistency"
                  value="89%"
                  trend="+4%"
                  trendPositive={true}
                  color="blue"
                />
                <StatCard
                  label="Tracking"
                  value="88%"
                  trend="-1%"
                  trendPositive={false}
                  color="blue"
                />
              </div>

              <div className="bg-[#0d1117] rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Reaction Time Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={reactionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis dataKey="attempt" stroke="#6e7681" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6e7681" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        color: '#c9d1d9'
                      }}
                    />
                    <Line type="monotone" dataKey="time" stroke="#58a6ff" strokeWidth={2} dot={{ fill: '#58a6ff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* System Performance */}
            <section className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">System Performance</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  label="Avg FPS"
                  value="142"
                  trend="Stable"
                  color="green"
                />
                <StatCard
                  label="Min FPS"
                  value="89"
                  trend="Low"
                  trendPositive={false}
                  color="yellow"
                />
                <StatCard
                  label="1% Low"
                  value="72"
                  trend="Critical"
                  trendPositive={false}
                  color="red"
                />
                <StatCard
                  label="Stability"
                  value="82%"
                  trend="Good"
                  color="green"
                />
              </div>

              <div className="bg-[#0d1117] rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-4">FPS Over Time</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={fpsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis dataKey="time" stroke="#6e7681" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6e7681" style={{ fontSize: '12px' }} domain={[0, 200]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        color: '#c9d1d9'
                      }}
                    />
                    <Area type="monotone" dataKey="fps" stroke="#3fb950" fill="#3fb950" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Gameplay AI Analysis */}
            <section className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Gameplay AI Analysis</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard
                  label="Avg Characters"
                  value="8.2"
                  sublabel="On screen"
                  color="purple"
                />
                <StatCard
                  label="Peak Intensity"
                  value="76%"
                  sublabel="Combat load"
                  color="purple"
                />
                <StatCard
                  label="Complexity"
                  value="7.1"
                  sublabel="Scene score"
                  color="purple"
                />
              </div>

              <div className="bg-[#0d1117] rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Scene Complexity vs FPS</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={complexityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis dataKey="scene" stroke="#6e7681" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6e7681" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        color: '#c9d1d9'
                      }}
                    />
                    <Bar dataKey="complexity" fill="#bc8cff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Tier */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Performance Tier</h3>
              </div>
              <div className="text-center py-6">
                <div className="text-4xl font-bold text-cyan-400 mb-2">Gold</div>
                <p className="text-sm text-gray-400 mb-4">Top 30% of players</p>
                <div className="w-full bg-[#0d1117] rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: '70%' }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">70% to Platinum</p>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Key Insights</h3>
              </div>
              <div className="space-y-3">
                <InsightCard
                  type="positive"
                  text="Reaction time improved by 8% over last 5 sessions"
                />
                <InsightCard
                  type="warning"
                  text="FPS drops below 90 during team fights"
                />
                <InsightCard
                  type="positive"
                  text="Aim consistency is in top 25% percentile"
                />
                <InsightCard
                  type="warning"
                  text="Performance degrades after 45+ minutes"
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recommendations</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Lower graphics settings during competitive matches</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Consider GPU upgrade for stable 144+ FPS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Take breaks every 45 minutes to maintain performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Continue aim training—your progress is excellent</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
  sublabel?: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

function StatCard({ label, value, trend, trendPositive, sublabel, color }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${colorClasses[color]} mb-1`}>{value}</div>
      {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
      {trend && (
        <div className={`text-xs ${trendPositive === false ? 'text-red-400' : trendPositive ? 'text-green-400' : 'text-gray-400'}`}>
          {trend}
        </div>
      )}
    </div>
  );
}

interface InsightCardProps {
  type: 'positive' | 'warning';
  text: string;
}

function InsightCard({ type, text }: InsightCardProps) {
  return (
    <div className={`flex items-start gap-2 p-3 rounded ${
      type === 'positive' 
        ? 'bg-green-500/10 border border-green-500/30' 
        : 'bg-yellow-500/10 border border-yellow-500/30'
    }`}>
      {type === 'positive' ? (
        <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
      )}
      <p className="text-xs text-gray-300">{text}</p>
    </div>
  );
}

// Mock data for charts
const reactionData = [
  { attempt: 1, time: 195 },
  { attempt: 2, time: 189 },
  { attempt: 3, time: 182 },
  { attempt: 4, time: 178 },
  { attempt: 5, time: 186 },
  { attempt: 6, time: 181 },
  { attempt: 7, time: 184 },
  { attempt: 8, time: 179 },
];

const fpsData = [
  { time: '0:00', fps: 158 },
  { time: '1:00', fps: 152 },
  { time: '2:00', fps: 147 },
  { time: '3:00', fps: 95 },
  { time: '4:00', fps: 89 },
  { time: '5:00', fps: 138 },
  { time: '6:00', fps: 145 },
  { time: '7:00', fps: 149 },
];

const complexityData = [
  { scene: 'Quiet', complexity: 3.2 },
  { scene: 'Normal', complexity: 5.8 },
  { scene: 'Combat', complexity: 8.5 },
  { scene: 'Team Fight', complexity: 9.8 },
];
