import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

const db = getFirestore(); // Get Firestore instance

const ProjectDetail = () => {
  const { projectId } = useParams(); // Get projectId from URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, "projects", projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">
        Loading Project...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 flex flex-col items-center justify-center p-4">
        <p className="text-xl">{error}</p>
        <Link to="/" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">
        No project data available.
      </div>
    );
  }

  // Display project details
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Link to="/" className="text-blue-400 hover:underline mb-6 block">&larr; Back to Dashboard</Link>
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-300 mb-4">{project.name}</h2>
        <p className="text-lg text-gray-300 mb-2">
          <span className="font-semibold">Type:</span> {project.type}
        </p>
        <p className="text-lg text-gray-300 mb-2">
          <span className="font-semibold">Owner:</span> {project.ownerEmail}
        </p>
        <p className="text-lg text-gray-300 mb-2">
          <span className="font-semibold">Created:</span> {project.createdAt ? new Date(project.createdAt.toDate()).toLocaleString() : 'N/A'}
        </p>
        <p className="text-lg text-gray-300 mb-4">
          <span className="font-semibold">Last Modified:</span> {project.lastModified ? new Date(project.lastModified.toDate()).toLocaleString() : 'N/A'}
        </p>

        <h3 className="text-2xl font-bold text-gray-200 mt-6 mb-4">Collaborators</h3>
        {project.collaboratorIds && project.collaboratorIds.length > 0 ? (
          <ul className="list-disc list-inside text-gray-300">
            {project.collaboratorIds.map(collabId => <li key={collabId}>{collabId}</li>)}
          </ul>
        ) : (
          <p className="text-gray-400">No collaborators added yet.</p>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
            Edit Project
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;