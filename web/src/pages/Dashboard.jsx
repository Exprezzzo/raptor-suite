/* raptor-suite/web/src/pages/Dashboard.css */

.dashboard-container {
  padding: 20px;
  background-color: #f8f9fa; /* Light background for the dashboard area */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.dashboard-container h2 {
  color: #343a40;
  margin-bottom: 25px;
  font-size: 2.2em;
}

.dashboard-container p {
  font-size: 1.1em;
  color: #555;
}

.dashboard-container strong {
  color: #007bff; /* Blue for emphasis */
}

.dashboard-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.03);
  margin-bottom: 25px;
}

.dashboard-section h3 {
  color: #495057;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: #e9ecef;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.stat-card h4 {
  margin-top: 0;
  color: #0056b3;
  font-size: 1.3em;
}

.stat-card p {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}

.project-list {
  list-style: none;
  padding: 0;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.project-item:last-child {
  border-bottom: none;
}

.project-title {
  font-weight: bold;
  color: #333;
}

.project-status {
  font-style: italic;
  color: #666;
  font-size: 0.9em;
}

.dashboard-loading,
.dashboard-error {
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: #dc3545; /* Red for errors */
}

.dashboard-loading {
  color: #007bff; /* Blue for loading */
}


/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .dashboard-container {
    background-color: #2c2c2c;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  .dashboard-container h2 {
    color: #f8f9fa;
  }
  .dashboard-container p {
    color: #bbb;
  }
  .dashboard-container strong {
    color: #8ab4f8; /* Lighter blue for emphasis */
  }
  .dashboard-section {
    background-color: #3a3a3a;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  }
  .dashboard-section h3 {
    color: #e0e0e0;
    border-color: #555;
  }
  .stat-card {
    background-color: #4a4a4a;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }
  .stat-card h4 {
    color: #90caf9;
  }
  .stat-card p {
    color: #f8f9fa;
  }
  .project-title {
    color: #f8f9fa;
  }
  .project-status {
    color: #aaa;
  }
  .project-item {
    border-color: #444;
  }
}