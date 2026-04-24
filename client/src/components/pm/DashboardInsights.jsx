import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

const DashboardInsights = ({ bugs = [] }) => {
  const overdueCount = bugs.filter(b => b.deadline && new Date(b.deadline) < new Date() && b.status !== 'resolved').length;
  const highPriorityCount = bugs.filter(b => (b.priority === 'high' || b.priority === 'critical') && b.status !== 'resolved').length;
  const completedRate = bugs.length ? Math.round((bugs.filter(b => b.status === 'resolved').length / bugs.length) * 100) : 0;

  const insights = [
    {
      icon: AlertTriangle,
      title: "Overdue Tasks",
      value: overdueCount,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      desc: overdueCount > 0 ? `${overdueCount} tasks need immediate attention.` : "All deadlines are currently met."
    },
    {
      icon: TrendingUp,
      title: "Completion Rate",
      value: `${completedRate}%`,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      desc: completedRate > 70 ? "Team performance is excellent." : "Try reassigning tasks to balance load."
    },
    {
      icon: Lightbulb,
      title: "Active Priorities",
      value: highPriorityCount,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      desc: `${highPriorityCount} critical items remain in queue.`
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
        <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
        AI Insights
      </h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg flex items-start space-x-3 ${insight.bg}`}
          >
            <div className={`p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm`}>
              <insight.icon className={`w-4 h-4 ${insight.color}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{insight.title}</p>
                <span className={`text-sm font-bold ${insight.color}`}>{insight.value}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{insight.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardInsights;
