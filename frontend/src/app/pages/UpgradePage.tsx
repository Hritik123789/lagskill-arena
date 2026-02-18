import { useNavigate } from 'react-router-dom';
import { Crown, Check, Zap, TrendingUp, BarChart3, Download, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function UpgradePage() {
  const { user, token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [upgrading, setUpgrading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:8000';

  const handleUpgrade = async () => {
    if (!token) {
      setError('Please login first');
      navigate('/login');
      return;
    }

    setUpgrading(true);
    setError('');

    try {
      console.log('Starting upgrade with token:', token.substring(0, 20) + '...');
      
      const response = await fetch(`${API_URL}/api/user/upgrade-pro`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Upgrade response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upgrade failed:', errorData);
        setError(errorData.detail || 'Upgrade failed');
        return;
      }

      const data = await response.json();
      console.log('Upgrade successful:', data);
      
      // Manually update localStorage with Pro status
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        userObj.is_pro = true;
        userObj.credits = 999;
        localStorage.setItem('user', JSON.stringify(userObj));
        console.log('Updated localStorage:', userObj);
      }
      
      // Refresh AuthContext state from localStorage
      await refreshUser();
      console.log('AuthContext refreshed');
      
      setSuccess(true);
      
      // Navigate to dashboard after short delay
      setTimeout(() => {
        console.log('Navigating to dashboard...');
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      console.error('Upgrade error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setUpgrading(false);
    }
  };

  if (user?.is_pro) {
    return (
      <div className="min-h-screen bg-[#0d1117] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-2 border-yellow-500/50 rounded-xl p-12">
            <Crown className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">You're Already Pro! 🎉</h1>
            <p className="text-xl text-gray-300 mb-8">
              Enjoy unlimited video analysis, advanced AI insights, and all premium features.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium text-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">Upgrade to Pro</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Unlock Your Full Potential
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get unlimited video analysis, advanced AI coaching, and premium features to take your gaming to the next level.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Free Tier */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-400 mb-2">$0</div>
              <p className="text-gray-400">Forever free</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">3 video analysis credits per day</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Basic AI verdict (Skill vs System)</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Reaction time tests</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Basic performance metrics</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Last 5 sessions history</span>
              </div>
              <div className="flex items-start gap-3 opacity-50">
                <Lock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500">Advanced AI coach tips</span>
              </div>
              <div className="flex items-start gap-3 opacity-50">
                <Lock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500">Unlimited video analysis</span>
              </div>
              <div className="flex items-start gap-3 opacity-50">
                <Lock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500">Full session history</span>
              </div>
            </div>

            <button
              disabled
              className="w-full px-6 py-3 bg-gray-700 text-gray-400 rounded-lg font-medium cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-2 border-yellow-500/50 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                POPULAR
              </span>
            </div>

            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Pro</h3>
              </div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                $9.99<span className="text-lg text-gray-400">/month</span>
              </div>
              <p className="text-gray-300">For serious gamers</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-white font-medium">Everything in Free, plus:</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200">Unlimited video analysis credits</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200">Advanced AI coach tips & insights</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200">Full session history (unlimited)</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200">Detailed performance graphs</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200">Export reports (PDF)</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200">Priority support</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200">Early access to new features</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {success ? (
              <div className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium text-center">
                ✓ Upgraded Successfully!
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {upgrading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Upgrade to Pro
                  </>
                )}
              </button>
            )}

            <p className="text-xs text-center text-gray-400 mt-4">
              * Demo mode - No actual payment required for hackathon
            </p>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#30363d]">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">Free</th>
                  <th className="text-center py-3 px-4 text-yellow-400 font-medium">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#30363d]">
                  <td className="py-3 px-4 text-gray-300">Video Analysis Credits</td>
                  <td className="text-center py-3 px-4 text-gray-400">3 per day</td>
                  <td className="text-center py-3 px-4 text-yellow-400 font-medium">Unlimited</td>
                </tr>
                <tr className="border-b border-[#30363d]">
                  <td className="py-3 px-4 text-gray-300">AI Verdict</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-yellow-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-[#30363d]">
                  <td className="py-3 px-4 text-gray-300">AI Coach Tips</td>
                  <td className="text-center py-3 px-4 text-gray-500">Basic</td>
                  <td className="text-center py-3 px-4 text-yellow-400 font-medium">Advanced</td>
                </tr>
                <tr className="border-b border-[#30363d]">
                  <td className="py-3 px-4 text-gray-300">Session History</td>
                  <td className="text-center py-3 px-4 text-gray-400">Last 5</td>
                  <td className="text-center py-3 px-4 text-yellow-400 font-medium">Unlimited</td>
                </tr>
                <tr className="border-b border-[#30363d]">
                  <td className="py-3 px-4 text-gray-300">Performance Graphs</td>
                  <td className="text-center py-3 px-4"><Lock className="w-5 h-5 text-gray-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-yellow-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-[#30363d]">
                  <td className="py-3 px-4 text-gray-300">Export Reports (PDF)</td>
                  <td className="text-center py-3 px-4"><Lock className="w-5 h-5 text-gray-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-yellow-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-300">Priority Support</td>
                  <td className="text-center py-3 px-4"><Lock className="w-5 h-5 text-gray-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-yellow-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Level Up?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of gamers improving their performance with Pro
          </p>
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
          >
            <Crown className="w-6 h-6" />
            Upgrade to Pro Now
          </button>
        </div>
      </div>
    </div>
  );
}
