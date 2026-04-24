import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link2, AlertTriangle, CheckCircle, RefreshCw, ServerCrash } from 'lucide-react';

const BrokenLinkChecker = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('healthy'); // healthy, scanning, warning

  const lastChecked = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleScan = () => {
    setIsScanning(true);
    setStatus('scanning');
    setProgress(0);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setStatus('healthy');
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);
  };

  // SVG Circle calculations
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-200 dark:border-gray-700 transition-colors relative overflow-hidden group hover:border-indigo-500/30"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center">
            <Link2 className="w-4 h-4 mr-2 text-indigo-500" /> 
            Site Crawl Monitor
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Deep scanning 1,200 indexed pages</p>
        </div>
        
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin text-indigo-500' : ''}`} />
          <span>{isScanning ? 'Scanning...' : 'Rescan Now'}</span>
        </button>
      </div>

      <div className={`relative p-5 rounded-xl border transition-all duration-500 ${
        status === 'healthy' ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30' : 
        status === 'scanning' ? 'bg-indigo-50/50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-800/30' :
        'bg-rose-50/50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-800/30'
      }`}>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center w-16 h-16">
              {/* Circular Progress */}
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={status === 'scanning' ? strokeDashoffset : 0}
                  className={`transition-all duration-300 ease-in-out ${
                    status === 'healthy' ? 'text-emerald-500' : 
                    status === 'scanning' ? 'text-indigo-500' : 
                    'text-rose-500'
                  }`}
                />
              </svg>
              <div className="absolute flex items-center justify-center">
                {status === 'healthy' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> :
                 status === 'scanning' ? <span className="text-[10px] font-black text-indigo-500">{progress}%</span> :
                 <AlertTriangle className="w-5 h-5 text-rose-500" />}
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-black uppercase tracking-tight ${
                status === 'healthy' ? 'text-emerald-700 dark:text-emerald-400' : 
                status === 'scanning' ? 'text-indigo-700 dark:text-indigo-400' :
                'text-rose-700 dark:text-rose-400'
              }`}>
                {status === 'healthy' ? 'Network Healthy' : status === 'scanning' ? 'Crawling Pages...' : 'Issues Detected'}
              </h4>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
                {status === 'scanning' ? `Analyzed ${Math.floor((progress/100) * 1200)} / 1,200 URLs` : 
                 status === 'healthy' ? '0 broken links found across entire domain.' :
                 '14 404-errors require immediate attention.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 pt-4">
        <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <ServerCrash className="w-3 h-3 mr-1.5" />
          Server Response: 24ms
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Last Check: {status === 'scanning' ? 'In Progress' : lastChecked}
        </p>
      </div>
    </motion.div>
  );
};

export default BrokenLinkChecker;
