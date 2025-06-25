import React from 'react';
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Card from "../components/common/ComponentCard";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";

const UserRoles = () => {
  const roles = [
    { id: 1, name: 'Admin', description: 'Full access to all features and settings', permissions: ['all'] },
    { id: 2, name: 'Manager', description: 'Manage store operations and staff', permissions: ['store', 'staff'] },
    { id: 3, name: 'Staff', description: 'Basic store operations', permissions: ['store'] },
    { id: 4, name: 'Customer', description: 'Basic customer access', permissions: ['profile'] },
  ];

  return (
    <>
      <PageMeta title="User Roles" description="Manage user roles and permissions" />
      <PageBreadcrumb pageTitle="User Roles" />
      
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">User Roles Management</h1>
        
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Role</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Role Name</label>
                <Input type="text" placeholder="Enter role name" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter role description"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="all" />
                    <label htmlFor="all">All Permissions</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="store" />
                    <label htmlFor="store">Store Management</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="staff" />
                    <label htmlFor="staff">Staff Management</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="profile" />
                    <label htmlFor="profile">Profile Management</label>
                  </div>
                </div>
              </div>
              <Button type="submit" className="mt-4">Create Role</Button>
            </form>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Existing Roles</h2>
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{role.name}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline">Edit</Button>
                      <Button variant="destructive">Delete</Button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {role.permissions.map((perm) => (
                      <span key={perm} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default UserRoles;
