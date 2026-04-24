import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, RefreshCw } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const APIHealthBoard = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);

  const fetchEndpoints = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/apihealth`);
      setEndpoints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
    const interval = setInterval(fetchEndpoints, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleManualPing = async () => {
    try {
      setPinging(true);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/apihealth/ping`);
      toast.success("Manual ping triggered");
      await fetchEndpoints();
    } catch (err) {
      toast.error("Failed to ping endpoints");
    } finally {
      setPinging(false);
    }
  };

  const getChartData = (history) => {
    // Return last 20 reversed so oldest is first
    return [...history].slice(0, 20).reverse().map((h, i) => ({
      time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ms: h.responseTime
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Activity className="w-5 h-5 mr-2 text-indigo-500" /> API Health Monitor
        </h3>
        <button 
          onClick={handleManualPing}
          disabled={pinging}
          className="p-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors dark:bg-gray-700 dark:text-indigo-400 dark:hover:bg-gray-600 disabled:opacity-50"
          title="Manual Ping"
        >
          <RefreshCw className={`w-5 h-5 ${pinging ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
        {loading ? (
           <p className="text-gray-500">Loading health data...</p>
        ) : endpoints.length === 0 ? (
           <p className="text-gray-500">No monitored endpoints.</p>
        ) : (
          endpoints.map((ep) => (
            <div key={ep._id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{ep.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{ep.url}</p>
                </div>
                <div className="flex flex-col items-end">
                  <StatusBadge status={ep.status} />
                  <span className="text-xs text-gray-500 mt-1 mt-1 text-right">Uptime: {ep.uptimePercent}%</span>
                </div>
              </div>
              
              {/* Line chart for response times */}
              <div className="h-24 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData(ep.history)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB', fontSize: '12px' }}
                      itemStyle={{ color: '#E5E7EB' }}
                      labelStyle={{ color: '#9CA3AF' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ms" 
                      stroke={ep.status === 'up' ? '#10B981' : ep.status === 'slow' ? '#F59E0B' : '#EF4444'} 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default APIHealthBoard;
