import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Send,
  CheckCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error('Please enter your email address');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await api.post('/password/request-reset', { email: cleanEmail });
      setEmailSent(true);
      toast.success('Password reset email sent');
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || 'Failed to send reset email'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUCCESS SCREEN
  ========================== */
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-20"
          />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl shadow-2xl mb-4">
              <span className="text-white text-3xl font-bold">A</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ADEX TRADE
            </h1>
          </div>

          {/* Success Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Check your email 📧
            </h2>

            <p className="text-gray-600 mb-6">
              Reset instructions have been sent to<br />
              <strong>{email}</strong>
            </p>

            <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left">
              <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                <li>Open your email inbox</li>
                <li>Click the reset link</li>
                <li>Create a new password</li>
              </ol>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              Back to Login
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>

            <p className="text-sm text-gray-600 mt-4">
              Didn’t receive the email?{' '}
              <button
                onClick={() => setEmailSent(false)}
                className="text-purple-600 font-semibold hover:underline"
              >
                Try again
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  /* =========================
     FORM SCREEN
  ========================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 right-0 w-96 h-96 bg-purple-300 blur-3xl opacity-20"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 blur-3xl opacity-20"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl shadow-2xl mb-4">
            <span className="text-white text-3xl font-bold">A</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Forgot Password?
          </h1>
          <p className="text-gray-600 mt-2">
            We’ll send you reset instructions
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-purple-500" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-purple-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
