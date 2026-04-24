import { motion } from 'framer-motion';
import { Target, Zap, Clock, Code } from 'lucide-react';

const DevPerformanceInsights = () => {
  const insights = [
    { label: "Focus Score", value: 85, color: "bg-blue-500", icon: Target },
    { label: "Resolution Speed", value: 92, color: "bg-green-500", icon: Zap },
    { label: "Code Quality", value: 78, color: "bg-indigo-500", icon: Code },
    { label: "Deadline Reliability", value: 96, color: "bg-purple-500", icon: Clock },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest flex items-center">
        <Zap className="w-4 h-4 mr-2 text-amber-500" />
        Engineering Insights
      </h3>
      <div className="space-y-6">
        {insights.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <item.icon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{item.label}</span>
              </div>
              <span className="text-xs font-black text-gray-900 dark:text-white">{item.value}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className={`h-full rounded-full ${item.color}`}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
        <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Weekly Summary</p>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          Your PR turnaround time is <span className="font-bold text-indigo-600 dark:text-indigo-400">12% faster</span> than last week. Focus on addressing "High" priority bugs to maintain sprint velocity.
        </p>
      </div>
    </div>
  );
};

export default DevPerformanceInsights;
