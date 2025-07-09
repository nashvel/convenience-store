import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaStar, FaTrophy, FaMotorcycle, FaShieldAlt, FaRocket, FaCrown, FaCog, FaBell, FaQuestionCircle, FaChevronRight } from 'react-icons/fa';
import ProfileSkeleton from '../skeletons/ProfileSkeleton';

const Profile = () => {
  const { user, loading } = useAuth();

  // Placeholder data for stats not yet available in the user object
  const riderStats = {
    rating: 4.9,
    trips: 258,
    vehicle: 'Honda Click 125i',
    plate: 'ABC 1234',
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  const achievements = [
    { icon: <FaRocket className="text-orange-500" />, title: 'Speedy Starter', description: 'Completed 10 orders in your first week.' },
    { icon: <FaTrophy className="text-yellow-500" />, title: 'Trip Master', description: 'Completed 250 successful trips.' },
    { icon: <FaShieldAlt className="text-green-500" />, title: 'Safety First', description: 'Maintained a 5-star rating for 30 consecutive days.' },
    { icon: <FaCrown className="text-purple-500" />, title: 'Platform Royalty', description: 'Top 1% of riders this month.' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          {user.avatar_url ? (
            <img 
              className="h-24 w-24 rounded-full object-cover border-4 border-blue-200"
              src={user.avatar_url}
              alt="Rider profile"
            />
          ) : (
            <div className="h-24 w-24 rounded-full border-4 border-blue-200 bg-blue-500 text-white flex items-center justify-center">
              <span className="text-4xl font-bold">
                {`${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`}
              </span>
            </div>
          )}
          <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full border-2 border-white">Online</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{`${user.first_name} ${user.last_name}`}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Joined on {new Date(user.created_at).toLocaleDateString()}</p>
          <Link to="/rider/account-information" className="mt-2 inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6 mb-8 text-center">
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300">
          <FaStar className="mx-auto text-yellow-500 mb-1 md:mb-2" size={20} />
          <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{riderStats.rating}</p>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Rider Rating</p>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300">
          <FaTrophy className="mx-auto text-blue-500 mb-1 md:mb-2" size={20} />
          <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{riderStats.trips}</p>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Completed Trips</p>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300">
          <FaMotorcycle className="mx-auto text-gray-600 mb-1 md:mb-2" size={20} />
          <p className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100">{riderStats.vehicle}</p>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{riderStats.plate}</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Achievements</h3>
          <Link to="/rider/achievements" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-4 cursor-pointer">
              <div className="p-3 bg-blue-100 dark:bg-gray-700 rounded-full">
                {React.cloneElement(ach.icon, { size: 24 })}
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{ach.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Settings</h3>
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-4 rounded-lg border border-gray-200 shadow-sm mt-6">
          <ul className="space-y-1">
            <li>
              <Link to="/rider/account-information" className="flex items-center justify-between p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <FaCog className="text-gray-400 dark:text-gray-500" />
                  <span className="font-medium">Account Information</span>
                </div>
                <FaChevronRight className="text-gray-400 dark:text-gray-500" />
              </Link>
            </li>
            <li>
              <Link to="/rider/notification-preferences" className="flex items-center justify-between p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <FaBell className="text-gray-400 dark:text-gray-500" />
                  <span className="font-medium">Notification Preferences</span>
                </div>
                <FaChevronRight className="text-gray-400 dark:text-gray-500" />
              </Link>
            </li>
            <li>
              <Link to="/rider/help-and-support" className="flex items-center justify-between p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <FaQuestionCircle className="text-gray-400 dark:text-gray-500" />
                  <span className="font-medium">Help & Support</span>
                </div>
                <FaChevronRight className="text-gray-400 dark:text-gray-500" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
