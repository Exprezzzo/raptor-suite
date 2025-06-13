// raptor-suite/web/src/routes/MainRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

// Placeholder components for future pages
const Projects = () => <h2>Projects Management</h2>;
const Users = () => <h2>User Management</h2>;
const Billing = () => <h2>Billing & Subscriptions</h2>;
const Settings = () => <h2>App Settings</h2>;
const NotFound = () => <h2>404: Page Not Found</h2>;

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/users" element={<Users />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;