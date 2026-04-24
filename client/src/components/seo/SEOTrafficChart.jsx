import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';

const data = [
  { name: '1', organic: 1200, paid: 800 },
  { name: '5', organic: 1900, paid: 900 },
  { name: '10', organic: 1500, paid: 1100 },
  { name: '15', organic: 2200, paid: 1300 },
  { name: '20', organic: 2800, paid: 1200 },
  { name: '25', organic: 3400, paid: 1400 },
  { name: '30', organic: 4100, paid: 1500 },
];

const SEOTrafficChart = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-200 dark:border-gray-700 transition-colors"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-indigo-500" />
            Traffic Acquisition
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">30-day performance overview</p>
        </div>
        <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700">
           <div className="text-center px-2">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Visitors</p>
             <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">45.2K</p>
           </div>
           <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
           <div className="text-center px-2">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Avg Session</p>
             <p className="text-sm font-black text-green-500">2m 45s</p>
           </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
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
              dx={-10}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip 
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
            <Area type="monotone" dataKey="organic" name="Organic Search" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorOrganic)" />
            <Area type="monotone" dataKey="paid" name="Paid Search" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPaid)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SEOTrafficChart;
