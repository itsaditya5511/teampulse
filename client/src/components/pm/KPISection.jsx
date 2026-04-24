import { motion } from 'framer-motion';
import { CheckCircle2, Clock, BarChart3, Target } from 'lucide-react';

const KPICard = ({ title, value, subtext, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${color}`} />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          {value}
        </h4>
        <p className="text-xs text-gray-400 dark:text-gray-500">{subtext}</p>
      </div>
      <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700`}>
        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </motion.div>
);

const KPISection = ({ bugs = [] }) => {
  const total = bugs.length;
  const overdue = bugs.filter(b => {
    if (!b.deadline || b.status === 'resolved') return false;
    const now = new Date();
    const deadline = new Date(b.deadline);
    deadline.setHours(17, 30, 0, 0);
    return now > deadline;
  }).length;
  const completed = bugs.filter(b => b.status === 'resolved').length;
  const inProgress = bugs.filter(b => b.status === 'in-progress').length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  
  const stats = [
    { title: "Total Tasks", value: total, subtext: `${inProgress} currently in work`, icon: BarChart3, color: "bg-indigo-500" },
    { title: "Overdue", value: overdue, subtext: "Requires attention", icon: Clock, color: "bg-red-500" },
    { title: "Completed %", value: `${completionRate}%`, subtext: "Target: 85%+", icon: CheckCircle2, color: "bg-green-500" },
    { title: "Velocity", value: "High", subtext: "Based on last 7 days", icon: Target, color: "bg-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <KPICard key={i} {...stat} delay={i * 0.1} />
      ))}
    </div>
  );
};

export default KPISection;
