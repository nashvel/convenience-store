import React, { useState } from 'react';
import { FaSave, FaStore, FaClock, FaPhone, FaCreditCard } from 'react-icons/fa';

const ManageStore = () => {
  const [storeName, setStoreName] = useState('My Awesome Store');
  const [logo, setLogo] = useState('https://via.placeholder.com/150');
  const [openingTime, setOpeningTime] = useState('09:00');
  const [closingTime, setClosingTime] = useState('21:00');
  const [contactNumber, setContactNumber] = useState('123-456-7890');
  const [paymentMethods, setPaymentMethods] = useState('Credit Card, PayPal, Crypto');

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = () => {
    // In a real app, this would save to a backend.
    alert('Store settings saved!');
  };

  const Card = ({ children }) => (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
      {children}
    </div>
  );

  const CardHeader = ({ icon, title }) => (
    <div className="flex items-center gap-4 text-xl font-bold text-gray-700">
      {icon} {title}
    </div>
  );

  const FormGroup = ({ label, children }) => (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  );

  const Input = (props) => (
    <input {...props} className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-colors" />
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Store</h1>
        <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
          <FaSave />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <Card>
          <CardHeader icon={<FaStore />} title="Store Details" />
          <FormGroup label="Store Name">
            <Input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </FormGroup>
          <FormGroup label="Store Logo">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Store Logo" className="w-20 h-20 rounded-full object-cover border-4 border-gray-100" />
              <label htmlFor="logo-upload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors">
                Change Logo
              </label>
              <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </div>
          </FormGroup>
        </Card>

        <Card>
          <CardHeader icon={<FaClock />} title="Operating Hours" />
          <FormGroup label="Opening & Closing Time">
            <div className="flex gap-4">
              <Input type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
              <Input type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
            </div>
          </FormGroup>
        </Card>

        <Card>
          <CardHeader icon={<FaPhone />} title="Contact & Payment" />
          <FormGroup label="Contact Number">
            <Input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
          </FormGroup>
          <FormGroup label="Payment Methods">
            <Input type="text" value={paymentMethods} onChange={(e) => setPaymentMethods(e.target.value)} placeholder="e.g., Visa, Mastercard, PayPal" />
          </FormGroup>
        </Card>
      </div>
    </div>
  );
};

export default ManageStore;
