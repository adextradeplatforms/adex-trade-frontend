import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  DollarSign,
  TrendingUp,
  Users,
  Info,
  Gift
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // Temporary mock data
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'deposit',
          title: 'Deposit Confirmed',
          message: 'Your deposit of 100 USDT has been confirmed',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          icon: DollarSign,
          color: 'green'
        },
        {
          id: 2,
          type: 'profit',
          title: 'Daily Profit Received',
          message: 'You received 2.50 USDT in profit from VEXT Robot',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: true,
          icon: TrendingUp,
          color: 'blue'
        },
        {
          id: 3,
          type: 'referral',
          title: 'New Referral',
          message: 'Someone joined using your referral code!',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
          read: true,
          icon: Users,
          color: 'purple'
        },
        {
          id: 4,
          type: 'bonus',
          title: 'Referral Bonus',
          message: 'You received 8.00 USDT referral commission',
          timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
          read: true,
          icon: Gift,
          color: 'orange'
        },
        {
          id: 5,
          type: 'info',
          title: 'System Maintenance',
          message: 'Scheduled maintenance on Jan 15, 2025 at 02:00 UTC',
          timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000),
          read: true,
          icon: Info,
          color: 'gray'
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getTimeDiff = (time) => {
    const diff = Math.floor((new Date() - time) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Bell className="w-12 h-12 text-gray-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h1 className="text-xl font-bold">Notifications</h1>

          {notifications.some(n => !n.read) ? (
            <button
              onClick={markAllAsRead}
              className="text-sm font-semibold text-purple-600"
            >
              Mark all read
            </button>
          ) : (
            <div className="w-20" />
          )}
        </div>
      </div>

      {/* List */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3 pb-24">
        {notifications.map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => markAsRead(n.id)}
              className={`bg-white rounded-2xl p-4 cursor-pointer ${
                !n.read ? 'border-2 border-purple-200' : 'border'
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[n.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-bold">{n.title}</h3>
                    {!n.read && <span className="w-2 h-2 bg-purple-600 rounded-full mt-2" />}
                  </div>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {getTimeDiff(n.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
