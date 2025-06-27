import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRegNewspaper, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const PatchNotes = () => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GITHUB_USER = 'nashvel';
  const GITHUB_REPO = 'convenience-store';

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/commits`);
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.statusText}`);
        }
        const data = await response.json();
        setCommits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <FaGithub className="mx-auto text-5xl text-primary mb-4" />
        <h1 className="text-4xl font-bold text-gray-800">Development Changelog</h1>
        <p className="text-lg text-gray-600 mt-2">Live commit history from the official GitHub repository.</p>
      </div>

      {loading && <div className="text-center text-lg">Loading commit history...</div>}
      {error && <div className="text-center text-red-500">Failed to load commits: {error}</div>}

      {!loading && !error && (
        <div className="space-y-8">
          {commits.map((commitData, index) => (
            <motion.div
              key={commitData.sha}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <div className="p-6">
                <p className="text-lg font-semibold text-gray-800 mb-2">{commitData.commit.message}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <img 
                      src={commitData.author?.avatar_url || 'https://github.com/identicons/default.png'}
                      alt={commitData.commit.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{commitData.commit.author.name}</span>
                  </div>
                  <span>{formatDate(commitData.commit.author.date)}</span>
                </div>
                <a 
                  href={commitData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline mt-4 inline-flex items-center gap-2 text-sm"
                >
                  View on GitHub <FaExternalLinkAlt />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PatchNotes;
