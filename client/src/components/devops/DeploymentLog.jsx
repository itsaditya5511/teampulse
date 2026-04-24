import { useState, useEffect } from 'react';
import axios from 'axios';
import StatusBadge from '../shared/StatusBadge';
import { Server, Calendar } from 'lucide-react';

const DeploymentLog = () => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [envFilter, setEnvFilter] = useState('all');

  useEffect(() => {
    fetchDeployments();
  }, [envFilter]);

  const fetchDeployments = async () => {
    try {
      setLoading(true);
      const url = envFilter === 'all' 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/deployments` 
        : `${import.meta.env.VITE_API_BASE_URL}/api/deployments?environment=${envFilter}`;
      const res = await axios.get(url);
      setDeployments(res.data);
    } catch (err) {
      console.error("Error fetching deployments", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Server className="w-5 h-5 mr-2 text-indigo-500" /> Recent Deployments
        </h3>
        <select
          value={envFilter}
          onChange={(e) => setEnvFilter(e.target.value)}
          className="block pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Environments</option>
          <option value="production">Production</option>
          <option value="staging">Staging</option>
          <option value="dev">Development</option>
        </select>
      </div>

      <div className="flow-root max-h-[500px] overflow-y-auto pr-2">
        <ul className="-mb-8">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading deployments...</p>
          ) : deployments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No deployments found.</p>
          ) : (
            deployments.map((deployment, idx) => (
              <li key={deployment._id}>
                <div className="relative pb-8">
                  {idx !== deployments.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800
                        ${deployment.status === 'success' ? 'bg-green-500' : deployment.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                        <Calendar className="h-4 w-4 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {deployment.project} <span className="font-mono text-gray-500 text-xs ml-1">{deployment.version}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Deployed to <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{deployment.environment}</span> by {deployment.deployedBy?.name}
                        </p>
                        {deployment.notes && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">{deployment.notes}</p>
                        )}
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500 flex flex-col items-end">
                        <StatusBadge status={deployment.status} />
                        <span className="text-xs mt-1">{new Date(deployment.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default DeploymentLog;
