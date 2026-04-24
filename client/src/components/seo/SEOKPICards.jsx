import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, Activity, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const SEOKPICards = () => {
  const kpis = [
    {
      title: "Organic Traffic",
      value: "45.2K",
      change: "+12.5%",
      isPositive: true,
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Domain Authority",
      value: "68",
      change: "+2",
      isPositive: true,
      icon: Globe,
      color: "from-emerald-400 to-teal-500",
      bgLight: "bg-teal-50",
      iconColor: "text-teal-600"
    },
    {
      title: "Core Web Vitals",
      value: "92%",
      change: "Passing",
      isPositive: true,
      icon: Activity,
      color: "from-purple-500 to-fuchsia-600",
      bgLight: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Active Crawl Errors",
      value: "14",
      change: "-5",
      isPositive: true,
      icon: AlertTriangle,
      color: "from-orange-400 to-red-500",
      bgLight: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm group hover:border-indigo-500/50 transition-colors"
        >
          {/* Subtle gradient background mesh */}
          <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${kpi.color} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.title}</p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{kpi.value}</h4>
            </div>
            <div className={`p-3 rounded-xl ${kpi.bgLight} dark:bg-gray-900/50`}>
              <kpi.icon className={`w-5 h-5 ${kpi.iconColor} dark:opacity-80`} />
            </div>
          </div>
          
          <div className="relative z-10 mt-4 flex items-center">
            <span className={`flex items-center text-xs font-bold ${kpi.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {kpi.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {kpi.change}
            </span>
            <span className="text-xs font-medium text-gray-400 ml-2">vs last month</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SEOKPICards;
