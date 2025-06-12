import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import CreateProjectModal from './CreateProjectModal';
import ProjectCard from './ProjectCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  // Load user's projects
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateProject = (type) => {
    setSelectedType(type);
    setShowCreateModal(true);
  };

  const createNewProject = async (projectData) => {
    try {
      const newProject = {
        ...projectData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        collaborators: [user.email],
        status: 'active'
      };

      await addDoc(collection(db, 'projects'), newProject);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const projectTypes = [
    { id: 'webapp', title: 'Web App', icon: '🌐', color: 'from-blue-500 to-cyan-600' },
    { id: 'game', title: 'Game', icon: '🎮', color: 'from-purple-500 to-pink-600' },
    { id: 'story', title: 'Story', icon: '📖', color: 'from-green-500 to-emerald-600' },
    { id: 'video', title: 'Video', icon: '🎬', color: 'from-red-500 to-orange-600' },
    { id: '3d', title: '3D Project', icon: '🎯', color: 'from-indigo-500 to-purple-600' },
    { id: 'presentation', title: 'Presentation', icon: '📊', color: 'from-amber-500 to-yellow-600' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-xl text-gray-400">Please sign in to view your projects</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user.displayName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-400">
            {projects.length === 0 
              ? "Start your creative journey by creating your first project"
              : `You have ${projects.length} active project${projects.length === 1 ? '' : 's'}`
            }
          </p>
        </motion.div>

        {/* Create New Project Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Create New Project</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {projectTypes.map((type, index) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCreateProject(type)}
                className={`relative p-6 rounded-xl bg-gradient-to-br ${type.color} 
                          text-white shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium">{type.title}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Your Projects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Your Projects</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl">
              <p className="text-gray-400 text-lg">No projects yet. Create your first one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onDelete={deleteProject}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateProjectModal
            projectType={selectedType}
            onClose={() => setShowCreateModal(false)}
            onCreate={createNewProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;