import { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, TrendingUp, TrendingDown, Minus, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const KeywordTracker = () => {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKeyword, setNewKeyword] = useState('');
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/seo/keywords`);
      setKeywords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newKeyword) return;
    setAdding(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/seo/keywords`, {
        keyword: newKeyword,
        targetUrl: 'https://teampulse.com',
        position: Math.floor(Math.random() * 50) + 1
      });
      setNewKeyword('');
      toast.success("Keyword tracking initialized");
      fetchKeywords();
    } catch (err) {
      toast.error("Failed to add keyword");
    } finally {
      setAdding(false);
    }
  };

  const filteredKeywords = keywords.filter(kw => 
    kw.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30 dark:bg-gray-900/10">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center">
            <Target className="w-5 h-5 mr-2 text-indigo-500" /> SERP Rankings
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tracking {keywords.length} target keywords</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input 
              type="text"
              placeholder="Filter keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
            />
          </div>
          
          <form onSubmit={handleAdd} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="New target query..."
              className="flex-1 md:w-40 px-3 py-1.5 text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
              required
            />
            <button
              type="submit"
              disabled={adding}
              className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 active:scale-95"
            >
              {adding ? '...' : 'Track'}
            </button>
          </form>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700/50">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Query</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Volume (Est)</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Difficulty</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Position</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Trend</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50 dark:bg-gray-800 dark:divide-gray-700/30">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Loading Rankings...</p>
                </td>
              </tr>
            ) : filteredKeywords.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center bg-gray-50/50 dark:bg-gray-900/20">
                  <Filter className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">No keywords found</p>
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {filteredKeywords.map((kw, idx) => {
                  const trend = idx % 3 === 0 ? 'up' : idx % 3 === 1 ? 'same' : 'down';
                  // Mock data for UI polish
                  const volume = Math.floor(Math.random() * 50) * 100 + 500;
                  const difficulty = Math.floor(Math.random() * 60) + 20;
                  
                  return (
                    <motion.tr 
                      key={kw._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {kw.keyword}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{volume.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${difficulty > 60 ? 'bg-red-500' : difficulty > 40 ? 'bg-amber-500' : 'bg-green-500'}`}
                              style={{ width: `${difficulty}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-gray-400">{difficulty}/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-black ${kw.position <= 3 ? 'text-green-500' : kw.position <= 10 ? 'text-indigo-500' : 'text-gray-600 dark:text-gray-300'}`}>
                            #{kw.position || '--'}
                          </span>
                          {kw.position <= 3 && <span className="text-[8px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase">Top 3</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {trend === 'up' && (
                          <div className="flex items-center text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md w-fit">
                            <TrendingUp className="w-3.5 h-3.5 mr-1" /> +2
                          </div>
                        )}
                        {trend === 'same' && (
                          <div className="flex items-center text-xs font-bold text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md w-fit">
                            <Minus className="w-3.5 h-3.5 mr-1" /> --
                          </div>
                        )}
                        {trend === 'down' && (
                          <div className="flex items-center text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md w-fit">
                            <TrendingDown className="w-3.5 h-3.5 mr-1" /> -1
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeywordTracker;
