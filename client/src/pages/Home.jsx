import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TerminalSquare, Server, Search, ArrowRight, Layout, Zap, Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ActivityTimeline from '../components/shared/ActivityTimeline';
import SubtleCodeNetwork from '../components/dev/SubtleCodeNetwork';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ bugs: [], loading: true });

  useEffect(() => {
    fetchGlobalStats();
  }, []);

  const fetchGlobalStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bugs`);
      setStats({ bugs: res.data, loading: false });
    } catch (err) {
      console.error(err);
      setStats(s => ({ ...s, loading: false }));
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const openBugs = stats.bugs.filter(b => b.status === 'open').length;
  const inProgressBugs = stats.bugs.filter(b => b.status === 'in-progress').length;
  const resolvedBugs = stats.bugs.filter(b => b.status === 'resolved').length;
  const healthScore = stats.bugs.length ? Math.round(((resolvedBugs + (inProgressBugs * 0.5)) / stats.bugs.length) * 100) : 100;

  return (
    <div className="space-y-8 pb-12">
      {/* Command Center Header */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-10 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <SubtleCodeNetwork />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-4"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span className="text-xs font-black uppercase tracking-widest">Engineering Command Center</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black text-gray-900 dark:text-white leading-tight mb-4"
            >
              {getGreeting()}, <span className="text-indigo-600 dark:text-indigo-400">{user?.name.split(' ')[0]}</span>.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 dark:text-gray-400 font-medium text-lg"
            >
              Your systems are running at <span className="text-gray-900 dark:text-white font-bold">{healthScore}% efficiency</span>. You have {openBugs} critical blockers pending resolution.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Project Health</p>
                <div className="flex items-center justify-center space-x-2">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${healthScore > 80 ? 'bg-green-500' : 'bg-amber-500'}`} />
                   <span className="text-xl font-black text-gray-900 dark:text-white">{healthScore}%</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Sprints</p>
                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">02</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Dashboard Quick Access */}
          <section>
            <h2 className="text-sm font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest flex items-center">
              <Layout className="w-4 h-4 mr-2 text-indigo-500" />
              Specialized Hubs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(user?.role === 'pm' || user?.role === 'admin') && (
                <Link to="/pm" className="group block bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-500/50 transition-all shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl group-hover:bg-purple-600 transition-colors">
                      <Layout className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Project Manager</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Manage team velocity, track deadlines, and handle assignments.</p>
                </Link>
              )}

              {(user?.role === 'dev' || user?.role === 'admin') && (
                <Link to="/dev" className="group block bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-500/50 transition-all shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:bg-blue-600 transition-colors">
                      <TerminalSquare className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Dev Console</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Sprint monitoring, task resolution, and engineering metrics.</p>
                </Link>
              )}

              {(user?.role === 'devops' || user?.role === 'admin') && (
                <Link to="/devops" className="group block bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-500/50 transition-all shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl group-hover:bg-green-600 transition-colors">
                      <Server className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Ops Terminal</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Deployment logs, infrastructure health, and QA pipelines.</p>
                </Link>
              )}

              {(user?.role === 'seo' || user?.role === 'admin') && (
                <Link to="/seo" className="group block bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-500/50 transition-all shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl group-hover:bg-orange-600 transition-colors">
                      <Search className="w-6 h-6 text-orange-600 dark:text-orange-400 group-hover:text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Growth Analytics</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Keyword tracking, PageSpeed insights, and SEO monitoring.</p>
                </Link>
              )}
            </div>
          </section>

          {/* Today's Priorities Snapshot */}
          <section>
            <h2 className="text-sm font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest flex items-center">
              <Clock className="w-4 h-4 mr-2 text-indigo-500" />
              Priorities Snapshot
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
              {stats.loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-100 dark:bg-gray-900 rounded-xl w-full" />
                  <div className="h-12 bg-gray-100 dark:bg-gray-900 rounded-xl w-3/4" />
                </div>
              ) : stats.bugs.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Workspace is Clear</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.bugs.filter(b => b.status !== 'resolved').slice(0, 3).map((bug, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${bug.priority === 'critical' ? 'bg-red-500' : bug.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'} text-white`}>
                           <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white">{bug.title}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-bold">{bug.priority} Priority • {bug.assignedTo?.name || 'Unassigned'}</p>
                        </div>
                      </div>
                      <Link to={user?.role === 'dev' ? '/dev' : '/pm'} className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">
                        Details →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
           <ActivityTimeline />

           {/* Pending Reviews Widget */}
           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:border-amber-500/30">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-2 text-amber-500" />
                Pending Reviews
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-100/50 dark:border-amber-800/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-[10px]">PR</div>
                    <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Auth Refactor</p>
                  </div>
                  <span className="text-[9px] font-black text-amber-600 uppercase">Urgent</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-900/10 rounded-xl border border-gray-100/50 dark:border-gray-800/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-[10px]">PR</div>
                    <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">UI Cleanup</p>
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase">2h ago</span>
                </div>
              </div>
           </div>
           
           <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
              <Activity className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <h3 className="font-black text-lg mb-2 uppercase tracking-tight">System Status</h3>
                <div className="space-y-4 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-80 uppercase tracking-widest">API Gateway</span>
                    <span className="text-[10px] font-black bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-80 uppercase tracking-widest">Dev Cluster</span>
                    <span className="text-[10px] font-black bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">STABLE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-80 uppercase tracking-widest">QA Environment</span>
                    <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">IDLE</span>
                  </div>
                </div>
                <button className="w-full mt-8 bg-white/10 hover:bg-white/20 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Run Diagnostics
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
