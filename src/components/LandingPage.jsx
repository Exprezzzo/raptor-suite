import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    // If user is signed in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const projectTypes = [
    {
      id: 'webapp',
      title: 'Web App',
      description: 'Build responsive web applications',
      icon: '🌐',
      gradient: 'from-blue-500 to-cyan-600',
      features: ['React Components', 'Real-time Data', 'User Auth']
    },
    {
      id: 'game',
      title: 'Game',
      description: 'Create interactive games and experiences',
      icon: '🎮',
      gradient: 'from-purple-500 to-pink-600',
      features: ['Game Physics', '2D/3D Graphics', 'Multiplayer']
    },
    {
      id: 'story',
      title: 'Interactive Story',
      description: 'Craft branching narratives',
      icon: '📖',
      gradient: 'from-green-500 to-emerald-600',
      features: ['Branching Paths', 'Character Development', 'Rich Media']
    },
    {
      id: 'video',
      title: 'Video Project',
      description: 'Edit and produce videos',
      icon: '🎬',
      gradient: 'from-red-500 to-orange-600',
      features: ['Timeline Editor', 'Effects Library', 'Audio Mixing']
    },
    {
      id: '3d',
      title: '3D Experience',
      description: 'Build immersive 3D worlds',
      icon: '🎯',
      gradient: 'from-indigo-500 to-purple-600',
      features: ['3D Modeling', 'Physics Engine', 'VR Support']
    },
    {
      id: 'presentation',
      title: 'Presentation',
      description: 'Design stunning presentations',
      icon: '📊',
      gradient: 'from-amber-500 to-yellow-600',
      features: ['Slide Templates', 'Animations', 'Data Viz']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Create Together
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Build web apps, games, videos, and 3D experiences with AI-powered development
            </p>
          </motion.div>
        </div>
      </section>

      {/* Project Types Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Choose Your Creative Path
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectTypes.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                   style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
                <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient}`}></div>
              </div>
              
              <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-colors">
                <div className="text-4xl mb-4">{project.icon}</div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.features.map((feature, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-12">Powered by AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Smart Code Generation</h3>
              <p className="text-gray-400">AI writes production-ready code based on your descriptions</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Collaboration</h3>
              <p className="text-gray-400">Work together with family and friends in real-time</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Instant Deployment</h3>
              <p className="text-gray-400">Share your creations with one click</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;