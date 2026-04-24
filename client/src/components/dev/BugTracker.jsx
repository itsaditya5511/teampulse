import { useState, useEffect } from 'react';
import axios from 'axios';
import BugCard from './BugCard';
import { Plus, Filter, Search } from 'lucide-react';
import CreateBugForm from '../pm/CreateBugForm';
import { motion, AnimatePresence } from 'framer-motion';

const BugTracker = ({ roleFilter = null, title = "Bug Stream", showAddButton = false, presetBugs = null }) => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(!presetBugs);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (presetBugs) {
      setBugs(presetBugs);
      setLoading(false);
    } else {
      fetchBugs();
    }
  }, [statusFilter, roleFilter, presetBugs]);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_API_BASE_URL}/api/bugs?`;
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      
      const res = await axios.get(url);
      let data = res.data;

      if (roleFilter) {
        data = data.filter(bug => bug.assignedTo?.role === roleFilter);
      }

      setBugs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/bugs/${id}`, { status: newStatus });
      if (presetBugs) {
        // If external data, we'd ideally trigger a refresh in parent, 
        // but for now we refresh locally if possible or just rely on parent state management if we had it.
        // Since we are passing presetBugs, the parent should ideally handle the update.
        // For simplicity, let's just trigger local refresh if we can.
      }
      fetchBugs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         bug.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30 dark:bg-gray-900/10">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tracking {filteredBugs.length} active items</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-3 pr-8 py-1.5 text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">Active</option>
            <option value="resolved">Done</option>
          </select>

          {showAddButton && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="p-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Syncing Stream...</p>
          </div>
        ) : filteredBugs.length === 0 ? (
          <div className="py-12 text-center bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
            <Filter className="w-8 h-8 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">No matching items</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredBugs.map(bug => (
              <BugCard key={bug._id} bug={bug} onStatusChange={handleStatusChange} onUpdate={fetchBugs} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {isFormOpen && (
        <CreateBugForm 
          onClose={() => setIsFormOpen(false)} 
          onCreated={fetchBugs} 
        />
      )}
    </div>
  );
};

export default BugTracker;
