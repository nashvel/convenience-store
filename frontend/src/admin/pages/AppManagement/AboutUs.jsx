import React, { useState } from 'react';
import PageMeta from "../../components/common/PageMeta";
import Card from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

const AboutUs = () => {
  const [aboutContent, setAboutContent] = useState('');

  return (
    <>
      <PageMeta title="About Us" description="Manage about us page content" />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">About Us Management</h1>
        
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">About Us Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input placeholder="Enter title" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  value={aboutContent}
                  onChange={(e) => setAboutContent(e.target.value)}
                  className="w-full p-2 border rounded-md h-48"
                  placeholder="Enter about us content..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mission Statement</label>
                <textarea
                  className="w-full p-2 border rounded-md h-24"
                  placeholder="Enter mission statement..."
                />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Team Members</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input placeholder="Enter name" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <Input placeholder="Enter role" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Profile Photo</label>
                <Input type="file" accept="image/*" className="w-full" />
              </div>
              <Button className="mt-4">Add Team Member</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AboutUs;
