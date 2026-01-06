import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  StopCircle,
  Download,
  ChevronDown,
  CheckCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const InvestmentDetailPage = () => {
  const navigate = useNavigate();
  const { investmentId } = useParams();

  const [investment, setInvestment] = useState(null);
  const [profitHistory, setProfitHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (investmentId) {
      fetchInvestmentDetails();
    }
  }, [investmentId]);

  const fetchInvestmentDetails = async () => {
    try {
      const res = await api.get(`/investments/${investmentId}`);
      const data = res?.data?.data;

      if (!data) {
        throw new Error('Invalid investment data');
      }

      setInvestment(data);
      generateProfitHistory(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load investment details');
      navigate('/investments/my-investments');
    } finally {
      setLoading(false);
    }
  };

  const generateProfitHistory = (investmentData) => {
    const startDate = new Date(investmentData.started_at);
    const today = new Date();

    const daysDiff = Math.floor(
      (today - startDate) / (1000 * 60 * 60 * 24)
    );

    const dailyProfit =
      (Number(investmentData.invested_amount) *
        Number(investmentData.daily_profit_rate)) /
      100;

    const history = [];

    for (let i = 0; i <= Math.min(daysDiff, 30); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      history.push({
        date: date.toISOString(),
        profit: dailyProfit
      });
    }

    setProfitHistory(history.reverse());
  };

  const handleStopInvestment = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to stop this investment?'
    );
    if (!confirmed) return;

    try {
      await api.post(`/investments/${investmentId}/stop`);
      toast.success('Investment stopped successfully');
      navigate('/investments/my-investments');
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Failed to stop investment'
      );
    }
  };

  const calculateDaysRunning = () => {
    const start = new Date(investment.started_at);
    return Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
  };

  const dailyProfit =
    (Number(investment?.invested_amount) *
      Number(investment?.daily_profit_rate)) /
    100;

  const planColors = {
    'VEXT Robot': { gradient: 'from-purple-500 to-indigo-600', icon: '🤖' },
    'Quantum Boost': { gradient: 'from-blue-500 to-cyan-600', icon: '⚡' },
    'Alpha Trader': { gradient: 'from-orange-500 to-red-600', icon: '🚀' }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading investment details...</p>
      </div>
    );
  }

  if (!investment) return null;

  const colorScheme =
    planColors[investment.plan_name] || planColors['VEXT Robot'];

  const daysRunning = calculateDaysRunning();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colorScheme.gradient} text-white p-6`}>
        <button
          onClick={() => navigate('/investments/my-investments')}
          className="mb-4"
        >
          <ArrowLeft />
        </button>

        <h1 className="text-2xl font-bold">{investment.plan_name}</h1>
        <p className="opacity-80">Investment Details</p>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Invested</p>
            <p className="text-xl font-bold">
              ${Number(investment.invested_amount).toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Earned</p>
            <p className="text-xl font-bold text-green-600">
              +${Number(investment.total_profit_earned).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between">
            <span>Daily Profit</span>
            <span className="font-bold text-green-600">
              ${dailyProfit.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mt-2">
            <span>Days Running</span>
            <span className="font-bold">{daysRunning}</span>
          </div>
        </div>

        {/* Profit History */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full p-4 flex justify-between"
          >
            <span className="font-bold">Profit History</span>
            <ChevronDown />
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="divide-y"
              >
                {profitHistory.map((p, i) => (
                  <div key={i} className="p-4 flex justify-between">
                    <span>
                      {new Date(p.date).toLocaleDateString()}
                    </span>
                    <span className="text-green-600 font-bold">
                      +${p.profit.toFixed(2)}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stop Button */}
        <button
          onClick={handleStopInvestment}
          className="w-full bg-red-500 text-white py-4 rounded-xl font-bold"
        >
          <StopCircle className="inline mr-2" />
          Stop Investment
        </button>
      </div>
    </div>
  );
};

export default InvestmentDetailPage;
