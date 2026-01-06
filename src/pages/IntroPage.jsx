import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Shield,
  Users,
  Globe,
  ChevronRight,
  Sparkles,
  Rocket,
} from "lucide-react";

const IntroPage = () => {
  const navigate = useNavigate();

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "$5M+", label: "Total Invested" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  const plans = [
    {
      name: "VEXT Robot",
      icon: "🤖",
      rate: "2%",
      min: "20",
      gradient: "from-purple-400 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      name: "Quantum Boost",
      icon: "⚡",
      rate: "2.5%",
      min: "100",
      gradient: "from-blue-400 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      popular: true,
    },
    {
      name: "Alpha Trader",
      icon: "🚀",
      rate: "3%",
      min: "500",
      gradient: "from-yellow-400 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full blur-xl opacity-20"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full blur-xl opacity-20"
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="container mx-auto px-4 py-6 flex justify-between items-center"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ADEX TRADE
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-white text-purple-600 rounded-full font-semibold shadow-lg"
          >
            Sign In
          </motion.button>
        </motion.nav>

        {/* Hero */}
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-6"
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">
              Trusted by 10,000+ investors worldwide
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Create Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Future
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Automated trading robots working 24/7 to maximize your returns
            with cutting-edge AI technology
          </p>

          {/* ONLY Get Started button (Demo REMOVED) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold text-lg shadow-2xl flex items-center gap-2 mx-auto"
          >
            <Rocket className="w-6 h-6" />
            Get Started Now
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-xl text-center"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Plans */}
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 pb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`relative bg-gradient-to-br ${plan.bgGradient} rounded-3xl p-8 shadow-2xl ${
                plan.popular ? "ring-4 ring-blue-500 ring-offset-4" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-bold text-sm">
                  ⭐ MOST POPULAR
                </div>
              )}

              <div className="text-6xl text-center mb-4">{plan.icon}</div>
              <h3 className="text-2xl font-bold text-center mb-4">
                {plan.name}
              </h3>

              <div className="text-center mb-6">
                <div
                  className={`text-5xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}
                >
                  {plan.rate}
                </div>
                <div className="text-gray-600">Daily Profit</div>
              </div>

              <div className="bg-white/70 rounded-xl p-4 mb-6 text-center">
                <div className="text-sm text-gray-600">Minimum Investment</div>
                <div className="text-2xl font-bold">{plan.min} USDT</div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className={`w-full py-4 bg-gradient-to-r ${plan.gradient} text-white rounded-xl font-bold`}
              >
                Start Trading
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
