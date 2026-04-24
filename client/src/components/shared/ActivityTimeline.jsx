import { motion } from 'framer-motion';
import { GitCommit, GitPullRequest, MessageSquare, CheckCircle2 } from 'lucide-react';

const ActivityTimeline = () => {
  const activities = [
    {
      type: 'commit',
      title: "Pushed to main",
      desc: "Fixed overflow issue on BugCard mobile view",
      time: "2 hours ago",
      icon: GitCommit,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      type: 'pr',
      title: "PR Approved",
      desc: "Authentication flow refactoring",
      time: "5 hours ago",
      icon: GitPullRequest,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      type: 'comment',
      title: "New Comment",
      desc: "PM commented on task #1042: 'Please verify the deadline'",
      time: "Yesterday",
      icon: MessageSquare,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      type: 'resolved',
      title: "Task Resolved",
      desc: "Migrate database to production cluster",
      time: "2 days ago",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest">Recent Activity</h3>
      <div className="relative space-y-6">
        {/* Vertical line */}
        <div className="absolute left-[17px] top-2 bottom-2 w-px bg-gray-100 dark:bg-gray-700" />
        
        {activities.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start space-x-4 relative z-10"
          >
            <div className={`p-2 rounded-full ${item.bg} border border-white dark:border-gray-800`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</p>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{item.time}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800">
        View Full Timeline
      </button>
    </div>
  );
};

export default ActivityTimeline;
