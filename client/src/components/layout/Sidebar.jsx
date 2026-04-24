import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  Home, 
  TerminalSquare, 
  Server, 
  Search,
  LogOut,
  Activity,
  Layout,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Overview', path: '/', icon: Home, roles: ['dev', 'devops', 'seo', 'pm', 'admin'] },
    { name: 'PM Dashboard', path: '/pm', icon: Layout, roles: ['pm', 'admin'] },
    { name: 'Dev Dashboard', path: '/dev', icon: TerminalSquare, roles: ['dev', 'admin'] },
    { name: 'DevOps View', path: '/devops', icon: Server, roles: ['devops', 'admin'] },
    { name: 'SEO Metrics', path: '/seo', icon: Search, roles: ['seo', 'admin'] },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">TeamPulse</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.filter(item => item.roles.includes(user.role) || user.role === 'admin').map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={logout}
            className="flex-shrink-0 w-full group block text-left"
          >
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold dark:bg-indigo-900 dark:text-indigo-300">
                {user.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                  {user.name}
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 flex items-center dark:text-gray-400">
                  <LogOut className="h-3 w-3 mr-1" /> Logout
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
