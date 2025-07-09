import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios-config';
import { FaArrowLeft, FaStar, FaTrophy, FaShieldAlt, FaRocket, FaCrown, FaClock, FaCalendarCheck } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import AchievementSkeleton from '../skeletons/AchievementSkeleton';

const iconMap = {
  FaRocket,
  FaTrophy,
  FaShieldAlt,
  FaCrown,
  FaStar,
  FaClock,
  FaCalendarCheck,
};

const AchievementCard = ({ icon, title, description, status, progress }) => {
  const Icon = iconMap[icon] || FaStar; // Fallback icon

  const isLocked = status === 'locked';
  const cardClasses = `
    bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 
    ${isLocked ? 'grayscale filter' : 'hover:shadow-lg hover:border-blue-400'}
  `;

  return (
    <div className={cardClasses}>
      <div className="flex items-center space-x-4">
        <div className={`p-4 rounded-full ${isLocked ? 'bg-gray-200' : 'bg-blue-100'}`}>
          <Icon className={`${isLocked ? 'text-gray-400' : 'text-blue-500'}`} size={28} />
        </div>
        <div>
          <h3 className={`font-bold text-lg ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>{title}</h3>
          <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
        </div>
      </div>
      {status !== 'locked' && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">{progress}% Complete</p>
        </div>
      )}
    </div>
  );
};

const Achievements = () => {
  const [filter, setFilter] = useState('all');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
                const response = await api.get('/achievements');
        setAchievements(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load achievements. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

        if (user) {
      fetchAchievements();
    }
    }, [user]);

  const filteredAchievements = achievements.filter(ach => {
    if (filter === 'all') return true;
    return ach.status === filter;
  });

  const getButtonClasses = (type) => 
    `px-4 py-2 rounded-md font-semibold text-sm transition-colors ${filter === type ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Go back"
        >
          <FaArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Achievements</h1>
          <p className="text-gray-600 mt-1">Track your progress and unlock new milestones.</p>
        </div>
      </div>

      <div className="mb-6 flex space-x-2 p-1 bg-white rounded-lg border shadow-sm w-min">
        <button onClick={() => setFilter('all')} className={getButtonClasses('all')}>All</button>
        <button onClick={() => setFilter('unlocked')} className={getButtonClasses('unlocked')}>Unlocked</button>
        <button onClick={() => setFilter('in-progress')} className={getButtonClasses('in-progress')}>In Progress</button>
        <button onClick={() => setFilter('locked')} className={getButtonClasses('locked')}>Locked</button>
      </div>

      {loading ? (
        <AchievementSkeleton />
      ) : error ? (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(ach => <AchievementCard key={ach.id} {...ach} />)}
        </div>
      )}
    </div>
  );
};

export default Achievements;
