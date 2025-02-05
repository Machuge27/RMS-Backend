import React, { useState } from 'react';
import { Home, CreditCard, Bell, User, LogOut, Link } from 'lucide-react';
import Logout from "../Components/boxes/LogoutButton";
// Import components from separate files
import Dashboard from '../Components/Dashboard';
import Payments from '../Components/Payments';
import Notifications from '../Components/admin/Notifications';
import Account from '../Components/Account';
import Us from '../Components/boxes/Us';

import '../css/TenantDashboard.css';

// Main TenantDashboard Component
const TenantDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  // Sidebar menu items with icons
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <Home size={20} />,
      component: Dashboard 
    },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: <CreditCard size={20} />,
      component: Payments 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <Bell size={20} />,
      component: Notifications 
    },
    { 
      id: 'account', 
      label: 'Profile', 
      icon: <User size={20} />,
      component: Account 
    },
    {
      id: 'us',
      component: Us
    },
  ];

  // Render the active page component
  const ActivePageComponent = menuItems.find(item => item.id === activePage)?.component || Dashboard;

  return (
    <div className="tenant-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <div className="logo">NYUMBANI</div>
            {menuItems.slice(0, -1).map((item) => (
              <button 
                key={item.id}
                className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
        </div>
          <div>
              <Logout/>
            <button 
              className={`sidebar-item ${activePage === 'us' ? 'active' : ''}`}
              key="us"
              onClick={() => {
                setActivePage('us')
                }}
            >
              <Link size={20} />
              <span>Us</span>
            </button>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <ActivePageComponent />
      </div>
    </div>
  );
};

export default TenantDashboard;