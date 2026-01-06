import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Globe,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  Edit,
  Copy,
  Gift,
  Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchWallet();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setProfile(res.data.data);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await api.get('/wallet');
      setWallet(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const copyReferralCode = async () => {
    if (!profile?.referral_code) return;
    await navigator.clipboard.writeText(profile.referral_code);
    toast.success('Referral code copied!');
  };

  const copyReferralLink = async () => {
    if (!profile?.referral_code) return;
    const link = `${window.location.origin}/register?ref=${profile.referral_code}`;
    await navigator.clipboard.writeText(link);
    toast.success('Referral link copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center text-4xl mb-4">
            {profile?.full_name?.[0] || '👤'}
          </div>
          <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
          <p className="text-sm text-white/80">{profile?.email}</p>

          {profile?.email_verified && (
            <div className="inline-flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full text-xs mt-3">
              <Shield className="w-3 h-3" />
              Verified
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 pb-32">
        {/* Wallet Card */}
        <motion.div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${parseFloat(wallet?.balance || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Profit</p>
              <p className="text-2xl font-bold text-green-600">
                +${parseFloat(wallet?.total_profit || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Referral */}
        <motion.div className="bg-gradient-to-r from-yellow-400 to-red-400 rounded-3xl p-6 shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-4 text-white">
            <Gift />
            <div>
              <h3 className="font-bold">Referral Program</h3>
              <p className="text-sm text-white/80">Earn up to 8%</p>
            </div>
          </div>

          <div className="bg-white/20 rounded-2xl p-4 mb-3 flex justify-between items-center">
            <span className="text-white text-xl font-bold">
              {profile?.referral_code}
            </span>
            <button onClick={copyReferralCode}>
              <Copy className="text-white" />
            </button>
          </div>

          <button
            onClick={copyReferralLink}
            className="w-full bg-white text-orange-600 py-3 rounded-xl font-bold"
          >
            Copy Referral Link
          </button>
        </motion.div>

        {/* Account Info */}
        <motion.div className="bg-white rounded-3xl shadow-xl mb-6">
          <div className="px-6 py-4 border-b font-bold">Account Information</div>

          <div className="divide-y">
            <InfoRow icon={User} label="Full Name" value={profile?.full_name} />
            <InfoRow icon={Mail} label="Email" value={profile?.email} />
            {profile?.phone && (
              <InfoRow icon={Phone} label="Phone" value={profile.phone} />
            )}
            <InfoRow
              icon={Calendar}
              label="Member Since"
              value={
                profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : '—'
              }
            />
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold flex justify-center gap-2"
        >
          <LogOut /> Logout
        </motion.button>

        <p className="text-center mt-6 text-gray-400 text-sm">
          ADEX Trade v1.0.0
        </p>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="px-6 py-4 flex items-center gap-3">
    <Icon className="w-5 h-5 text-gray-400" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
