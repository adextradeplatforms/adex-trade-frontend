import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  Gift,
  DollarSign,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TransactionsPage = () => {
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, deposit, withdrawal, profit, referral_bonus

  useEffect(() => {
    setLoading(true);
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      const params = filter !== 'all' ? `?type=${filter}` : '';
      const response = await api.get(`/wallet/transactions${params}`);
      setTransactions(response.data.data.transactions || []);
    } catch (error) {
      console.error('Fetch transactions error:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return { Icon: ArrowDownRight, color: 'text-green-600', bg: 'bg-green-100' };
      case 'withdrawal':
        return { Icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-100' };
      case 'profit':
        return { Icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'referral_bonus':
        return { Icon: Gift, color: 'text-purple-600', bg: 'bg-purple-100' };
      case 'investment':
        return { Icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'investment_return':
        return { Icon: ArrowDownRight, color: 'text-green-600', bg: 'bg-green-100' };
      default:
        return { Icon: DollarSign, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { Icon: CheckCircle, color: 'text-green-600' };
      case 'pending':
        return { Icon: Clock, color: 'text-yellow-600' };
      case 'failed':
      case 'rejected':
        return { Icon: XCircle, color: 'text-red-600' };
      default:
        return { Icon: AlertCircle, color: 'text-gray-600' };
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'deposit', label: 'Deposits' },
    { value: 'withdrawal', label: 'Withdrawals' },
    { value: 'profit', label: 'Profits' },
    { value: 'referral_bonus', label: 'Referrals' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💸</div>
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <h1 className="text-xl font-bold text-gray-800">Transactions</h1>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-4 max-w-2xl mx-auto">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  filter === option.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Transactions</h3>
            <p className="text-gray-600">Your transaction history will appear here</p>
          </div>
        ) : (
          transactions.map((tx, index) => {
            const { Icon: TypeIcon, color: typeColor, bg: typeBg } = getTransactionIcon(tx.type);
            const { Icon: StatusIcon, color: statusColor } = getStatusIcon(tx.status);
            const isPositive = ['deposit', 'profit', 'referral_bonus', 'investment_return'].includes(tx.type);

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex gap-4">
                  {/* Type Icon */}
                  <div className={`w-12 h-12 ${typeBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className={`w-6 h-6 ${typeColor}`} />
                  </div>

                  {/* Transaction Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900 capitalize">
                          {tx.type.replace('_', ' ')}
                        </h3>
                        <div className="text-xs text-gray-500">
                          {new Date(tx.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                      </div>
                    </div>

                    {/* Fee & Status */}
                    <div className="flex items-center justify-between mt-2">
                      <div className={`flex items-center gap-1 text-xs font-semibold ${statusColor}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">{tx.status}</span>
                      </div>
                      {tx.fee > 0 && (
                        <div className="text-xs text-gray-500">Fee: ${parseFloat(tx.fee).toFixed(2)}</div>
                      )}
                      {tx.tx_hash && (
                        <div className="text-xs text-gray-400 font-mono truncate max-w-[120px]">
                          {tx.tx_hash.slice(0, 10)}...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
