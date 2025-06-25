import React from 'react';
import PageMeta from "../../components/common/PageMeta";
import Card from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

const Branding = () => {
  return (
    <>
      <PageMeta title="Branding" description="Manage site branding and visual identity" />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Branding Management</h1>
        
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Logo Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Logo</label>
                <Input type="file" accept="image/*" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Favicon</label>
                <Input type="file" accept="image/*" className="w-full" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Color Scheme</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <Input type="color" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Secondary Color</label>
                <Input type="color" className="w-full" />
              </div>
              <Button className="mt-4">Save Branding</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Branding;
