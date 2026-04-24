import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, User, Shield, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ParticleBackground from '../components/auth/ParticleBackground';

const Register = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const [step, setStep] = useState(1); // 1 = name & role, 2 = password
  const navigate = useNavigate();

  // Auto-generate email: firstname@role.com (lowercase, no spaces)
  const generatedEmail = name && role
    ? `${name.trim().toLowerCase().replace(/\s+/g, '')}@${role}.com`
    : '';

  const roles = [
    {
      value: 'dev',
      label: 'Developer',
      description: 'Build features, fix bugs, track sprints',
      icon: '💻',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    {
      value: 'devops',
      label: 'DevOps Engineer',
      description: 'Manage deployments, monitor infrastructure',
      icon: '⚙️',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      value: 'seo',
      label: 'SEO Specialist',
      description: 'Track keywords, optimize performance',
      icon: '🔍',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    {
      value: 'pm',
      label: 'Project Manager',
      description: 'Assign tasks, set deadlines, lead team',
      icon: '📋',
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    },
  ];

  const selectedRole = roles.find(r => r.value === role);

  const handleNext = () => {
    if (!name.trim()) { toast.error('Please enter your name'); return; }
    if (!role) { toast.error('Please select your role'); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        name: name.trim(),
        email: generatedEmail,
        password,
        role,
      });
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f0a1a 0%, #1a1035 30%, #0d1117 70%, #0a0e1a 100%)' }}
    >
      {/* 3D Background */}
      <ParticleBackground />

      {/* Gradient overlay blobs */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute top-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg mx-4">

        {/* Logo & brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(139, 92, 246, 0.15)',
              animation: 'pulse-glow-register 3s ease-in-out infinite',
            }}>
            <Activity size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Join TeamPulse
          </h1>
          <p className="text-gray-400 text-base">
            Create your account and start collaborating
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8 space-x-3">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
              step >= 1 ? 'text-white' : 'text-gray-500'
            }`} style={{
              background: step >= 1 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.1)',
              boxShadow: step >= 1 ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
            }}>
              {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <span className={`ml-2 text-xs font-semibold uppercase tracking-wider ${step >= 1 ? 'text-gray-300' : 'text-gray-600'}`}>
              Profile
            </span>
          </div>
          <div className="w-12 h-px" style={{ background: step >= 2 ? '#6366f1' : 'rgba(255,255,255,0.1)' }} />
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
              step >= 2 ? 'text-white' : 'text-gray-500'
            }`} style={{
              background: step >= 2 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.1)',
              boxShadow: step >= 2 ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
            }}>
              2
            </div>
            <span className={`ml-2 text-xs font-semibold uppercase tracking-wider ${step >= 2 ? 'text-gray-300' : 'text-gray-600'}`}>
              Security
            </span>
          </div>
        </div>

        {/* Glass card */}
        <div className="rounded-2xl p-8 backdrop-blur-xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset',
          }}>

          {step === 1 && (
            <div className="space-y-5">
              {/* Name input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className={`relative rounded-xl transition-all duration-300 ${focused === 'name' ? 'ring-2 ring-indigo-500/50' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${focused === 'name' ? 'text-indigo-400' : 'text-gray-500'}`} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    className="block w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    placeholder="e.g. Aditya Sharma"
                  />
                </div>
              </div>

              {/* Role selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Select Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-300 group cursor-pointer ${
                        role === r.value ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                      }`}
                      style={{
                        background: role === r.value ? r.color + '15' : 'rgba(255,255,255,0.03)',
                        borderColor: role === r.value ? r.color + '60' : 'rgba(255,255,255,0.08)',
                        boxShadow: role === r.value ? `0 0 25px ${r.color}20, 0 0 0 1px ${r.color}30 inset` : 'none',
                      }}
                    >
                      {role === r.value && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-4 h-4" style={{ color: r.color }} />
                        </div>
                      )}
                      <span className="text-2xl mb-2 block">{r.icon}</span>
                      <span className="text-sm font-semibold text-white block">{r.label}</span>
                      <span className="text-[11px] text-gray-500 block mt-1 leading-tight">{r.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email preview */}
              {generatedEmail && (
                <div className="rounded-xl p-4 border transition-all duration-500"
                  style={{
                    background: 'rgba(99,102,241,0.08)',
                    borderColor: 'rgba(99,102,241,0.25)',
                    animation: 'fadeSlideUp 0.3s ease-out',
                  }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: selectedRole?.gradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Your auto-generated email</p>
                      <p className="text-indigo-300 font-bold text-base tracking-wide">{generatedEmail}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Next button */}
              <button
                type="button"
                onClick={handleNext}
                className="group w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-300 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.35)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.35)'; }}
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile summary card */}
              <div className="rounded-xl p-4 border flex items-center space-x-4"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.08)',
                }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: selectedRole?.gradient || '#6366f1' }}>
                  {selectedRole?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{name}</p>
                  <p className="text-indigo-400 text-xs font-medium">{generatedEmail}</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mt-0.5">{selectedRole?.label}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-indigo-400 transition-colors p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Create Password</label>
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
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {/* Password strength indicators */}
                {password && (
                  <div className="mt-3 space-y-1.5" style={{ animation: 'fadeSlideUp 0.2s ease-out' }}>
                    <div className="flex space-x-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            background: password.length >= i * 3
                              ? password.length >= 12 ? '#10b981' : password.length >= 8 ? '#f59e0b' : '#ef4444'
                              : 'rgba(255,255,255,0.1)',
                          }} />
                      ))}
                    </div>
                    <p className="text-[11px] font-medium" style={{
                      color: password.length >= 12 ? '#10b981' : password.length >= 8 ? '#f59e0b' : password.length >= 6 ? '#ef4444' : '#6b7280'
                    }}>
                      {password.length >= 12 ? 'Strong password' : password.length >= 8 ? 'Good password' : password.length >= 6 ? 'Acceptable' : 'Too short'}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className={`relative rounded-xl transition-all duration-300 ${focused === 'confirm' ? 'ring-2 ring-indigo-500/50' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className={`h-5 w-5 transition-colors ${focused === 'confirm' ? 'text-indigo-400' : 'text-gray-500'}`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocused('confirm')}
                    onBlur={() => setFocused('')}
                    className="block w-full pl-12 pr-12 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    placeholder="Re-enter your password"
                  />
                  {confirmPassword && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      {password === confirmPassword ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || password !== confirmPassword || password.length < 6}
                className="group w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? 'rgba(99, 102, 241, 0.5)'
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: loading ? 'none' : '0 10px 30px rgba(99, 102, 241, 0.35)',
                }}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Sign in link */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors inline-flex items-center group"
            >
              Sign in
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </div>

      {/* Global animation keyframes */}
      <style>{`
        @keyframes pulse-glow-register {
          0%, 100% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(139, 92, 246, 0.15); }
          50% { box-shadow: 0 0 60px rgba(139, 92, 246, 0.6), 0 0 120px rgba(139, 92, 246, 0.25); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
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

export default Register;
