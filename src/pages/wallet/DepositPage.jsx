import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Copy,
  Upload,
  AlertCircle,
  QrCode,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DepositPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    txHash: '',
    fromAddress: '',
  });

  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // ✅ Vite-safe env variable
  const DEPOSIT_ADDRESS =
    import.meta.env.VITE_PLATFORM_WALLET_ADDRESS ||
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(DEPOSIT_ADDRESS);
      toast.success('Address copied to clipboard!');
    } catch {
      toast.error('Failed to copy address');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);
    const minDeposit = 20;

    if (isNaN(amount) || amount < minDeposit) {
      toast.error(`Minimum deposit is ${minDeposit} USDT`);
      return;
    }

    if (!formData.txHash.trim()) {
      toast.error('Please enter transaction hash');
      return;
    }

    if (!formData.fromAddress.trim()) {
      toast.error('Please enter sender address');
      return;
    }

    setLoading(true);

    try {
      await api.post('/wallet/deposit', {
        amount,
        txHash: formData.txHash.trim(),
        fromAddress: formData.fromAddress.trim(),
      });

      toast.success('Deposit request submitted! ⏳');
      toast('Waiting for blockchain confirmation...', { icon: '🔄' });

      setTimeout(() => {
        navigate('/wallet/transactions');
      }, 2000);
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error(error.response?.data?.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/20 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Deposit</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Deposit Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-xl"
        >
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold text-sm">BEP20 (BSC)</span>
            </div>

            <h3 className="text-lg font-bold mb-2">Deposit Address</h3>
            <p className="text-sm text-gray-600">Send USDT to this address</p>
          </div>

          {/* QR */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-4">
            <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center border-2">
              {showQR ? (
                <QrCode className="w-32 h-32 text-gray-400" />
              ) : (
                <button onClick={() => setShowQR(true)}>
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto" />
                  <p className="text-sm mt-2">Show QR Code</p>
                </button>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
            <p className="flex-1 text-sm font-mono truncate">
              {DEPOSIT_ADDRESS}
            </p>
            <button
              onClick={copyAddress}
              className="p-3 bg-green-500 text-white rounded-xl"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Deposit Form */}
        <motion.div className="bg-white rounded-3xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-6">Confirm Your Deposit</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="20"
              step="0.01"
              required
              className="w-full px-4 py-4 border-2 rounded-2xl"
              placeholder="Amount (USDT)"
            />

            <input
              type="text"
              name="txHash"
              value={formData.txHash}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 border-2 rounded-2xl font-mono"
              placeholder="Transaction Hash"
            />

            <input
              type="text"
              name="fromAddress"
              value={formData.fromAddress}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 border-2 rounded-2xl font-mono"
              placeholder="Your Wallet Address"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Deposit'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default DepositPage;
