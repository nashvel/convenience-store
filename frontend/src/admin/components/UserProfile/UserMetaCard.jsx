import React, { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import EditUserProfileModal from './EditUserProfileModal';

export default function UserMetaCard({ user, onSaveSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-2xl font-bold text-white">
                  {user?.first_name && user.last_name
                    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
                    : 'AD'}
                </div>
              )}
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?.first_name} {user?.last_name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                {user?.bio && (
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.bio}</p>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
                  </>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.address?.city ? user.address.city : 'Location N/A'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-600/50"
            disabled={!user}
          >
            <FiEdit />
            Edit
          </button>
        </div>
      </div>
      {isModalOpen && <EditUserProfileModal user={user} closeModal={closeModal} onSaveSuccess={onSaveSuccess} />}
    </>
  );
}
