import { Target, MousePointer2, Video, Gauge, Brain, Activity, TrendingUp, Users, Crosshair } from 'lucide-react';

export function FeaturesPage() {
  return (
    <div className="py-20 bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Platform Features
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive suite of tools to analyze, measure, and improve your gaming performance
          </p>
        </div>

        {/* Features */}
        <div className="space-y-24">
          {/* Reaction & Aim Tests */}
          <FeatureSection
            icon={<Target className="w-12 h-12" />}
            title="Reaction & Aim Tests"
            color="blue"
            reverse={false}
          >
            <p className="text-lg text-gray-300 mb-6">
              Measure your fundamental gaming skills with precision browser-based tests. 
              Understand your baseline capabilities and track improvement over time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Reaction Time</h4>
                    <p className="text-sm text-gray-400">
                      Measure how quickly you can respond to visual stimuli. Critical for competitive gaming.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                    <Crosshair className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Accuracy</h4>
                    <p className="text-sm text-gray-400">
                      Test your precision and click accuracy under various conditions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Consistency</h4>
                    <p className="text-sm text-gray-400">
                      Track performance variance and identify fatigue patterns.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Progress Tracking</h4>
                    <p className="text-sm text-gray-400">
                      Monitor improvement over time with detailed historical data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FeatureSection>

          {/* Tracking & Aim Consistency */}
          <FeatureSection
            icon={<MousePointer2 className="w-12 h-12" />}
            title="Tracking / Aim Consistency Tests"
            color="purple"
            reverse={true}
          >
            <p className="text-lg text-gray-300 mb-6">
              Advanced aim analysis that goes beyond simple reaction tests. Measure your ability 
              to track moving targets and maintain steady aim under pressure.
            </p>
            <div className="space-y-4">
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <h4 className="text-white font-medium mb-2">Aim Stability Analysis</h4>
                <p className="text-gray-400 mb-4">
                  Evaluate your crosshair stability and micro-corrections. The platform analyzes 
                  mouse movement patterns to identify shake, over-correction, and fatigue.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-400 mb-1">95%</div>
                    <div className="text-xs text-gray-400">Stability Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400 mb-1">12ms</div>
                    <div className="text-xs text-gray-400">Avg Deviation</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400 mb-1">88%</div>
                    <div className="text-xs text-gray-400">Tracking Score</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <h4 className="text-white font-medium mb-2">Consistency Over Time</h4>
                <p className="text-gray-400">
                  Identify performance degradation during extended sessions. See how fatigue 
                  affects your accuracy and reaction speed after 30, 60, or 90+ minutes of play.
                </p>
              </div>
            </div>
          </FeatureSection>

          {/* Gameplay Video AI Analysis */}
          <FeatureSection
            icon={<Video className="w-12 h-12" />}
            title="Gameplay Video AI Analysis"
            color="green"
            reverse={false}
          >
            <p className="text-lg text-gray-300 mb-6">
              Upload gameplay clips and let AI analyze the complexity of your gaming environment. 
              Understand how scene density and combat intensity correlate with your performance.
            </p>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">8.2</div>
                  <div className="text-sm text-gray-400">Avg Characters On Screen</div>
                  <p className="text-xs text-gray-500 mt-1">Typical: 5-10</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">76%</div>
                  <div className="text-sm text-gray-400">Peak Combat Intensity</div>
                  <p className="text-xs text-gray-500 mt-1">High complexity</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">7.1</div>
                  <div className="text-sm text-gray-400">Scene Complexity Score</div>
                  <p className="text-xs text-gray-500 mt-1">Above average</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Player Detection</span>
                  <span className="text-sm text-green-400">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Enemy Tracking</span>
                  <span className="text-sm text-green-400">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Combat Event Detection</span>
                  <span className="text-sm text-green-400">✓ Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Effect Complexity Analysis</span>
                  <span className="text-sm text-green-400">✓ Enabled</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              <strong className="text-white">Example Output:</strong> "Your gameplay shows high 
              scene complexity with an average of 8+ characters on screen. Peak combat intensity 
              reached 76% during team fights, which correlates with your reported FPS drops."
            </p>
          </FeatureSection>

          {/* Performance Lab */}
          <FeatureSection
            icon={<Gauge className="w-12 h-12" />}
            title="Performance Lab"
            color="cyan"
            reverse={true}
          >
            <p className="text-lg text-gray-300 mb-6">
              Deep dive into your system's performance metrics. Track FPS, frame times, stutters, 
              and stability to identify hardware bottlenecks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <h4 className="text-white font-medium mb-4">FPS Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Average FPS</span>
                    <span className="text-lg font-semibold text-cyan-400">144</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Minimum FPS</span>
                    <span className="text-lg font-semibold text-yellow-400">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">1% Low</span>
                    <span className="text-lg font-semibold text-red-400">72</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <h4 className="text-white font-medium mb-4">Stability Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Frame Time Variance</span>
                    <span className="text-lg font-semibold text-cyan-400">3.2ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Stutter Events</span>
                    <span className="text-lg font-semibold text-yellow-400">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Stability Score</span>
                    <span className="text-lg font-semibold text-cyan-400">82%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-[#161b22] border border-[#30363d] rounded-lg p-4">
              <p className="text-sm text-gray-400">
                <strong className="text-white">Visualization:</strong> The platform provides 
                detailed graphs showing FPS over time, frame time distributions, and correlations 
                between scene complexity and performance drops.
              </p>
            </div>
          </FeatureSection>

          {/* AI System vs Skill Verdict */}
          <FeatureSection
            icon={<Brain className="w-12 h-12" />}
            title="AI System vs Skill Verdict"
            color="orange"
            reverse={false}
          >
            <p className="text-lg text-gray-300 mb-6">
              The platform combines all your data—skill tests, performance metrics, and gameplay 
              analysis—to deliver an AI-powered verdict on your performance limitations.
            </p>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <Brain className="w-6 h-6 text-yellow-400" />
                  <span className="text-xl font-semibold text-yellow-400">MIXED</span>
                </div>
              </div>
              <p className="text-gray-300 text-center mb-8">
                "Your aim and reaction times are above average (top 30%), but FPS drops during 
                heavy combat scenes suggest a system bottleneck. Your skill performance is 
                consistent, but hardware limitations are affecting your gameplay during critical 
                moments."
              </p>
              <div className="grid grid-cols-3 gap-4">
                <VerdictOption label="Skill-Limited" percentage={25} />
                <VerdictOption label="Mixed" percentage={50} active />
                <VerdictOption label="System-Limited" percentage={25} />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Recommendation</h4>
                <p className="text-sm text-gray-400">
                  Consider upgrading your GPU or lowering graphics settings during competitive play. 
                  Your skill level is not the primary bottleneck—focus on maintaining stable 60+ FPS 
                  during combat.
                </p>
              </div>
            </div>
          </FeatureSection>
        </div>
      </div>
    </div>
  );
}

interface FeatureSectionProps {
  icon: React.ReactNode;
  title: string;
  color: 'blue' | 'purple' | 'green' | 'cyan' | 'orange';
  reverse: boolean;
  children: React.ReactNode;
}

function FeatureSection({ icon, title, color, children }: FeatureSectionProps) {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/30 text-purple-400',
    green: 'from-green-500/10 to-green-600/10 border-green-500/30 text-green-400',
    cyan: 'from-cyan-500/10 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    orange: 'from-orange-500/10 to-orange-600/10 border-orange-500/30 text-orange-400',
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-8 lg:p-12">
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${colorClasses[color]} border flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white">{title}</h2>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

interface VerdictOptionProps {
  label: string;
  percentage: number;
  active?: boolean;
}

function VerdictOption({ label, percentage, active }: VerdictOptionProps) {
  return (
    <div className={`text-center p-4 rounded-lg border ${
      active 
        ? 'bg-yellow-500/10 border-yellow-500/30' 
        : 'bg-[#0d1117] border-[#30363d]'
    }`}>
      <div className={`text-2xl font-bold mb-1 ${active ? 'text-yellow-400' : 'text-gray-400'}`}>
        {percentage}%
      </div>
      <div className={`text-xs ${active ? 'text-yellow-400' : 'text-gray-500'}`}>
        {label}
      </div>
    </div>
  );
}
