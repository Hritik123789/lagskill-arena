import { Link } from 'react-router-dom';
import { Target, Activity, Video, Gauge, Brain, ArrowRight, Zap, TrendingUp, Cpu } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#161b22] to-[#0d1117] border-b border-[#30363d] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">AI-Powered Performance Analysis</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Know If It's Your Skills<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Or Your System
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 font-medium">
                Stop guessing. Get AI-powered analysis that tells you exactly what's holding you back.
              </p>
              
              <p className="text-lg text-gray-400">
                Upload your gameplay, take skill tests, and receive a personalized verdict: 
                <span className="text-blue-400 font-medium"> Skill-Limited</span>, 
                <span className="text-yellow-400 font-medium"> Mixed</span>, or 
                <span className="text-red-400 font-medium"> System-Limited</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all font-medium text-lg shadow-lg shadow-blue-500/25"
                >
                  <Zap className="w-5 h-5" />
                  Get Your AI Verdict
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] rounded-lg transition-colors font-medium text-lg"
                >
                  <Target className="w-5 h-5" />
                  Try Demo
                </Link>
              </div>
              
              {/* Social Proof / Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-2xl font-bold text-white">AI-Powered</div>
                  <div className="text-sm text-gray-400">YOLO Object Detection</div>
                </div>
                <div className="w-px h-12 bg-[#30363d]" />
                <div>
                  <div className="text-2xl font-bold text-white">Real-Time</div>
                  <div className="text-sm text-gray-400">Performance Analysis</div>
                </div>
                <div className="w-px h-12 bg-[#30363d]" />
                <div>
                  <div className="text-2xl font-bold text-white">Actionable</div>
                  <div className="text-sm text-gray-400">Recommendations</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden border border-[#30363d] shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1757774636742-0a5dc7e5c07a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBlc3BvcnRzJTIwZnBzJTIwc2hvb3RlcnxlbnwxfHx8fDE3NzEwOTYxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Gaming Performance"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USP Section - The Core Differentiator */}
      <section className="py-20 bg-gradient-to-b from-[#0d1117] via-purple-900/10 to-[#0d1117]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">Our Core Differentiator</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              System vs Skill AI Verdict
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The only platform that tells you whether to practice more or upgrade your PC
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Skill-Limited */}
            <div className="bg-[#161b22] border-2 border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-all">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Skill-Limited</h3>
              <p className="text-gray-400 mb-4">
                Your system is fine. Focus on improving reaction time, aim, and game sense.
              </p>
              <div className="text-sm text-yellow-400 font-medium">
                → Practice recommendations
              </div>
            </div>

            {/* Mixed */}
            <div className="bg-[#161b22] border-2 border-orange-500/30 rounded-xl p-6 hover:border-orange-500/50 transition-all">
              <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Mixed</h3>
              <p className="text-gray-400 mb-4">
                Both factors are affecting you. Optimize settings while practicing skills.
              </p>
              <div className="text-sm text-orange-400 font-medium">
                → Balanced approach
              </div>
            </div>

            {/* System-Limited */}
            <div className="bg-[#161b22] border-2 border-red-500/30 rounded-xl p-6 hover:border-red-500/50 transition-all">
              <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                <Cpu className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">System-Limited</h3>
              <p className="text-gray-400 mb-4">
                Your skills are solid, but low FPS and stutters are holding you back.
              </p>
              <div className="text-sm text-red-400 font-medium">
                → Hardware upgrades
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">How Our AI Analyzes You</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-400">1</span>
                </div>
                <h4 className="text-white font-medium mb-2">Skill Metrics</h4>
                <p className="text-sm text-gray-400">
                  Reaction time, aim accuracy, tracking consistency
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-purple-400">2</span>
                </div>
                <h4 className="text-white font-medium mb-2">System Performance</h4>
                <p className="text-sm text-gray-400">
                  FPS, frame time stability, motion smoothness
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-cyan-400">3</span>
                </div>
                <h4 className="text-white font-medium mb-2">Scene Complexity</h4>
                <p className="text-sm text-gray-400">
                  Enemy count, combat intensity, visual load
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                Get Your Verdict Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-[#0d1117]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Stop Wasting Money on Upgrades You Don't Need
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Gamers spend thousands on hardware upgrades when they should be practicing, 
            or they grind for hours when a simple GPU upgrade would solve everything. 
            Our AI tells you the truth—backed by data, not guesswork.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#161b22] border-y border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Comprehensive Performance Analysis
            </h2>
            <p className="text-lg text-gray-400">
              Everything you need to understand and improve your gaming performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Reaction & Aim Tests"
              description="Measure your reaction time, accuracy, and consistency with precision browser-based tests."
              color="blue"
            />
            <FeatureCard
              icon={<Video className="w-8 h-8" />}
              title="Gameplay AI Analysis"
              description="Upload gameplay clips and get AI analysis of scene complexity, combat intensity, and more."
              color="purple"
            />
            <FeatureCard
              icon={<Gauge className="w-8 h-8" />}
              title="Performance Lab"
              description="Track FPS, stability, stutters, and system performance metrics during gameplay."
              color="green"
            />
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="AI System vs Skill Verdict"
              description="Get a data-driven verdict on whether you're skill-limited or system-limited."
              color="cyan"
            />
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-20 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Deep Analytics & Insights
              </h2>
              <p className="text-lg text-gray-400">
                View detailed performance metrics, charts, and AI-generated insights 
                that help you understand exactly what's affecting your gameplay.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Performance Trends</div>
                    <div className="text-sm text-gray-400">Track your improvement over time</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Real-time Metrics</div>
                    <div className="text-sm text-gray-400">FPS, frame time, and stability analysis</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Cpu className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">AI-Powered Recommendations</div>
                    <div className="text-sm text-gray-400">Get personalized tips to improve</div>
                  </div>
                </li>
              </ul>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Explore All Features
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden border border-[#30363d] shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmb3JtYW5jZSUyMGNoYXJ0JTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3MTA5NjE5MHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Analytics Dashboard"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-t border-[#30363d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Analyze Your Performance?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Start with a free reaction test or upload your gameplay for comprehensive AI analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Start Testing Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] rounded transition-colors"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'green' | 'cyan';
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-400',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/30 text-purple-400',
    green: 'from-green-500/10 to-green-600/10 border-green-500/30 text-green-400',
    cyan: 'from-cyan-500/10 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6 hover:border-[#58a6ff]/50 transition-colors">
      <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${colorClasses[color]} border flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
