import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Info,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const InvestmentsPage = () => {
  const navigate = useNavigate();

  const [hideBalance, setHideBalance] = useState(false);
  const [balance, setBalance] = useState(0);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
    fetchWalletBalance();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/investments/plans');
      setPlans(response?.data?.data || []);
    } catch (error) {
      console.error('Fetch plans error:', error);
      toast.error('Failed to load investment plans');
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await api.get('/wallet');
      setBalance(response?.data?.data?.balance || 0);
    } catch (error) {
      console.error('Fetch balance error:', error);
    }
  };

  const planColors = {
    'VEXT Robot': {
      gradient: 'from-purple-400 to-indigo-500',
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      text: 'text-indigo-600',
      icon: '🤖',
    },
    'Quantum Boost': {
      gradient: 'from-blue-400 to-cyan-500',
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      text: 'text-blue-600',
      icon: '⚡',
    },
    'Alpha Trader': {
      gradient: 'from-orange-400 to-red-500',
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      text: 'text-orange-600',
      icon: '🚀',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>

          <h1 className="text-xl font-bold text-gray-800">Trade App</h1>

          <div className="w-8" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4 pb-24">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Available Balance</p>
              <p className="text-3xl font-bold text-gray-900">
                {hideBalance ? '••••••' : `$${Number(balance).toFixed(2)}`}
              </p>
            </div>

            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-3 bg-purple-500 text-white rounded-xl"
            >
              {hideBalance ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        {plans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Loading investment plans...
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan, index) => {
              const colors = planColors[plan.name] || planColors['VEXT Robot'];

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/investments/${plan.id}`)}
                  className={`${colors.bg} rounded-2xl p-6 cursor-pointer`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{colors.icon}</span>
                    <h3 className={`text-2xl font-bold ${colors.text}`}>
                      {plan.name}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Daily Profit</span>
                      <span className={`font-bold ${colors.text}`}>
                        {plan.daily_profit_rate}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Min Investment</span>
                      <span className="font-semibold">
                        {plan.min_investment} USDT
                      </span>
                    </div>
                  </div>

                  <button
                    className={`w-full mt-4 bg-gradient-to-r ${colors.gradient} text-white py-3 rounded-xl font-bold flex justify-center gap-2`}
                  >
                    View Plan <ChevronRight />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex gap-3">
            <Info className="text-blue-600" />
            <p className="text-sm text-blue-800">
              Profits are credited daily. You can withdraw anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentsPage;
