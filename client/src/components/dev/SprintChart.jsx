import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Activity } from 'lucide-react';

const data = [
  { name: 'Sprint 21', points: 40, completed: 35, quality: 88 },
  { name: 'Sprint 22', points: 45, completed: 45, quality: 92 },
  { name: 'Sprint 23', points: 38, completed: 30, quality: 85 },
  { name: 'Sprint 24', points: 42, completed: 40, quality: 94 },
  { name: 'Sprint 25', points: 50, completed: 25, quality: 90 }, // Current
];

const SprintChart = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-700 transition-colors"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-500" />
            Sprint Velocity
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Team performance across the last 5 cycles</p>
        </div>
        <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700">
           <div className="text-center px-2">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Avg Velocity</p>
             <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">41.4 pts</p>
           </div>
           <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
           <div className="text-center px-2">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Consistency</p>
             <p className="text-sm font-black text-green-500">92%</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              barGap={8}
            >
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.1} />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#6B7280" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderRadius: '12px',
                  border: 'none', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  color: '#F9FAFB',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }} 
              />
              <Bar dataKey="points" name="Committed" fill="#9CA3AF" radius={[6, 6, 0, 0]} maxBarSize={30} opacity={0.3} />
              <Bar dataKey="completed" name="Completed" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
               <TrendingUp className="w-3 h-3 mr-2 text-green-500" />
               Quality Trend
             </h4>
             <div className="h-24 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data}>
                   <Line 
                    type="monotone" 
                    dataKey="quality" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ fill: '#10b981', r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                   />
                 </LineChart>
               </ResponsiveContainer>
             </div>
             <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 italic font-medium text-center">
               Code quality stable at ~90%
             </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white relative overflow-hidden group">
            <Activity className="absolute -bottom-4 -right-4 w-20 h-20 text-white/10 group-hover:scale-110 transition-transform duration-500" />
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Sprint Insight</h4>
            <p className="text-xs font-bold leading-relaxed">
              Velocity has increased by <span className="text-green-300">8%</span> this month. Great work on resolving high-priority blockers!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SprintChart;
