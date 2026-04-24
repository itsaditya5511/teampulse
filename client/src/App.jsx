import { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DevDashboard from './pages/DevDashboard';
import DevOpsDashboard from './pages/DevOpsDashboard';
import SEODashboard from './pages/SEODashboard';
import PMDashboard from './pages/PMDashboard';

// Layout
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'admin') {
     return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/dev" element={
          <ProtectedRoute allowedRoles={['dev']}>
            <DevDashboard />
          </ProtectedRoute>
        } />

        <Route path="/devops" element={
          <ProtectedRoute allowedRoles={['devops']}>
            <DevOpsDashboard />
          </ProtectedRoute>
        } />

        <Route path="/seo" element={
          <ProtectedRoute allowedRoles={['seo']}>
            <SEODashboard />
          </ProtectedRoute>
        } />

        <Route path="/pm" element={
          <ProtectedRoute allowedRoles={['pm']}>
            <PMDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
