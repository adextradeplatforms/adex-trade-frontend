import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Ban,
  UserCheck,
  BarChart3,
  FileText,
  ArrowLeft,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

/* =======================================================
   MAIN ADMIN DASHBOARD
======================================================= */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.is_admin) {
      toast.error('Admin access only');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')}>
              <ArrowLeft />
            </button>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <button onClick={fetchStats}>
            <RefreshCw />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex gap-4 px-4 overflow-x-auto">
          {[
            ['overview', 'Overview', BarChart3],
            ['users', 'Users', Users],
            ['withdrawals', 'Withdrawals', DollarSign],
            ['investments', 'Investments', TrendingUp],
            ['transactions', 'Transactions', FileText]
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 py-3 px-2 border-b-2 ${
                tab === id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {tab === 'overview' && <Overview stats={stats} />}
          {tab === 'users' && <UsersTab />}
          {tab === 'withdrawals' && <WithdrawalsTab />}
          {tab === 'investments' && <InvestmentsTab />}
          {tab === 'transactions' && <TransactionsTab />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* =======================================================
   OVERVIEW
======================================================= */
function Overview({ stats }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-4 gap-4">
      <Stat title="Total Users" value={stats.total_users} />
      <Stat title="Total Invested" value={`$${stats.total_invested}`} />
      <Stat title="Active Investments" value={stats.active_investments} />
      <Stat title="Pending Withdrawals" value={stats.pending_withdrawals} />
    </motion.div>
  );
}

const Stat = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

/* =======================================================
   USERS
======================================================= */
function UsersTab() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data.data));
  }, []);

  const toggleUser = async (id, status) => {
    await api.patch(`/admin/users/${id}/status`, { is_active: status });
    toast.success('User updated');
    setUsers(u =>
      u.map(user => (user.id === id ? { ...user, is_active: status } : user))
    );
  };

  return (
    <div className="bg-white rounded-xl shadow divide-y">
      {users.map(user => (
        <div key={user.id} className="p-4 flex justify-between">
          <div>
            <p className="font-semibold">{user.full_name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          {user.is_active ? (
            <button onClick={() => toggleUser(user.id, false)}>
              <Ban className="text-red-500" />
            </button>
          ) : (
            <button onClick={() => toggleUser(user.id, true)}>
              <UserCheck className="text-green-500" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/* =======================================================
   WITHDRAWALS
======================================================= */
function WithdrawalsTab() {
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    api.get('/admin/withdrawals/pending').then(res => setWithdrawals(res.data.data));
  }, []);

  const approve = async id => {
    await api.post(`/admin/withdrawals/${id}/approve`);
    toast.success('Approved');
    setWithdrawals(w => w.filter(x => x.id !== id));
  };

  const reject = async id => {
    const reason = prompt('Rejection reason');
    if (!reason) return;
    await api.post(`/admin/withdrawals/${id}/reject`, { reason });
    toast.success('Rejected');
    setWithdrawals(w => w.filter(x => x.id !== id));
  };

  return withdrawals.map(w => (
    <div key={w.id} className="bg-white p-4 rounded-xl shadow mb-3 flex justify-between">
      <div>
        <p>{w.user_email}</p>
        <p className="text-sm text-gray-500">${w.amount}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => approve(w.id)}><CheckCircle className="text-green-500" /></button>
        <button onClick={() => reject(w.id)}><XCircle className="text-red-500" /></button>
      </div>
    </div>
  ));
}

/* =======================================================
   INVESTMENTS
======================================================= */
function InvestmentsTab() {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    api.get('/admin/investments').then(res => setInvestments(res.data.data.investments));
  }, []);

  return investments.map(inv => (
    <div key={inv.id} className="bg-white p-4 rounded-xl shadow mb-3">
      <p className="font-semibold">{inv.user_email}</p>
      <p className="text-sm">{inv.plan_name}</p>
      <p className="text-green-600">+${inv.total_profit_earned}</p>
    </div>
  ));
}

/* =======================================================
   TRANSACTIONS
======================================================= */
function TransactionsTab() {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    api.get('/admin/transactions').then(res => setTxs(res.data.data));
  }, []);

  return txs.map(tx => (
    <div key={tx.id} className="bg-white p-4 rounded-xl shadow mb-3 flex justify-between">
      <div>
        <p className="capitalize">{tx.type.replace('_', ' ')}</p>
        <p className="text-sm text-gray-500">{tx.user_email}</p>
      </div>
      <p className="font-bold">${tx.amount}</p>
    </div>
  ));
}
