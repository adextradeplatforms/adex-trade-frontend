import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [show, setShow] = useState({
    newPassword: false,
    confirmPassword: false
  });

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);

  /* =========================
     VERIFY TOKEN
  ========================== */
  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      return;
    }

    const verifyToken = async () => {
      try {
        await api.get(`/password/verify-token`, {
          params: { token }
        });
        setTokenValid(true);
      } catch (err) {
        console.error(err);
        toast.error('Reset link is invalid or expired');
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  /* =========================
     SUBMIT RESET
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { newPassword, confirmPassword } = passwords;

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post('/password/reset', {
        token,
        newPassword
      });

      setSuccess(true);
      toast.success('Password reset successful');

      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || 'Failed to reset password'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VERIFYING
  ========================== */
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6"
          >
            <Loader className="w-10 h-10 text-blue-600" />
          </motion.div>
          <h2 className="text-2xl font-bold">Verifying reset link…</h2>
        </div>
      </div>
    );
  }

  /* =========================
     INVALID TOKEN
  ========================== */
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            This reset link is invalid or expired.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-bold"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     SUCCESS
  ========================== */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Password Reset Successful 🎉</h2>
          <p className="text-gray-600 mb-6">
            You can now login with your new password.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-bold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     RESET FORM
  ========================== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-purple-500" />
              New Password
            </label>
            <div className="relative">
              <input
                type={show.newPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-500/20"
              />
              <button
                type="button"
                onClick={() =>
                  setShow({ ...show, newPassword: !show.newPassword })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {show.newPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-purple-500" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={show.confirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-500/20"
              />
              <button
                type="button"
                onClick={() =>
                  setShow({
                    ...show,
                    confirmPassword: !show.confirmPassword
                  })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {show.confirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" />
                Resetting…
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
