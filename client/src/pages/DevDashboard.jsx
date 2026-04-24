import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Terminal, Layout, Clock, AlertCircle, Filter, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import BugTracker from '../components/dev/BugTracker';
import SprintChart from '../components/dev/SprintChart';
import DevKPICards from '../components/dev/DevKPICards';
import DevPerformanceInsights from '../components/dev/DevPerformanceInsights';
import ActivityTimeline from '../components/shared/ActivityTimeline';
import SubtleCodeNetwork from '../components/dev/SubtleCodeNetwork';

const DevDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevData();
  }, []);

  const fetchDevData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bugs`);
      // Only show bugs assigned to this dev
      const assignedBugs = res.data.filter(b => b.assignedTo?._id === user?.id);
      setBugs(assignedBugs);
    } catch (err) {
      console.error('Failed to fetch developer data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header / Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <SubtleCodeNetwork />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 mb-2"
            >
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Engineering Control</h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-500 dark:text-gray-400 font-medium"
            >
              Monitor your sprint commitments, code delivery rate, and resolve assigned tasks with precision.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Workspace Status</p>
              <p className="text-sm font-black text-green-500 flex items-center justify-end">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Active Sprint
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* KPI Section */}
      <DevKPICards bugs={bugs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tasks & Velocity */}
        <div className="lg:col-span-2 space-y-6">
          <SprintChart />
          <BugTracker presetBugs={bugs} />
        </div>

        {/* Right Column: Insights & Activity */}
        <div className="space-y-6">
          <DevPerformanceInsights />
          <ActivityTimeline />
          
          {/* Quick Tasks / Focus Mode */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
             <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4 uppercase tracking-widest flex items-center">
               <Clock className="w-4 h-4 mr-2 text-indigo-500" />
               Today's Focus
             </h3>
             <div className="space-y-3">
               {bugs.filter(b => b.status === 'in-progress').length === 0 ? (
                 <p className="text-xs text-gray-500 italic">No tasks currently in progress.</p>
               ) : (
                 bugs.filter(b => b.status === 'in-progress').slice(0, 3).map((b, idx) => (
                   <div key={idx} className="flex items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3" />
                     <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{b.title}</p>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevDashboard;
