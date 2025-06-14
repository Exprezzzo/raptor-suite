import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import { 
  getFirestore, 
  collection, 
  query, 
  limit, 
  where, 
  getDocs,
  getFunctions,
  httpsCallable // Import httpsCallable
} from '../config/firebase'; // Import from optimized firebase config
import './Dashboard.css'; // Assuming Dashboard.css styles the page

const Dashboard = () => {
  const { user } = useAuth(); // Destructure user from useAuth
  const navigate = useNavigate(); // Initialize useNavigate
  const [userRole, setUserRole] = useState('user');
  const [latestProjects, setLatestProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Only fetch data if user is logged in
      if (!user) {
        setLoading(false); // Set loading to false if no user is present
        return;
      }
      
      try {
        setLoading(true);
        setError(null);

        // Fetch user role using Callable Function
        const functionsInstance = await getFunctions(); // Get functions instance asynchronously
        const getUserRoleCallable = await httpsCallable(functionsInstance, 'getUserRole'); // Use functionsInstance
        const roleResult = await getUserRoleCallable();
        setUserRole(roleResult.data.role);

        // Fetch latest projects
        const db = await getFirestore(); // Get firestore instance asynchronously
        const projectsRef = await collection(db, 'projects'); // Use db instance
        
        let q;
        if (roleResult.data.role === 'admin') {
          q = await query(projectsRef, await limit(5));
        } else {
          const whereClause = await where('members', 'array-contains', user.uid);
          q = await query(projectsRef, whereClause, await limit(5));
        }

        const projectSnapshot = await getDocs(q);
        const projectsData = projectSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setLatestProjects(projectsData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Call fetchData only when user changes (after login or logout)
    fetchData();
  }, [user]); // Dependency array includes 'user'

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard…</div>;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Hello, {user?.displayName || user?.email || 'Guest'}!</h2>
      <p>Your Role: <strong>{userRole.toUpperCase()}</strong></p>

      {/* Quick Actions (from original integration plan) */}
      <section className="dashboard-section">
        <h3>Quick Actions</h3>
        <div className="stats-grid">
          <div 
            className="stat-card cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={() => navigate('/workspace')}
          >
            <h4 className="text-blue-600">🚀 Open Workspace</h4>
            <p className="text-sm">Start coding with AI assistance</p>
          </div>
          <div className="stat-card">
            <h4 className="text-green-600">📁 New Project</h4>
            <p className="text-sm">Create a new development project</p>
          </div>
          <div className="stat-card">
            <h4 className="text-purple-600">🤖 AI Playground</h4>
            <p className="text-sm">Test different AI models</p>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h3>Quick Stats</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Projects</h4>
            <p>25</p>
          </div>
          <div className="stat-card">
            <h4>Your Active Projects</h4>
            <p>{latestProjects.length}</p>
          </div>
          <div className="stat-card">
            <h4>Storage Usage</h4>
            <p>1.5 GB / 5 GB</p>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h3>Latest Projects</h3>
        {latestProjects.length > 0 ? (
          <ul className="project-list">
            {latestProjects.map(project => (
              <li key={project.id} className="project-item">
                <span className="project-title">{project.name || 'Untitled Project'}</span>
                <span className="project-status">{project.isPublic ? 'Public' : 'Private'}</span>
                {/* Add link to open project in workspace */}
                <button 
                  onClick={() => navigate(`/workspace/${project.id}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Open →
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No projects found. Start creating!</p>
            <button 
              onClick={() => navigate('/workspace')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Project
            </button>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h3>Universal AI Assistant</h3>
        <p>Your multi-provider AI router is ready with OpenAI, Claude, and Gemini.</p>
        <div className="flex gap-3 mt-4">
          <button 
            onClick={() => navigate('/workspace')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Start Coding with AI
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            AI Playground
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;