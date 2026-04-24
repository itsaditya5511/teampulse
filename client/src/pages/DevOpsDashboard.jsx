import React from 'react';
import CloudGlobe from '../components/devops/CloudGlobe';
import DeploymentLog from '../components/devops/DeploymentLog';
import APIHealthBoard from '../components/devops/APIHealthBoard';
import BugTracker from '../components/dev/BugTracker';
import { Server, Globe, ShieldCheck, Activity } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, status, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={64} />
    </div>
    <div className="flex items-center space-x-3 mb-4">
      <div className={`p-2 rounded-lg ${status === 'good' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'}`}>
        <Icon size={20} />
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">{title}</h3>
    </div>
    <div className="flex items-baseline space-x-2">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h2>
      {trend && <span className="text-sm font-medium text-emerald-500">{trend}</span>}
    </div>
  </div>
);

const DevOpsDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Cloud Infrastructure</h1>
          <p className="text-gray-500 dark:text-gray-400">Managing global .com deployments and server clusters.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
            Configure DNS
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
            Deploy New Instance
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Globe} title="Hosted .com Domains" value="142" status="good" trend="+12 this month" />
        <StatCard icon={Server} title="Active Cloud Nodes" value="86" status="neutral" />
        <StatCard icon={ShieldCheck} title="SSL Certificates" value="100%" status="good" />
        <StatCard icon={Activity} title="Global Uptime" value="99.99%" status="good" trend="All systems nominal" />
      </div>

      {/* Three.js Globe & Health Board */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CloudGlobe />
        </div>
        <div className="xl:col-span-1">
          <APIHealthBoard />
        </div>
      </div>
      
      {/* Deployments & Issues */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DeploymentLog />
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <BugTracker 
            title="Infrastructure & Platform Alerts" 
            showAddButton={true} 
          />
        </div>
      </div>
    </div>
  );
};

export default DevOpsDashboard;
