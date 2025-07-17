import React from 'react';
import UserManagementQuickLinks from "../components/UserManagement/QuickLinks";

const UserRoles = () => {
  const roles = [
    { id: 1, name: 'Admin', description: 'Full access to all features and settings.', permissions: ['all permissions'] },
    { id: 2, name: 'Manager', description: 'Can manage store operations and staff members.', permissions: ['store management', 'staff management'] },
    { id: 3, name: 'Staff', description: 'Can perform basic store operations.', permissions: ['view orders', 'update inventory'] },
    { id: 4, name: 'Customer', description: 'Has basic access to browse and purchase.', permissions: ['view profile', 'place orders'] },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <UserManagementQuickLinks />
      
      <div className="pt-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Roles</h1>
            <p className="mt-2 md:mt-0 text-lg text-gray-600 dark:text-gray-400">Manage permissions and access levels for all users.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create New Role Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create New Role</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role Name</label>
                  <input type="text" id="roleName" placeholder="e.g., Content Moderator" className="w-full pl-4 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow" />
                </div>
                <div>
                  <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea id="roleDescription" rows={3} placeholder="Briefly describe the role's purpose" className="w-full pl-4 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Permissions</label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input id="perm-all" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <label htmlFor="perm-all" className="ml-3 block text-sm text-gray-900 dark:text-gray-200">Full System Access</label>
                    </div>
                    <div className="flex items-center">
                      <input id="perm-users" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <label htmlFor="perm-users" className="ml-3 block text-sm text-gray-900 dark:text-gray-200">User Management</label>
                    </div>
                    <div className="flex items-center">
                      <input id="perm-products" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <label htmlFor="perm-products" className="ml-3 block text-sm text-gray-900 dark:text-gray-200">Product Management</label>
                    </div>
                    <div className="flex items-center">
                      <input id="perm-orders" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <label htmlFor="perm-orders" className="ml-3 block text-sm text-gray-900 dark:text-gray-200">Order Management</label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-300">Create Role</button>
              </form>
            </div>
          </div>

          {/* Existing Roles List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Existing Roles</h2>
              <div className="space-y-5">
                {roles.map((role) => (
                  <div key={role.id} className="border-b border-gray-200 dark:border-gray-700 pb-5 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{role.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{role.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {role.permissions.map((perm) => (
                            <span key={perm} className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 rounded-full">
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Edit</button>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 border border-transparent rounded-lg transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoles;
