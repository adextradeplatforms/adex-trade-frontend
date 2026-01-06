import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  DollarSign,
  StopCircle,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MyInvestmentsPage = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await api.get('/investments/my-investments');
      setInvestments(response?.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  const handleStopInvestment = async (investmentId) => {
    const confirmed = window.confirm(
      'Are you sure you want to stop this investment? Your principal will be returned to your wallet.'
    );

    if (!confirmed) return;

    try {
      await api.post(`/investments/${investmentId}/stop`);
      toast.success('Investment stopped successfully');
      fetchInvestments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to stop investment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-600">Loading your investments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/investments')}
          className="p-2 hover:bg-white/20 rounded-lg"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">My Investments</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {investments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Active Investments
            </h3>
            <p className="text-gray-600 mb-6">
              Start investing to grow your wealth
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/investments')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold"
            >
              View Plans
            </motion.button>
          </div>
        ) : (
          <>
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm opacity-80">Total Invested</div>
                  <div className="text-2xl font-bold">
                    $
                    {investments
                      .reduce((s, i) => s + Number(i.invested_amount), 0)
                      .toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Total Earned</div>
                  <div className="text-2xl font-bold">
                    $
                    {investments
                      .reduce((s, i) => s + Number(i.total_profit_earned), 0)
                      .toFixed(2)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Investment Cards */}
            {investments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow"
              >
                {/* Header */}
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {investment.plan_name}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {new Date(investment.started_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Active
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xs text-gray-500">Invested</div>
                    <div className="font-bold">
                      ${Number(investment.invested_amount).toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-xl">
                    <div className="text-xs text-green-600">Profit</div>
                    <div className="font-bold text-green-600">
                      +${Number(investment.total_profit_earned).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      navigate(`/investments/${investment.id}/details`)
                    }
                    className="flex items-center justify-center gap-2 bg-gray-100 py-3 rounded-xl font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>

                  <button
                    onClick={() => handleStopInvestment(investment.id)}
                    className="flex items-center justify-center gap-2 bg-red-100 text-red-600 py-3 rounded-xl font-semibold"
                  >
                    <StopCircle className="w-4 h-4" />
                    Stop
                  </button>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MyInvestmentsPage;
