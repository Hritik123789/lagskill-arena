import { Video, Upload, Target, Brain, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HowItWorksPage() {
  return (
    <div className="py-20 bg-[#0d1117]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            How It Works
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            LagSkillArena makes performance analysis simple. Follow these steps to get 
            comprehensive insights into your gaming performance.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          <Step
            number={1}
            icon={<Video className="w-8 h-8" />}
            title="Play & Record Gameplay"
            color="blue"
          >
            <p className="text-gray-300 mb-4">
              Record a short gameplay clip (2-10 minutes) from your favorite game using any 
              screen recording software like OBS, GeForce Experience, or your console's built-in recorder.
            </p>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
              <h4 className="text-white font-medium text-sm mb-2">Tips for best results:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Include moments of both calm and intense action</li>
                <li>• Capture at your typical game settings</li>
                <li>• Keep file size under 500MB for faster upload</li>
                <li>• Show your typical gameplay, not cherry-picked highlights</li>
              </ul>
            </div>
          </Step>

          <StepConnector />

          <Step
            number={2}
            icon={<Upload className="w-8 h-8" />}
            title="Upload Your Video"
            color="purple"
          >
            <p className="text-gray-300 mb-4">
              Upload your gameplay clip to LagSkillArena. Our platform supports all major 
              video formats (MP4, MOV, AVI, MKV) and provides secure, encrypted storage.
            </p>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded flex items-center justify-center">
                    <Video className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">gameplay_valorant_01.mp4</div>
                    <div className="text-sm text-gray-400">124 MB • 5:23 duration</div>
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div className="w-full bg-[#21262d] rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
              <div className="text-xs text-gray-400 mt-2">Upload complete</div>
            </div>
          </Step>

          <StepConnector />

          <Step
            number={3}
            icon={<Target className="w-8 h-8" />}
            title="Run Skill & Performance Tests"
            color="green"
          >
            <p className="text-gray-300 mb-4">
              Complete a series of browser-based skill tests to measure your reaction time, 
              accuracy, and consistency. These tests take just 5-10 minutes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">186ms</div>
                <div className="text-sm text-gray-400">Reaction Time</div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">94%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">89%</div>
                <div className="text-sm text-gray-400">Consistency</div>
              </div>
            </div>
          </Step>

          <StepConnector />

          <Step
            number={4}
            icon={<Brain className="w-8 h-8" />}
            title="AI Analysis"
            color="cyan"
          >
            <p className="text-gray-300 mb-4">
              Our AI analyzes your uploaded gameplay and combines it with your skill test results. 
              The system evaluates:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                <div className="text-cyan-400 font-medium text-sm mb-1">Scene Complexity</div>
                <div className="text-xs text-gray-400">
                  Number of characters, effects, and visual elements
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                <div className="text-cyan-400 font-medium text-sm mb-1">Characters On Screen</div>
                <div className="text-xs text-gray-400">
                  Average and peak player/enemy count
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                <div className="text-cyan-400 font-medium text-sm mb-1">FPS & Stability</div>
                <div className="text-xs text-gray-400">
                  Frame rate, stutters, and frame time variance
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                <div className="text-cyan-400 font-medium text-sm mb-1">Skill Performance</div>
                <div className="text-xs text-gray-400">
                  Reaction speed, accuracy, and consistency metrics
                </div>
              </div>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">
                  <strong className="text-cyan-400">Processing:</strong> The AI identifies 
                  correlations between performance drops and scene complexity, helping 
                  distinguish skill limitations from hardware bottlenecks.
                </p>
              </div>
            </div>
          </Step>

          <StepConnector />

          <Step
            number={5}
            icon={<FileText className="w-8 h-8" />}
            title="View Report & Verdict"
            color="orange"
          >
            <p className="text-gray-300 mb-4">
              Receive your comprehensive performance report with detailed charts, statistics, 
              and most importantly—your AI System vs Skill verdict.
            </p>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-3">
                  <Brain className="w-6 h-6 text-yellow-400" />
                  <span className="text-xl font-semibold text-yellow-400">MIXED</span>
                </div>
                <p className="text-sm text-gray-400">Your Performance Verdict</p>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] rounded p-4 mb-4">
                <p className="text-sm text-gray-300">
                  "Your aim and reaction are good (top 30%), but FPS drops during heavy scenes 
                  suggest a system bottleneck. Consider GPU upgrade or lower settings during 
                  competitive play."
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0d1117] border border-[#30363d] rounded p-3 text-center">
                  <div className="text-lg font-bold text-blue-400 mb-1">25%</div>
                  <div className="text-xs text-gray-400">Skill-Limited</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-center">
                  <div className="text-lg font-bold text-yellow-400 mb-1">50%</div>
                  <div className="text-xs text-yellow-400">Mixed</div>
                </div>
                <div className="bg-[#0d1117] border border-[#30363d] rounded p-3 text-center">
                  <div className="text-lg font-bold text-gray-400 mb-1">25%</div>
                  <div className="text-xs text-gray-400">System-Limited</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link
                to="/report"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                View Example Report
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/demo"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] rounded transition-colors"
              >
                Try Demo
              </Link>
            </div>
          </Step>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-[#30363d] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-6">
            Start analyzing your performance today—it's fast, simple, and data-driven.
          </p>
          <Link
            to="/get-started"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  color: 'blue' | 'purple' | 'green' | 'cyan' | 'orange';
  children: React.ReactNode;
}

function Step({ number, icon, title, color, children }: StepProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/50',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/50',
    green: 'from-green-500 to-green-600 shadow-green-500/50',
    cyan: 'from-cyan-500 to-cyan-600 shadow-cyan-500/50',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/50',
  };

  const iconColorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    green: 'bg-green-500/20 text-green-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    orange: 'bg-orange-500/20 text-orange-400',
  };

  return (
    <div className="relative">
      <div className="flex items-start gap-6">
        <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${colorClasses[color]} shadow-lg flex items-center justify-center text-white font-bold text-2xl`}>
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-lg ${iconColorClasses[color]} flex items-center justify-center`}>
              {icon}
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

function StepConnector() {
  return (
    <div className="flex justify-start pl-8">
      <div className="w-px h-12 bg-gradient-to-b from-[#30363d] to-transparent" />
    </div>
  );
}
