// raptor-suite/web/src/routes/AuthRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      {/* Redirect any other unauthenticated path to sign-in */}
      <Route path="*" element={<SignInPage />} />
    </Routes>
  );
};

export default AuthRoutes;