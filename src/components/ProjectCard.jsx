import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, index, onDelete }) => {
  const navigate = useNavigate();

  const projectTypeConfig = {
    webapp: { icon: '🌐', gradient: 'from-blue-500 to-cyan-600' },
    game: { icon: '🎮', gradient: 'from-purple-500 to-pink-600' },
    story: { icon: '📖', gradient: 'from-green-500 to-emerald-600' },
    video: { icon: '🎬', gradient: 'from-red-500 to-orange-600' },
    '3d': { icon: '🎯', gradient: 'from-indigo-500 to-purple-600' },
    presentation: { icon: '📊', gradient: 'from-amber-500 to-yellow-600' }
  };

  const config = projectTypeConfig[project.type] || projectTypeConfig.webapp;
  const createdDate = project.createdAt?.toDate?.() || new Date();
  const formattedDate = createdDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  const handleOpen = () => {
    navigate(`/project/${project.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 
                      transition-opacity duration-300 rounded-xl blur-xl"
           style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
        <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient}`}></div>
      </div>

      <div className="relative bg-gray-800 border border-gray-700 rounded-xl p-6 
                      hover:border-gray-600 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-white">{project.name}</h3>
              <p className="text-sm text-gray-400">{formattedDate}</p>
            </div>
          </div>
          
          {/* Options Menu */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleOpen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 
                         rounded-lg transition-colors"
              title="Open project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700 
                         rounded-lg transition-colors"
              title="Delete project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Last updated:</span>
            <span className="text-xs text-gray-400">
              {project.updatedAt?.toDate?.().toLocaleDateString() || 'Recently'}
            </span>
          </div>
          
          <button
            onClick={handleOpen}
            className="text-sm font-medium text-purple-400 hover:text-purple-300 
                       transition-colors flex items-center gap-1"
          >
            Open
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;