import React, { useState } from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon, PencilIcon, TrashIcon, XIcon } from '@heroicons/react/outline';

const initialZones = [
  {
    id: 1,
    name: 'Domestic Standard',
    countries: ['United States'],
    rates: [
      { condition: 'Order price from $0 to $49.99', price: 5.99 },
      { condition: 'Order price from $50 and up', price: 0 },
    ],
  },
  {
    id: 2,
    name: 'International',
    countries: ['Canada', 'Mexico', 'United Kingdom'],
    rates: [
      { condition: 'Order weight from 0kg to 2kg', price: 15.00 },
      { condition: 'Order weight from 2.01kg and up', price: 25.00 },
    ],
  },
];

const DeliveryRates = () => {
  const [zones, setZones] = useState(initialZones);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  const openModal = (zone = null) => {
    setEditingZone(zone);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingZone(null);
    setIsModalOpen(false);
  };

  const handleSave = (zoneData) => {
    if (editingZone) {
      setZones(zones.map(z => z.id === editingZone.id ? { ...z, ...zoneData } : z));
    } else {
      setZones([...zones, { ...zoneData, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = (zoneId) => {
    setZones(zones.filter(z => z.id !== zoneId));
  };

  return (
    <>
      <PageMeta
        title="Delivery Rates | Admin Dashboard"
        description="Manage delivery zones and shipping rates"
      />
      <PageBreadcrumb pageTitle="Delivery Rates" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Shipping Zones
          </h3>
          <button onClick={() => openModal()} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <PlusIcon className="h-5 w-5" />
            <span>Add New Zone</span>
          </button>
        </div>

        <div className="space-y-4">
          {zones.map(zone => (
            <div key={zone.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{zone.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {zone.countries.map(country => (
                      <span key={country} className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-300">{country}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openModal(zone)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(zone.id)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Rates</h5>
                <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  {zone.rates.map((rate, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{rate.condition}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">${rate.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && <ZoneModal zone={editingZone} onSave={handleSave} onClose={closeModal} />}
    </>
  );
};

const ZoneModal = ({ zone, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    zone || {
      name: '',
      countries: [],
      rates: [{ condition: '', price: '' }],
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRateChange = (index, field, value) => {
    const newRates = [...formData.rates];
    newRates[index][field] = value;
    setFormData({ ...formData, rates: newRates });
  };

  const addRate = () => {
    setFormData({ ...formData, rates: [...formData.rates, { condition: '', price: '' }] });
  };

  const removeRate = (index) => {
    const newRates = formData.rates.filter((_, i) => i !== index);
    setFormData({ ...formData, rates: newRates });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{zone ? 'Edit' : 'Add'} Shipping Zone</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Zone Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full form-input" required />
          </div>
          <div>
            <label htmlFor="countries" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Countries (comma-separated)</label>
            <input type="text" name="countries" id="countries" value={Array.isArray(formData.countries) ? formData.countries.join(', ') : ''} onChange={(e) => setFormData({...formData, countries: e.target.value.split(',').map(c => c.trim())})} className="mt-1 w-full form-input" required />
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Rates</h4>
            <div className="space-y-2">
              {formData.rates.map((rate, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-700">
                  <input type="text" placeholder="Condition (e.g., Order price > $50)" value={rate.condition} onChange={(e) => handleRateChange(index, 'condition', e.target.value)} className="w-2/3 form-input" />
                  <input type="number" placeholder="Price" value={rate.price} onChange={(e) => handleRateChange(index, 'price', parseFloat(e.target.value))} className="w-1/3 form-input" step="0.01" />
                  <button type="button" onClick={() => removeRate(index)} className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addRate} className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">+ Add Rate</button>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Save Zone</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryRates;
