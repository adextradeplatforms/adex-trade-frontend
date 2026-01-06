import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, EyeOff, Lock, Mail, User, Phone, Gift, CheckCircle, ArrowLeft, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    language: 'en',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register(formData);
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Registration successful! Check your email.</span>
        </div>
      );

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Up to 3% daily returns',
    '24/7 automated trading',
    'Secure & transparent',
    'Instant withdrawals',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-12">
        <div className="w-full max-w-6xl">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </motion.button>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Benefits */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="hidden md:block">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl mb-6"
                >
                  🚀
                </motion.div>
                <h2 className="text-4xl font-bold mb-4">Start Your Journey to Financial Freedom</h2>
                <p className="text-lg opacity-90 mb-8">Join thousands of investors who trust ADEX Trade</p>
                <div className="space-y-4 mb-8">
                  {benefits.map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span className="text-lg">{b}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="w-6 h-6" />
                    <span className="font-bold text-lg">Referral Bonus</span>
                  </div>
                  <p className="text-sm opacity-90">Earn up to 8% commission on referrals + 3% deposit bonus!</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
              {/* Logo & Title */}
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-xl mb-3"
                >
                  <span className="text-white text-2xl font-bold">A</span>
                </motion.div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600">Join ADEX Trade today</p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-500" /> Full Name
                    </label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400" placeholder="John Doe" />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-500" /> Email Address
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400" placeholder="your@email.com" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-500" /> Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400" placeholder="+1 234 567 8900" />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-500" /> Password
                    </label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}</button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-500" /> Confirm Password
                    </label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">{showConfirmPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}</button>
                    </div>
                  </div>

                  {/* Referral Code */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-500" /> Referral Code <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400 uppercase" placeholder="XXXXXXXX" />
                  </div>

                  {/* Terms */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"/>
                      <span className="text-sm text-gray-600 group-hover:text-gray-800">
                        I agree to the <Link to="/terms" className="text-purple-600 font-semibold hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-purple-600 font-semibold hover:underline">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>

                  {/* Submit */}
                  <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} type="submit" disabled={loading} className="w-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                    <div className="relative px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-xl">
                      {loading ? (
                        <>
                          <motion.div animate={{rotate:360}} transition={{duration:1, repeat:Infinity, ease:"linear"}} className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"/>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5"/>
                          <span>Create Account</span>
                        </>
                      )}
                    </div>
                  </motion.button>

                  {/* Login Link */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Already have an account?{' '}
                      <Link to="/login" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">Sign In</Link>
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
