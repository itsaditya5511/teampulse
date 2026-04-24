import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layout, Bug as BugIcon, Calendar, User as UserIcon, BarChart3, Clock, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import TeamOverview from '../components/pm/TeamOverview';
import CreateBugForm from '../components/pm/CreateBugForm';
import StatusBadge from '../components/shared/StatusBadge';
import KPISection from '../components/pm/KPISection';
import DashboardFilters from '../components/pm/DashboardFilters';
import DashboardInsights from '../components/pm/DashboardInsights';
import SubtleNetwork from '../components/pm/SubtleNetwork';

const PMDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editBug, setEditBug] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all',
    status: 'all',
    assignee: 'all'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [bugsRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bugs`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/users`)
      ]);
      setBugs(bugsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bug) => {
    setEditBug(bug);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditBug(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (bug) => {
    if (!bug.deadline || bug.status === 'resolved') return false;
    const now = new Date();
    const deadline = new Date(bug.deadline);
    // Office time cutoff: 5:30 PM (17:30)
    deadline.setHours(17, 30, 0, 0);
    return now > deadline;
  };

  const filteredBugs = useMemo(() => {
    return bugs.filter(bug => {
      const matchSearch = bug.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchPriority = filters.priority === 'all' || bug.priority === filters.priority;
      const matchStatus = filters.status === 'all' || bug.status === filters.status;
      const matchAssignee = filters.assignee === 'all' || bug.assignedTo?._id === filters.assignee;
      return matchSearch && matchPriority && matchStatus && matchAssignee;
    });
  }, [bugs, filters]);

  const chartData = useMemo(() => {
    const statusCounts = {
      open: bugs.filter(b => b.status === 'open').length,
      'in-progress': bugs.filter(b => b.status === 'in-progress').length,
      resolved: bugs.filter(b => b.status === 'resolved').length,
    };
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [bugs]);

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  const getStatusProgress = (status) => {
    if (status === 'resolved') return 100;
    if (status === 'in-progress') return 60;
    return 0;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Section with 3D Background */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <SubtleNetwork />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center"
            >
              <Layout className="w-8 h-8 mr-3 text-indigo-600 dark:text-indigo-400" />
              Project Pulse
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg"
            >
              Real-time project oversight, team velocity tracking, and task management.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Launch New Task
          </motion.button>
        </div>
      </div>

      {/* KPI Section */}
      <KPISection bugs={bugs} />

      {/* Filters Section */}
      <DashboardFilters filters={filters} setFilters={setFilters} teamMembers={users} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main tasks list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <BugIcon className="w-5 h-5 mr-2 text-indigo-500" />
                Task Stream
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Sorted by: Recent</span>
                <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                  {filteredBugs.length} Matches
                </span>
              </div>
            </div>
            
            <div className="max-h-[800px] overflow-y-auto">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 italic">Syncing project data...</p>
                </div>
              ) : filteredBugs.length === 0 ? (
                <div className="p-12 text-center">
                   <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                     <CheckCircle2 className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                   </div>
                   <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks match your filters.</p>
                   <button onClick={() => setFilters({search: '', priority: 'all', status: 'all', assignee: 'all'})} className="text-indigo-500 text-sm mt-2 hover:underline">Reset all filters</button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  <AnimatePresence mode="popLayout">
                    {filteredBugs.map((bug, index) => (
                      <motion.div 
                        key={bug._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all group cursor-pointer border-l-4 border-transparent hover:border-indigo-500"
                        onClick={() => handleEdit(bug)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="space-y-1 pr-4">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {bug.title}
                              </h4>
                              {isOverdue(bug) && (
                                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center border border-red-200 dark:border-red-800">
                                  <Clock className="w-3 h-3 mr-1" />
                                  NOT COMPLETED BY EMPLOYEE (POST 17:30)
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{bug.description}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                            <StatusBadge status={bug.priority} />
                            <StatusBadge status={bug.status} />
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                           <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-1">
                             <span>Completion Progress</span>
                             <span>{getStatusProgress(bug.status)}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${getStatusProgress(bug.status)}%` }}
                               className={`h-full rounded-full ${bug.status === 'resolved' ? 'bg-green-500' : 'bg-indigo-500'}`}
                             />
                           </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-[11px]">
                          {/* Assignee Name */}
                          <div className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">
                            <UserIcon className="w-3 h-3 mr-1.5 text-indigo-500" />
                            <span className="font-bold text-gray-700 dark:text-gray-300">
                              {bug.assignedTo?.name || 'Unassigned'}
                            </span>
                          </div>

                          {/* Assign Time */}
                          <div className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">
                            <Clock className="w-3 h-3 mr-1.5 text-indigo-500" />
                            <span className="font-medium">Assigned: {new Date(bug.createdAt).toLocaleDateString()} {new Date(bug.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          {/* End Date & Time */}
                          <div className={`flex items-center px-2 py-1 rounded-md border ${
                            isOverdue(bug)
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400'
                            : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                          }`}>
                            <Calendar className="w-3 h-3 mr-1.5" />
                            <span className="font-bold">
                              Ends: {formatDate(bug.deadline)} @ 17:30
                            </span>
                          </div>

                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 dark:text-indigo-400 font-bold flex items-center">
                            MANAGE <Plus className="w-3 h-3 ml-1" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="space-y-6">
          <TeamOverview />
          
          <DashboardInsights bugs={bugs} />

          {/* Quick Analytics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center mb-6 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 mr-2 text-indigo-500" />
              Status Distribution
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {chartData.map((d, i) => (
                <div key={i} className="text-center">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">{d.value}</div>
                  <div className="text-[10px] text-gray-400 uppercase">{d.name}</div>
                  <div className="h-1 w-8 mx-auto mt-1 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <CreateBugForm 
          onClose={handleCloseForm}
          onCreated={fetchInitialData}
          editBug={editBug}
        />
      )}
    </div>
  );
};

export default PMDashboard;
