import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminPanel from './AdminPanel';
import AdminLogin from './AdminLogin';
import { Navbar } from './';

const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='relative z-0 bg-primary min-h-screen'>
        <Navbar />
        <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
          <div className="text-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className='relative z-0 bg-primary min-h-screen'>
        <Navbar />
        <AdminLogin />
      </div>
    );
  }

  return (
    <div className='relative z-0 bg-primary min-h-screen'>
      <Navbar />
      <AdminPanel isPage={true} />
    </div>
  );
};

export default AdminRoute;
