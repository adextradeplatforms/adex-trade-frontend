import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PlanDetailsPage = () => {
  const navigate = useNavigate();
  const { planId } = useParams();

  const [plan, setPlan] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);

  useEffect(() => {
    fetchPlanDetails();
    fetchWallet();
  }, [planId]);

  const fetchPlanDetails = async () => {
    try {
      const response = await api.get('/investments/plans');
      const foundPlan = response?.data?.data?.find(
        p => String(p.id) === String(planId)
      );
      setPlan(foundPlan);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load plan details');
    }
  };

  const fetchWallet = async () => {
    try {
      const response = await api.get('/wallet');
      setWallet(response?.data?.data || null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInvest = async () => {
    if (!investmentAmount || Number(investmentAmount) < Number(plan.min_investment)) {
      toast.error(`Minimum investment is ${plan.min_investment} USDT`);
      return;
    }

    if (Number(investmentAmount) > Number(wallet?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
      await api.post('/investments/invest', {
        planId: plan.id,
        amount: Number(investmentAmount),
      });

      toast.success('Investment created successfully 🎉');
      setTimeout(() => navigate('/investments/my-investments'), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Investment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading plan details...
      </div>
    );
  }

  /** ✅ SAFE TAILWIND COLOR MAP */
  const planTheme = {
    'VEXT Robot': {
      gradient: 'from-purple-500 to-indigo-600',
      text: 'text-purple-600',
      icon: '🤖',
    },
    'Quantum Boost': {
      gradient: 'from-blue-500 to-cyan-600',
      text: 'text-blue-600',
      icon: '⚡',
    },
    'Alpha Trader': {
      gradient: 'from-orange-500 to-red-600',
      text: 'text-orange-600',
      icon: '🚀',
    },
  };

  const theme = planTheme[plan.name] || planTheme['VEXT Robot'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${theme.gradient} text-white`}>
        <div className="px-4 py-4">
          <button
            onClick={() => navigate('/investments')}
            className="p-2 hover:bg-white/20 rounded-lg"
          >
            <ArrowLeft />
          </button>
        </div>

        <div className="px-4 pb-8">
          <div className="text-6xl mb-3">{theme.icon}</div>
          <h1 className="text-3xl font-bold">{plan.name}</h1>
          <p className="opacity-90">Automated trading for maximum returns</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 pb-32">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className={theme.text} />
              Daily Profit
            </div>
            <div className={`text-2xl font-bold ${theme.text}`}>
              {plan.daily_profit_rate}%
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className={theme.text} />
              Min Investment
            </div>
            <div className="text-2xl font-bold">
              {plan.min_investment} USDT
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="text-sm text-gray-600">Your Balance</div>
          <div className="text-2xl font-bold">
            ${Number(wallet?.balance || 0).toFixed(2)}
          </div>
        </div>

        {/* Risk Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Investments involve risk. Only invest what you can afford to lose.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button
          onClick={() => setShowInvestModal(true)}
          className={`w-full bg-gradient-to-r ${theme.gradient} text-white py-4 rounded-xl font-bold`}
        >
          Invest Now
        </button>
      </div>

      {/* Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Invest in {plan.name}</h3>

            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              min={plan.min_investment}
              placeholder={`Min ${plan.min_investment}`}
              className="w-full border p-3 rounded-xl mb-4"
            />

            <button
              onClick={handleInvest}
              disabled={loading}
              className={`w-full bg-gradient-to-r ${theme.gradient} text-white py-3 rounded-xl`}
            >
              {loading ? 'Processing...' : 'Confirm Investment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDetailsPage;
