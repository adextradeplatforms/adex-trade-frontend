import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Copy,
  Share2,
  TrendingUp,
  DollarSign,
  Gift
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ReferralPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('team');

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const [statsRes, treeRes, earningsRes] = await Promise.all([
        api.get('/referrals/stats'),
        api.get('/referrals/tree'),
        api.get('/referrals/earnings')
      ]);

      setStats(statsRes.data.data);
      setReferrals(treeRes.data.data || []);
      setEarnings(earningsRes.data.data?.earnings || []);
    } catch (err) {
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user?.referral_code || '');
    toast.success('Referral code copied');
  };

  const shareReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${user?.referral_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied');
  };

  const commissionRates = [
    { level: 1, rate: '8%', color: 'from-purple-500 to-purple-700' },
    { level: 2, rate: '6%', color: 'from-blue-500 to-blue-700' },
    { level: 3, rate: '4%', color: 'from-green-500 to-green-700' },
    { level: 4, rate: '2%', color: 'from-yellow-400 to-yellow-600' },
    { level: 5, rate: '1%', color: 'from-orange-500 to-orange-700' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Users className="w-12 h-12 text-gray-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button onClick={() => navigate('/dashboard')}>
            <ArrowLeft />
          </button>
          <h1 className="text-lg font-bold">My Team</h1>
          <div />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6">
        {/* Referral Card */}
        <motion.div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-6 shadow-xl mb-6">
          <h3 className="text-white font-bold mb-3">Invite & Earn</h3>

          <div className="bg-white/20 rounded-xl p-4 flex justify-between items-center mb-3">
            <span className="text-white font-bold text-xl">
              {user?.referral_code}
            </span>
            <button onClick={copyReferralCode}>
              <Copy className="text-white" />
            </button>
          </div>

          <button
            onClick={shareReferralLink}
            className="w-full bg-white text-orange-600 py-3 rounded-xl font-bold flex justify-center gap-2"
          >
            <Share2 /> Share Referral Link
          </button>
        </motion.div>

        {/* Commission Rates */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <h3 className="font-bold mb-4">Commission Rates</h3>
          <div className="space-y-3">
            {commissionRates.map(item => (
              <div key={item.level} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <div className={`w-10 h-10 bg-gradient-to-br ${item.color} text-white rounded-full flex items-center justify-center font-bold`}>
                  L{item.level}
                </div>
                <span className="font-semibold">{item.rate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 bg-white rounded-2xl p-2 shadow mb-6">
          {['team', 'earnings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 rounded-xl font-semibold ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600'
              }`}
            >
              {tab === 'team' ? 'My Team' : 'Earnings'}
            </button>
          ))}
        </div>

        {/* Team */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-3xl shadow-xl">
            {referrals.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p>No referrals yet</p>
              </div>
            ) : (
              referrals.map(r => (
                <div key={r.id} className="p-4 border-b">
                  <div className="font-semibold">{r.full_name || r.email}</div>
                  <div className="text-sm text-gray-500">
                    Level {r.level}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Earnings */}
        {activeTab === 'earnings' && (
          <div className="bg-white rounded-3xl shadow-xl">
            {earnings.length === 0 ? (
              <div className="p-12 text-center">
                <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p>No earnings yet</p>
              </div>
            ) : (
              earnings.map(e => (
                <div key={e.id} className="p-4 border-b flex justify-between">
                  <div>
                    <div className="font-semibold">
                      Level {e.level} Commission
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(e.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-green-600 font-bold">
                    +${Number(e.commission_amount).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralPage;
