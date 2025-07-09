import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import PatchNotesSkeleton from '../../components/Skeletons/PatchNotesSkeleton';

const GITHUB_USER = 'nashvel';
const GITHUB_REPO = 'convenience-store';
// IMPORTANT: To fix the 401 error, you need to create a personal access token on GitHub
// with the `public_repo` scope and add it to a `.env` file in the `frontend` directory.
// The file should contain the following line:
// REACT_APP_GITHUB_TOKEN=your_token_here
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const COMMITS_PER_PAGE = 10;

const categoryStyles = {
  Frontend: 'bg-blue-100 text-blue-800',
  Backend: 'bg-green-100 text-green-800',
  'Mobile App': 'bg-purple-100 text-purple-800',
  Other: 'bg-gray-100 text-gray-800',
};

const getCategories = (files) => {
  const changedCategories = new Set();
  if (!files || files.length === 0) {
    changedCategories.add('Other');
    return Array.from(changedCategories);
  }

  files.forEach(file => {
    if (file.filename.startsWith('frontend/')) {
      changedCategories.add('Frontend');
    } else if (file.filename.startsWith('backend/')) {
      changedCategories.add('Backend');
    } else if (file.filename.startsWith('mobileapp/')) {
      changedCategories.add('Mobile App');
    } else {
      changedCategories.add('Other');
    }
  });

  if (changedCategories.size === 0) {
    changedCategories.add('Other');
  }

  return Array.from(changedCategories);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const CommitEntry = ({ commitData, index }) => {
  const categories = getCategories(commitData.files);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <span key={category} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryStyles[category]}`}>
              {category}
            </span>
          ))}
        </div>
        <p className="text-xl font-bold text-gray-800 mb-3">{commitData.commit.message}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <img
              src={commitData.author?.avatar_url || 'https://github.com/identicons/default.png'}
              alt={commitData.commit.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{commitData.commit.author.name}</span>
          </div>
          <span className="font-semibold text-gray-700">{formatDate(commitData.commit.author.date)}</span>
        </div>
        <a
          href={commitData.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline mt-4 inline-flex items-center gap-2 text-sm font-medium"
        >
          View on GitHub <FaExternalLinkAlt />
        </a>
      </div>
    </motion.div>
  );
};

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${currentPage === page ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    {page}
                </button>
            ))}
        </div>
    );
}

const PatchNotes = () => {
  const [allCommits, setAllCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
        const fetchCommits = async () => {
      try {
                const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/commits?per_page=100`, {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`
          }
        });
        if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);
        const commitList = await response.json();

        const detailedCommits = await Promise.all(
          commitList.map(async (commit) => {
            try {
                            const commitDetails = await fetch(commit.url, {
                headers: {
                  'Authorization': `Bearer ${GITHUB_TOKEN}`
                }
              });
              if (!commitDetails.ok) return { ...commit, files: [] };
              return await commitDetails.json();
            } catch (e) {
              return { ...commit, files: [] };
            }
          })
        );

        setAllCommits(detailedCommits);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, []);

  const filteredCommits = allCommits.filter(commit => {
    const categoryMatch = categoryFilter === 'All' || getCategories(commit.files).includes(categoryFilter);
    const dateMatch = !dateFilter || commit.commit.author.date.startsWith(dateFilter);
    return categoryMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredCommits.length / COMMITS_PER_PAGE);
  const currentCommits = filteredCommits.slice((currentPage - 1) * COMMITS_PER_PAGE, currentPage * COMMITS_PER_PAGE);

  const handleFilterChange = () => {
      setCurrentPage(1);
  }

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

      <div className="bg-gray-50 p-4 rounded-lg mb-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {['All', 'Frontend', 'Backend', 'Mobile App', 'Other'].map(category => (
              <button
                key={category}
                onClick={() => { setCategoryFilter(category); handleFilterChange(); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${categoryFilter === category ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {category}
              </button>
            ))}
          </div>
          <div className="relative">
            <input 
                type="date" 
                onChange={(e) => { setDateFilter(e.target.value); handleFilterChange(); }}
                className="bg-white border border-gray-300 text-gray-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
      </div>

      {loading && (
        <div className="space-y-8">
          {[...Array(5)].map((_, i) => <PatchNotesSkeleton key={i} />)}
        </div>
      )}
      {error && <div className="text-center text-red-500">Failed to load commits: {error}</div>}

      {!loading && !error && (
        <>
          <div className="space-y-8">
            {currentCommits.length > 0 ? (
              currentCommits.map((commitData, index) => (
                <CommitEntry key={commitData.sha} commitData={commitData} index={index} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                <p className="text-lg">No commits found for the selected filters.</p>
              </div>
            )}
          </div>
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
        </>
      )}
    </motion.div>
  );
};

export default PatchNotes;
