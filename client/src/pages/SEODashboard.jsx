import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

import KeywordTracker from '../components/seo/KeywordTracker';
import BrokenLinkChecker from '../components/seo/BrokenLinkChecker';
import BugTracker from '../components/dev/BugTracker';
import SEOKPICards from '../components/seo/SEOKPICards';
import SEOTrafficChart from '../components/seo/SEOTrafficChart';
import SubtleSEONetwork from '../components/seo/SubtleSEONetwork';

const SEODashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-6 pb-12">
      {/* Header / Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <SubtleSEONetwork />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 mb-2"
            >
              <div className="p-2 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/30">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Growth Analytics</h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-500 dark:text-gray-400 font-medium"
            >
              Monitor search engine rankings, inbound traffic trends, and overall domain health.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Ranking</p>
              <p className="text-sm font-black text-emerald-500 flex items-center justify-end">
                <Globe className="w-4 h-4 mr-1.5 opacity-80" />
                Top 5%
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* KPI Section */}
      <SEOKPICards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics Column */}
        <div className="lg:col-span-2 space-y-6">
          <SEOTrafficChart />
          <KeywordTracker />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <BrokenLinkChecker />
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
             <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center mb-4">
               <Zap className="w-4 h-4 mr-2 text-indigo-500" />
               Technical SEO Audit
             </h3>
             <BugTracker 
               title="SEO Tickets" 
               showAddButton={true} 
               roleFilter="seo"
               // Mocking empty state so it looks clean if there are no specific SEO bugs
               presetBugs={[]} 
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEODashboard;
