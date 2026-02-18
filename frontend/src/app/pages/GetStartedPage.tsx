import { Link } from 'react-router-dom';
import { Target, Upload, Brain, ArrowRight, CheckCircle2, Zap, Shield, Clock } from 'lucide-react';

export function GetStartedPage() {
  return (
    <div className="py-20 bg-[#0d1117]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Get Started with LagSkillArena
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Start analyzing your gaming performance in minutes—no complicated setup, 
            no downloads required.
          </p>
        </div>

        {/* Quick Steps */}
        <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Three Simple Steps to Your Performance Report
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Run Skill Tests</h3>
              <p className="text-sm text-gray-400">
                Complete quick reaction and aim tests in your browser (5-10 min)
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload Gameplay</h3>
              <p className="text-sm text-gray-400">
                Upload a short gameplay clip from your recent matches
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <span className="text-2xl font-bold text-green-400">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Get AI Report</h3>
              <p className="text-sm text-gray-400">
                Receive comprehensive analysis and your System vs Skill verdict
              </p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Start Testing */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 hover:border-blue-500/50 transition-colors">
            <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Start with Skill Tests</h3>
            <p className="text-gray-400 mb-6">
              Jump right in with our browser-based reaction and aim tests. No upload needed—get 
              instant feedback on your fundamental gaming skills.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Reaction time measurement
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Accuracy and precision tests
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Tracking consistency analysis
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Instant results and feedback
              </li>
            </ul>
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Start Testing Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Analyze Gameplay */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 hover:border-purple-500/50 transition-colors">
            <div className="w-14 h-14 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Analyze Your Gameplay</h3>
            <p className="text-gray-400 mb-6">
              Upload a gameplay clip and let our AI analyze scene complexity, FPS stability, and 
              correlate it with your skill metrics for a comprehensive verdict.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                AI scene complexity analysis
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                FPS and stability tracking
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                System vs Skill AI verdict
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Detailed performance report
              </li>
            </ul>
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Analyze Gameplay Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Why LagSkillArena */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Why Choose LagSkillArena?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Fast & Simple</h3>
              <p className="text-sm text-gray-400">
                Get comprehensive analysis in minutes, not hours. No complicated setup or configuration.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-400">
                Advanced AI analyzes your gameplay to provide accurate, data-driven insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-400">
                Your gameplay data is encrypted and secure. We respect your privacy.
              </p>
            </div>
          </div>
        </div>

        {/* What You'll Get */}
        <div className="bg-gradient-to-br from-green-900/20 to-cyan-900/20 border border-green-500/30 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">What You'll Receive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-medium mb-1">Detailed Performance Metrics</div>
                <div className="text-sm text-gray-400">
                  FPS, frame time, stability, reaction time, accuracy, and more
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-medium mb-1">AI System vs Skill Verdict</div>
                <div className="text-sm text-gray-400">
                  Clear answer: are you skill-limited, system-limited, or mixed?
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-medium mb-1">Visual Charts & Graphs</div>
                <div className="text-sm text-gray-400">
                  Easy-to-understand visualizations of your performance data
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-medium mb-1">Personalized Recommendations</div>
                <div className="text-sm text-gray-400">
                  Actionable tips to improve your performance
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-medium mb-1">Performance Tier Ranking</div>
                <div className="text-sm text-gray-400">
                  See how you compare to other gamers
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-medium mb-1">Historical Progress Tracking</div>
                <div className="text-sm text-gray-400">
                  Monitor your improvement over time
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Estimate */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Time Estimate</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0d1117] rounded p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">5-10 min</div>
              <div className="text-sm text-gray-400">Skill tests completion</div>
            </div>
            <div className="bg-[#0d1117] rounded p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">2-5 min</div>
              <div className="text-sm text-gray-400">Video upload time</div>
            </div>
            <div className="bg-[#0d1117] rounded p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">3-7 min</div>
              <div className="text-sm text-gray-400">AI analysis processing</div>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4 text-center">
            <strong className="text-white">Total:</strong> Get your complete performance report in under 20 minutes
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/demo"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg font-semibold rounded-lg transition-all shadow-lg hover:shadow-blue-500/50"
          >
            Start Your Analysis Now
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            No account required • No downloads • No credit card
          </p>
        </div>
      </div>
    </div>
  );
}
