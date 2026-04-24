import { useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import StatusBadge from '../shared/StatusBadge';
import { Rocket, Clock, AlertTriangle, MessageSquare, ExternalLink, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const BugCard = ({ bug, onStatusChange, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [requesting, setRequesting] = useState(false);

  const handleRequestDeployment = async () => {
    try {
      setRequesting(true);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/deployments/request/${bug._id}`);
      toast.success('Deployment request sent to DevOps!');
    } catch (err) {
      toast.error('Failed to request deployment');
      console.error(err);
    } finally {
      setRequesting(false);
    }
  };

  const isOverdue = bug.deadline && new Date(bug.deadline) < new Date() && bug.status !== 'resolved';
  const progress = bug.status === 'resolved' ? 100 : bug.status === 'in-progress' ? 60 : 10;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 shadow-sm overflow-hidden relative"
    >
      {/* Risk indicator bar */}
      <div className={`absolute top-0 left-0 w-1 h-full ${isOverdue ? 'bg-red-500' : 'bg-transparent transition-colors group-hover:bg-indigo-500/50'}`} />

      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <h4 className="text-base font-black text-gray-900 dark:text-white capitalize group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {bug.title}
                </h4>
                {isOverdue && (
                  <span className="flex items-center text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Overdue Risk
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {bug.description}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2 shrink-0">
              <StatusBadge status={bug.priority} />
              <StatusBadge status={bug.status} />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>Delivery Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full rounded-full ${bug.status === 'resolved' ? 'bg-green-500' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">
              <Clock className="w-3 h-3 mr-1.5 text-indigo-500" />
              Due: {bug.deadline ? new Date(bug.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Flexible'}
            </div>
            <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase">
              <MessageSquare className="w-3 h-3 mr-1.5" />
              4 Comments
            </div>
            <button className="flex items-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
              View Details <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        <div className="shrink-0 flex flex-col justify-between items-end md:w-48 pt-1">
          <div className="w-full space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Update Status</label>
            <select
              value={bug.status}
              onChange={(e) => onStatusChange(bug._id, e.target.value)}
              disabled={user?.id !== bug.assignedTo?._id && user?.role !== 'admin' && user?.role !== 'pm'}
              className="text-xs font-bold border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 w-full disabled:opacity-50 disabled:cursor-not-allowed py-2 shadow-sm"
            >
              <option value="open">⭕ Open</option>
              <option value="in-progress">⏳ In Progress</option>
              <option value="resolved">✅ Resolved</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2 w-full mt-4">
            {user?.role === 'dev' && bug.status === 'resolved' && (
              <button
                onClick={handleRequestDeployment}
                disabled={requesting}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 active:scale-95"
              >
                <Rocket className="w-3.5 h-3.5 mr-2" />
                {requesting ? 'Processing...' : 'Request Deploy'}
              </button>
            )}
            
            <button className="w-full text-[10px] font-bold text-gray-400 dark:text-gray-500 hover:text-indigo-500 transition-colors uppercase tracking-widest flex items-center justify-center py-2 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
              Add Update <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BugCard;
