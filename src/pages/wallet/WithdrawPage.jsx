import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Copy,
  Clock,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const WithdrawPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    toAddress: '',
  });

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await api.get('/wallet');
      setWallet(response.data.data);
    } catch (error) {
      console.error('Fetch wallet error:', error);
      toast.error('Failed to load wallet');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const calculateFee = () => {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) return 0;
    return amount * 0.05;
  };

  const calculateNetAmount = () => {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) return 0;
    return amount - calculateFee();
  };

  const handleMaxAmount = () => {
    if (!wallet?.balance) return;
    setFormData(prev => ({
      ...prev,
      amount: Number(wallet.balance).toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);
    const minWithdrawal = 10;

    if (isNaN(amount) || amount < minWithdrawal) {
      toast.error(`Minimum withdrawal is ${minWithdrawal} USDT`);
      return;
    }

    if (amount > Number(wallet?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    if (!formData.toAddress.trim()) {
      toast.error('Please enter withdrawal address');
      return;
    }

    setLoading(true);

    try {
      await api.post('/wallet/withdraw', {
        amount,
        toAddress: formData.toAddress,
      });

      toast.success('Withdrawal request submitted! 🎉');

      setTimeout(() => {
        navigate('/wallet/transactions');
      }, 2000);
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    if (!formData.toAddress) return;
    navigator.clipboard.writeText(formData.toAddress);
    toast.success('Address copied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Withdraw</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-xl text-center"
        >
          <div className="text-gray-600 mb-2">Available Balance</div>
          <div className="text-4xl font-bold text-gray-900 mb-1">
            ${Number(wallet?.balance || 0).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">USDT</div>
        </motion.div>

        {/* Withdrawal Time Info */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 flex gap-3">
          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900">Withdrawal Hours</p>
            <p className="text-blue-700">08:00 - 20:00 UTC daily</p>
          </div>
        </div>

        {/* Withdrawal Form */}
        <motion.div className="bg-white rounded-3xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Withdrawal Amount (USDT)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="10"
                  step="0.01"
                  required
                  className="w-full pl-12 pr-20 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-4 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={handleMaxAmount}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-orange-500 text-white rounded-lg text-sm font-semibold"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Fee */}
            {formData.amount && (
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Fee (5%)</span>
                  <span className="text-red-600 font-semibold">
                    -${calculateFee().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>You’ll Receive</span>
                  <span className="text-green-600">
                    ${calculateNetAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                BEP20 Wallet Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="toAddress"
                  value={formData.toAddress}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl"
                  placeholder="0x..."
                />
                {formData.toAddress && (
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-2xl font-bold flex justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Withdrawal'}
            </motion.button>
          </form>
        </motion.div>

        <div className="flex justify-center gap-2 text-gray-500 text-sm">
          <Shield className="w-4 h-4" />
          <span>Secured with SSL encryption</span>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
