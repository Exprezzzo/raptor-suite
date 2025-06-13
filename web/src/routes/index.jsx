// raptor-suite/web/src/routes/index.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Placeholder Components
const Dashboard = () => <h2>Admin Dashboard (Coming Soon!)</h2>;
const Projects = () => <h2>Projects Management</h2>;
const Users = () => <h2>User Management</h2>;
const Billing = () => <h2>Billing & Subscriptions</h2>;
const Settings = () => <h2>App Settings</h2>;
const NotFound = () => <h2>404: Not Found</h2>;

const AppRouter = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/billing">Billing</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/users" element={<Users />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all for undefined routes */}
      </Routes>
    </Router>
  );
};

export default AppRouter;