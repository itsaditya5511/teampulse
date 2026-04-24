import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Shield, TrendingUp } from 'lucide-react';

const TeamOverview = () => {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const [usersRes, bugsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/users`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bugs`),
      ]);

      const users = usersRes.data;
      const bugs = bugsRes.data;

      const enriched = users.map(user => {
        const assigned = bugs.filter(b => b.assignedTo?._id === user._id);
        const openBugs = assigned.filter(b => b.status === 'open').length;
        const inProgress = assigned.filter(b => b.status === 'in-progress').length;
        const resolved = assigned.filter(b => b.status === 'resolved').length;
        
        // Mock productivity score
        const productivity = assigned.length > 0 ? Math.round((resolved / assigned.length) * 100) : 0;
        
        return { ...user, openBugs, inProgress, resolved, totalAssigned: assigned.length, productivity };
      });

      setTeamData(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'dev': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'devops': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'seo': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'pm': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <Users className="w-5 h-5 mr-2 text-indigo-500" />
          Team Roster
        </h3>
        <TrendingUp className="w-4 h-4 text-gray-400" />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-900/50 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {teamData.map((member, idx) => (
            <motion.div 
              key={member._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex flex-col p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:border-indigo-500/30 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{member.name}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Load</p>
                  <p className={`text-sm font-black ${member.totalAssigned > 5 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                    {member.totalAssigned}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50 text-center">
                  <p className="text-[10px] font-bold text-red-500">{member.openBugs}</p>
                  <p className="text-[9px] text-gray-400 uppercase font-medium">Open</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50 text-center">
                  <p className="text-[10px] font-bold text-amber-500">{member.inProgress}</p>
                  <p className="text-[9px] text-gray-400 uppercase font-medium">Active</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50 text-center">
                  <p className="text-[10px] font-bold text-green-500">{member.resolved}</p>
                  <p className="text-[9px] text-gray-400 uppercase font-medium">Done</p>
                </div>
              </div>

              {/* Mini progress line for member productivity */}
              <div className="mt-3 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${member.productivity}%` }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamOverview;
