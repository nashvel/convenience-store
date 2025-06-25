import React from 'react';
import PageMeta from "../../components/common/PageMeta";
import Card from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

const SiteContent = () => {
  return (
    <>
      <PageMeta title="Site Content" description="Manage site content and links" />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Site Content Management</h1>
        
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Navigation Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Home Link</label>
                <Input placeholder="/" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">About Link</label>
                <Input placeholder="/about" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Link</label>
                <Input placeholder="/contact" className="w-full" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Footer Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Input placeholder="Enter address" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input placeholder="info@example.com" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input placeholder="+1234567890" className="w-full" />
              </div>
              <Button className="mt-4">Save Changes</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default SiteContent;
