import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Development',
      description: 'Four specialized AI models help you build faster'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Family Collaboration',
      description: 'Work together on creative projects in real-time'
    },
    {
      icon: '🚀',
      title: 'Instant Deployment',
      description: 'Share your creations with one click'
    },
    {
      icon: '🎨',
      title: '6 Project Types',
      description: 'Web apps, games, stories, videos, 3D, presentations'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              About Raptor Suite
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A universal creative development platform that brings families together 
            to build amazing digital experiences with the power of AI.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
          <p className="text-gray-300 mb-4">
            Built by a tech entrepreneur and kidney transplant survivor from Las Vegas, 
            Raptor Suite is more than just a development platform—it's a legacy project 
            designed to empower families to create together.
          </p>
          <p className="text-gray-300">
            With 23+ years in the Las Vegas hospitality industry and deep connections 
            in technology, we're building tools that make advanced AI accessible to everyone, 
            from kids creating their first game to grandparents sharing their stories.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Link to="/playground">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 
                       text-white font-medium rounded-lg shadow-lg 
                       shadow-purple-500/25 hover:shadow-xl 
                       hover:shadow-purple-500/30 transition-all"
            >
              Try AI Playground
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 pb-8"
        >
          <p className="text-gray-500 text-sm">
            🦅 Built with love in Las Vegas • Raptor Suite © 2024
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;