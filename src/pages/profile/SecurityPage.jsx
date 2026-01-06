import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Lock,
  Key,
  Smartphone,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

const SecurityPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('2fa');

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading2FA, setLoading2FA] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  const checkTwoFactorStatus = async () => {
    try {
      const res = await api.get('/auth/profile');
      setTwoFactorEnabled(!!res?.data?.data?.two_factor_enabled);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate2FA = async () => {
    setLoading2FA(true);
    try {
      const res = await api.post('/2fa/generate');
      const { secret, qrCode } = res.data.data;

      setSecret(secret);
      const qr = await QRCode.toDataURL(qrCode);
      setQrCodeUrl(qr);

      toast.success('2FA QR code generated');
    } catch {
      toast.error('Failed to generate 2FA');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleEnable2FA = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Enter a valid 6-digit code');
      return;
    }

    setLoading2FA(true);
    try {
      const res = await api.post('/2fa/enable', {
        token: verificationCode
      });

      setBackupCodes(res.data.data.backupCodes || []);
      setTwoFactorEnabled(true);
      setQrCodeUrl('');
      setSecret('');
      setVerificationCode('');

      toast.success('2FA enabled successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to enable 2FA');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    const code = window.prompt('Enter your 2FA code');
    if (!code) return;

    setLoading2FA(true);
    try {
      await api.post('/2fa/disable', { token: code });

      setTwoFactorEnabled(false);
      setBackupCodes([]);
      setSecret('');
      setQrCodeUrl('');

      toast.success('2FA disabled');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password too short');
      return;
    }

    setLoadingPassword(true);
    try {
      await api.post('/password/change', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-6">
        <button onClick={() => navigate('/profile')}>
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold mt-4">Security Settings</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto flex gap-4 px-4">
          {['2fa', 'password'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 font-semibold border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab === '2fa' ? '2FA Authentication' : 'Change Password'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* 2FA TAB */}
        {activeTab === '2fa' && (
          <>
            <div className={`p-6 rounded-2xl shadow ${
              twoFactorEnabled ? 'bg-green-50' : 'bg-gray-100'
            }`}>
              <h3 className="font-bold text-lg mb-2">
                Two-Factor Authentication
              </h3>

              {twoFactorEnabled ? (
                <button
                  onClick={handleDisable2FA}
                  disabled={loading2FA}
                  className="w-full bg-red-500 text-white py-3 rounded-xl"
                >
                  Disable 2FA
                </button>
              ) : (
                <button
                  onClick={handleGenerate2FA}
                  disabled={loading2FA || qrCodeUrl}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl"
                >
                  Enable 2FA
                </button>
              )}
            </div>

            {qrCodeUrl && (
              <div className="bg-white p-6 rounded-2xl shadow">
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-48" />

                <p className="mt-4 font-mono text-center break-all">
                  {secret}
                </p>

                <button
                  onClick={() => copyToClipboard(secret)}
                  className="w-full mt-3 border py-2 rounded"
                >
                  Copy Secret
                </button>

                <input
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder="000000"
                  className="w-full mt-4 p-3 border rounded text-center font-mono"
                />

                <button
                  onClick={handleEnable2FA}
                  disabled={loading2FA}
                  className="w-full mt-4 bg-green-600 text-white py-3 rounded"
                >
                  Verify & Enable
                </button>
              </div>
            )}
          </>
        )}

        {/* PASSWORD TAB */}
        {activeTab === 'password' && (
          <form
            onSubmit={handleChangePassword}
            className="bg-white p-6 rounded-2xl shadow space-y-4"
          >
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
              <input
                key={field}
                type="password"
                placeholder={field.replace(/([A-Z])/g, ' $1')}
                value={passwordData[field]}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, [field]: e.target.value })
                }
                className="w-full p-3 border rounded"
                required
              />
            ))}

            <button
              type="submit"
              disabled={loadingPassword}
              className="w-full bg-blue-600 text-white py-3 rounded"
            >
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SecurityPage;
