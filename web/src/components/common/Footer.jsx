// raptor-suite/web/src/components/common/Footer.jsx

import React from 'react';
import './Footer.css'; // Create this CSS file next

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Raptor Suite. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;