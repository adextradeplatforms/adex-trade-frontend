import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, Gift, Home, BarChart3, Users, UserCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [walletData, setWalletData] = useState({
    balance: 0,
    investedAmount: 0,
    totalProfit: 0,
    totalReferralBonus: 0
  });

  const [markets, setMarkets] = useState([
    { name: 'BTC', price: '$41,541', change: '+1.41%', positive: true },
    { name: 'ETH', price: '$2,466', change: '-0.34%', positive: false },
    { name: 'USDT', price: '$0.999', change: '+0.01%', positive: true },
    { name: 'BNB', price: '$314', change: '+0.09%', positive: true }
  ]);

  useEffect(() => {
    // TODO: Fetch real wallet data from API
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">A</span>
            </div>
            <span className="text-xl font-bold">AENG</span>
          </div>
          <button className="text-white text-lg">English</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Create Future Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/investments')}
          className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-3xl p-8 text-center shadow-2xl cursor-pointer"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Create Future</h2>
          <p className="text-white/80">Start your investment journey</p>
        </motion.div>

        {/* Wallet / Balance Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-gray-600 text-sm mb-2">USDT Balance</div>
            <div className="text-3xl font-bold text-gray-900">${walletData.balance.toLocaleString()}</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6 shadow-xl">
            <div className="text-purple-700 text-sm mb-2">Intelligent</div>
            <div className="text-purple-700 font-bold">Quantification</div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/wallet/deposit')}
            className="bg-blue-500 text-white rounded-2xl p-6 shadow-xl flex items-center justify-center gap-3 font-semibold text-lg"
          >
            💰 Recharge – Earn coins together
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/wallet/withdraw')}
            className="bg-blue-500 text-white rounded-2xl p-6 shadow-xl flex items-center justify-center gap-3 font-semibold text-lg"
          >
            <Wallet className="w-6 h-6" /> 🏧 Withdrawal – Exchange and withdrawal
          </motion.button>
        </div>

        {/* Invite Friends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/referral')}
          className="bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-500 rounded-3xl p-8 text-white shadow-2xl cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-6 h-6" />
                <h3 className="text-2xl font-bold">Invite Friends</h3>
              </div>
              <p className="text-white/90">Share your code: {user?.referralCode || 'XXXXXX'}</p>
            </div>
            <ArrowUpRight className="w-8 h-8" />
          </div>
        </motion.div>

        {/* Markets */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Markets</h3>
          <div className="space-y-4">
            {markets.map((market, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                    {market.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{market.name}</div>
                    <div className="text-gray-600">{market.price}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 font-semibold ${market.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {market.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {market.change}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="grid grid-cols-4 gap-2">
            <button type="button" className="flex flex-col items-center gap-1 text-purple-600">
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button type="button" onClick={() => navigate('/investments')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors">
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs font-medium">Trade</span>
            </button>

            <button type="button" onClick={() => navigate('/referral')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors">
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Team</span>
            </button>

            <button type="button" onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors">
              <UserCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Me</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DashboardPage;
