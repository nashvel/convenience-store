import React from 'react';
import { FaStar, FaTrophy, FaMotorcycle, FaShieldAlt, FaRocket, FaCrown } from 'react-icons/fa';

const Profile = () => {
  const rider = {
    name: 'John Doe',
    joinDate: '2023-01-15',
    rating: 4.9,
    trips: 258,
    vehicle: 'Honda Click 125i',
    plate: 'ABC 1234',
  };

  const achievements = [
    { icon: <FaRocket className="text-orange-500" />, title: 'Speedy Starter', description: 'Completed 10 orders in your first week.' },
    { icon: <FaTrophy className="text-yellow-500" />, title: 'Trip Master', description: 'Completed 250 successful trips.' },
    { icon: <FaShieldAlt className="text-green-500" />, title: 'Safety First', description: 'Maintained a 5-star rating for 30 consecutive days.' },
    { icon: <FaCrown className="text-purple-500" />, title: 'Platform Royalty', description: 'Top 1% of riders this month.' },
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <img 
            className="h-24 w-24 rounded-full object-cover border-4 border-blue-200"
            src={`https://i.pravatar.cc/150?u=${rider.name}`}
            alt="Rider profile"
          />
          <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full border-2 border-white">Online</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{rider.name}</h2>
          <p className="text-sm text-gray-500">Joined on {rider.joinDate}</p>
          <button className="mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <FaStar className="mx-auto text-yellow-500 mb-2" size={24} />
          <p className="text-2xl font-bold text-gray-800">{rider.rating}</p>
          <p className="text-sm text-gray-500">Rider Rating</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <FaTrophy className="mx-auto text-blue-500 mb-2" size={24} />
          <p className="text-2xl font-bold text-gray-800">{rider.trips}</p>
          <p className="text-sm text-gray-500">Completed Trips</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <FaMotorcycle className="mx-auto text-gray-600 mb-2" size={24} />
          <p className="text-lg font-semibold text-gray-800">{rider.vehicle}</p>
          <p className="text-sm text-gray-500">{rider.plate}</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                {React.cloneElement(ach.icon, { size: 24 })}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{ach.title}</p>
                <p className="text-xs text-gray-500">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Settings</h3>
        <div className="space-y-2 flex flex-col items-start">
          <button className="text-blue-600 hover:underline text-left">Account Information</button>
          <button className="text-blue-600 hover:underline text-left">Notification Preferences</button>
          <button className="text-blue-600 hover:underline text-left">Help & Support</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
