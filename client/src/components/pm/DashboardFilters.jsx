import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const DashboardFilters = ({ filters, setFilters, teamMembers = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-wrap gap-4 items-center transition-colors mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks by title..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
          value={filters.search}
          onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none dark:text-white"
          value={filters.priority}
          onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none dark:text-white"
          value={filters.status}
          onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none dark:text-white"
          value={filters.assignee}
          onChange={(e) => setFilters(f => ({ ...f, assignee: e.target.value }))}
        >
          <option value="all">All Assignees</option>
          {teamMembers.map(m => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>
      </div>
      
      <button 
        onClick={() => setFilters({ search: '', priority: 'all', status: 'all', assignee: 'all' })}
        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline px-2"
      >
        Clear All
      </button>
    </div>
  );
};

export default DashboardFilters;
