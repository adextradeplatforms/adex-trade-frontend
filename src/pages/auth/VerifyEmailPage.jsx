import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Loader,
  ArrowRight
} from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const token = searchParams.get('token');
  const emailFromState = location.state?.email || '';

  const hasVerified = useRef(false);
  const redirectTimeout = useRef(null);

  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Waking up server, please wait...');
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState(emailFromState);

  useEffect(() => {
    return () => clearTimeout(redirectTimeout.current);
  }, []);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    verifyEmail();
  }, [token]);

  const wakeUpServer = async () => {
    try {
      await fetch(`${BACKEND_URL}/health`, { cache: 'no-store' });
    } catch (_) {
      // ignore — server may still be waking up
    }
  };

  const verifyEmail = async () => {
    setStatus('verifying');
    setMessage('Waking up server, please wait...');

    try {
      // 🔥 WAKE UP RENDER FIRST
      await wakeUpServer();

      setMessage('Verifying your email...');

      const { data } = await api.get(
        `/auth/verify-email?token=${token}`,
        { timeout: 30000 } // ⬅ longer timeout for cold start
      );

      setStatus('success');
      setMessage(data?.message || 'Email verified successfully!');

      redirectTimeout.current = setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(
        err.response?.data?.message ||
        'Server took too long to respond. Please try again.'
      );
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
      await wakeUpServer();

      await api.post('/auth/resend-verification', { email });
      toast.success('Verification email sent!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">

        {status === 'verifying' && (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Loader className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            </motion.div>
            <h2 className="text-xl font-bold">Verifying your email</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Email Verified 🎉</h2>
            <p className="mb-6">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Continue to Login <ArrowRight />
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="mb-4">{message}</p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl mb-3"
            />

            <button
              onClick={handleResendVerification}
              disabled={resending}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend Verification Email'}
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmailPage;
