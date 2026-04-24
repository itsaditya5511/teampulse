import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Bell, Check, Clock, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Header = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const fetchNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/unread-count`)
      ]);

      const newCount = countRes.data.count;

      // Play sound if unreadCount increased
      if (newCount > unreadCount) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Sound play blocked by browser:', e));
      }

      setNotifications(listRes.data);
      setUnreadCount(newCount);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/read-all`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getPageTitle = (path) => {
    if (path === '/') return 'Overview';
    if (path === '/dev') return 'Developer Dashboard';
    if (path === '/devops') return 'DevOps Operations';
    if (path === '/seo') return 'SEO Analytics';
    if (path === '/pm') return 'Project Management';
    return '';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate">
            {getPageTitle(location.pathname)}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 block h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white text-center ring-2 ring-white dark:ring-gray-800">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden ring-1 ring-black ring-opacity-5 transition-all">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/50">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`p-4 flex gap-3 transition-colors ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'opacity-70'}`}
                      >
                        <div className="flex-1">
                          <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            {n.message}
                          </p>
                          <div className="mt-1 flex items-center text-[10px] text-gray-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(n.createdAt)}
                          </div>
                        </div>
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n._id)}
                            className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
