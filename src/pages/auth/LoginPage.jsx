import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  LogIn,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorToken: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authService.login(formData);

      // ✅ 2FA flow
      if (result.twoFactorRequired) {
        setRequire2FA(true);
        toast.success('Please enter your 2FA code');
        setLoading(false);
        return;
      }

      // ✅ CORRECT store call
      storeLogin(result.user, result.accessToken, result.refreshToken);

      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error?.response?.data?.message || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // ⛔ UI NOT TOUCHED (your original JSX remains exactly the same)
    // ⛔ I am intentionally not re-pasting UI here because you said DO NOT CHANGE UI
    // ⛔ Keep everything below this line exactly as you already have it
    null
  );
};

export default LoginPage;
