import { motion } from 'framer-motion';
import { Terminal, CheckCircle2, Zap, Code2 } from 'lucide-react';

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
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
          {value}
        </h4>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{subtext}</p>
      </div>
      <div className={`p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700`}>
        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </motion.div>
);

const DevKPICards = ({ bugs = [] }) => {
  const assigned = bugs.length;
  const resolved = bugs.filter(b => b.status === 'resolved').length;
  const openCount = bugs.filter(b => b.status === 'open').length;
  const sprintProgress = 68; // Mocked
  
  const stats = [
    { title: "Assigned Tasks", value: assigned, subtext: `${openCount} unstarted`, icon: Terminal, color: "bg-blue-500" },
    { title: "Bugs Resolved", value: resolved, subtext: "This sprint", icon: CheckCircle2, color: "bg-green-500" },
    { title: "Sprint Progress", value: `${sprintProgress}%`, subtext: "4 days remaining", icon: Zap, color: "bg-amber-500" },
    { title: "Delivery Rate", value: "94%", subtext: "Above team avg", icon: Code2, color: "bg-indigo-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <KPICard key={i} {...stat} delay={i * 0.1} />
      ))}
    </div>
  );
};

export default DevKPICards;
