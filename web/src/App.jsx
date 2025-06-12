import React from 'react';
import VoiceModePanel from './components/VoiceModePanel'; // Import your VoiceModePanel
import { useAuth } from './contexts/AuthContext.jsx'; // To check user login status

function App() {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading authentication...</div>;
  }

  // Simple conditional rendering for demonstration: show VoiceModePanel if logged in
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      {user ? (
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center mb-6">Raptor Suite</h1>
          <VoiceModePanel projectId="my-test-project" /> {/* Pass a dummy project ID */}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please Log In to Use Raptor Suite</h2>
          <p className="text-gray-400">Authentication is required for full functionality.</p>
          {/* In a real app, you'd have a login button/form here */}
        </div>
      )}
    </div>
  );
}

export default App;