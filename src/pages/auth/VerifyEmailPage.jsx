import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Mail,
  Loader,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const token = searchParams.get('token');
  const emailFromState = location.state?.email || '';

  const hasVerified = useRef(false);
  const redirectTimeout = useRef(null);

  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState(emailFromState);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearTimeout(redirectTimeout.current);
  }, []);

  // Verify on mount
  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }
    if (hasVerified.current) return;
    hasVerified.current = true;

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    setStatus('verifying');
    setMessage('Please wait a moment...');
    try {
      const { data } = await api.get(`/auth/verify-email?token=${verificationToken}`);
      setStatus('success');
      setMessage(data?.message || 'Email verified successfully!');

      redirectTimeout.current = setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Email verification failed:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. The link may be expired.');
    }
  };

  const handleResendVerification = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (resending) return;
    setResending(true);

    try {
      await api.post('/auth/resend-verification', { email });
      toast.success('Verification email sent. Check your inbox!');
      setEmail('');
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl mb-4"
          >
            <span className="text-white text-3xl font-bold">A</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-purple-600">ADEX TRADE</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* VERIFYING */}
          {status === 'verifying' && (
            <div className="text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Loader className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800">
                Verifying your email
              </h2>
              <p className="text-gray-600 mt-2">{message}</p>
            </div>
          )}

          {/* SUCCESS */}
          {status === 'success' && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Email Verified 🎉
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition"
              >
                Continue to Login
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ERROR */}
          {status === 'error' && (
            <div className="text-center">
              <XCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-purple-700 transition"
                >
                  {resending ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </span>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="text-purple-600 font-semibold hover:underline"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{' '}
          <a href="mailto:support@adextrade.com" className="text-purple-600 font-semibold hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
