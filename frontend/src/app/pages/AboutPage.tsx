import { Target, Mail, Github, Twitter, MessageSquare, Users, TrendingUp, Shield } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="py-20 bg-[#0d1117]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">About LagSkillArena</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Mission
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Helping gamers understand and improve their performance through AI-driven analysis
          </p>
        </div>

        {/* Story */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">The Problem We're Solving</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Every competitive gamer has asked themselves: "Am I losing because I'm not skilled 
              enough, or is my hardware holding me back?" This question has plagued gamers for years, 
              and the answer has always been unclear.
            </p>
            <p>
              <strong className="text-white">LagSkillArena was built to solve this problem.</strong> We 
              combine advanced AI analysis, comprehensive skill testing, and detailed performance 
              metrics to give you a clear, data-driven answer.
            </p>
            <p>
              Our platform analyzes your gameplay footage, measures your fundamental gaming skills, 
              and tracks your system's performance under real gaming conditions. By correlating all 
              this data, our AI can determine whether your performance issues stem from skill 
              limitations, hardware bottlenecks, or a combination of both.
            </p>
            <p>
              No more guessing. No more expensive upgrades that don't help. Just clear, actionable 
              insights that help you improve your gaming performance.
            </p>
          </div>
        </div>

        {/* Goals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Improve Training</h3>
            <p className="text-sm text-gray-400">
              Help gamers focus their practice time on areas that will actually improve their 
              performance, whether that's skill development or system optimization.
            </p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Remove Guesswork</h3>
            <p className="text-sm text-gray-400">
              Replace expensive trial-and-error hardware upgrades with data-driven decisions. 
              Know exactly what's limiting your performance before spending money.
            </p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Accessible Analysis</h3>
            <p className="text-sm text-gray-400">
              Make professional-grade performance analysis available to all gamers, not just 
              esports teams with dedicated analysts.
            </p>
          </div>
        </div>

        {/* How It's Different */}
        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">What Makes LagSkillArena Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">🎯 Holistic Analysis</h4>
                <p className="text-sm text-gray-400">
                  We don't just look at FPS or just test your aim. We combine skill metrics, 
                  system performance, and AI scene analysis for a complete picture.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">🤖 AI-Powered Insights</h4>
                <p className="text-sm text-gray-400">
                  Our AI doesn't just collect data—it understands correlations and provides 
                  intelligent, actionable recommendations.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">⚡ Fast & Simple</h4>
                <p className="text-sm text-gray-400">
                  Get professional-grade analysis in minutes, not hours. No complex setup, 
                  no expensive equipment needed.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">📊 Data-Driven Verdicts</h4>
                <p className="text-sm text-gray-400">
                  Every recommendation is backed by hard data and proven analysis methods, 
                  not opinions or assumptions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Technology & Approach</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              LagSkillArena uses cutting-edge computer vision and machine learning to analyze 
              gameplay footage. Our AI is trained to detect players, track scene complexity, 
              identify combat intensity, and correlate these factors with performance metrics.
            </p>
            <p>
              Combined with browser-based skill tests that measure reaction time, accuracy, and 
              consistency with millisecond precision, we build a comprehensive profile of your 
              gaming capabilities.
            </p>
            <p>
              The platform then uses advanced correlation algorithms to determine whether 
              performance drops coincide with skill limitations or system bottlenecks, providing 
              you with a clear, data-backed verdict.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Get in Touch</h2>
          <p className="text-gray-300 text-center mb-8">
            Have questions, feedback, or suggestions? We'd love to hear from you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Contact Form */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Send a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Your message..."
                    className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Connect With Us</h3>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                      <Github className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">GitHub</div>
                      <div className="text-xs text-gray-400">View our open source projects</div>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                      <Twitter className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Twitter</div>
                      <div className="text-xs text-gray-400">Follow for updates</div>
                    </div>
                  </a>

                  <a
                    href="mailto:hello@lagskillarena.com"
                    className="flex items-center gap-3 p-3 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Email</div>
                      <div className="text-xs text-gray-400">hello@lagskillarena.com</div>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] rounded transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Discord</div>
                      <div className="text-xs text-gray-400">Join our community</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              We typically respond within 24-48 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
