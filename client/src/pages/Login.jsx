import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import ParticleBackground from '../components/auth/ParticleBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'dev') navigate('/dev');
      else if (user.role === 'devops') navigate('/devops');
      else if (user.role === 'seo') navigate('/seo');
      else if (user.role === 'pm') navigate('/pm');
      else navigate('/');

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleCards = [
    { role: 'dev', label: 'Developer', color: '#3b82f6', email: 'dev@teampulse.com' },
    { role: 'devops', label: 'DevOps', color: '#10b981', email: 'devops@teampulse.com' },
    { role: 'seo', label: 'SEO', color: '#f59e0b', email: 'seo@teampulse.com' },
    { role: 'pm', label: 'PM', color: '#a855f7', email: 'pm@teampulse.com' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f0a1a 0%, #1a1035 30%, #0d1117 70%, #0a0e1a 100%)' }}
    >
      {/* 3D Background */}
      <ParticleBackground />

      {/* Gradient overlay blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-4">

        {/* Logo & brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.4), 0 0 80px rgba(99, 102, 241, 0.15)',
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}>
            <Activity size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-base">
            Sign in to your <span className="text-indigo-400 font-semibold">TeamPulse</span> account
          </p>
        </div>

        {/* Glass card */}
        <div className="rounded-2xl p-8 backdrop-blur-xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset',
          }}>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focused === 'email' ? 'ring-2 ring-indigo-500/50' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors ${focused === 'email' ? 'text-indigo-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  className="block w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  placeholder="you@teampulse.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focused === 'password' ? 'ring-2 ring-indigo-500/50' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${focused === 'password' ? 'text-indigo-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  className="block w-full pl-12 pr-12 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? 'rgba(99, 102, 241, 0.5)'
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: loading ? 'none' : '0 10px 30px rgba(99, 102, 241, 0.35)',
              }}
              onMouseEnter={(e) => { if (!loading) e.target.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.5)'; }}
              onMouseLeave={(e) => { if (!loading) e.target.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.35)'; }}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>


        </div>

        {/* Sign up link */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            New to TeamPulse?{' '}
            <Link
              to="/register"
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors inline-flex items-center group"
            >
              Create an account
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </div>

      {/* Global animation keyframes */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.4), 0 0 80px rgba(99, 102, 241, 0.15); }
          50% { box-shadow: 0 0 60px rgba(99, 102, 241, 0.6), 0 0 120px rgba(99, 102, 241, 0.25); }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(15, 10, 26, 0.95) inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default Login;
