import React, { useState, useEffect, useCallback } from 'react';
import { FaPencilAlt, FaFacebook, FaInstagram, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { useSettings } from '../../../context/SettingsContext';
import api from '../../../api/axios-config';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';

const AppHome = () => {
  const [modalContent, setModalContent] = useState(null);
  const { settings: globalSettings, refreshSettings } = useSettings();
  const [editableSettings, setEditableSettings] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (globalSettings) {
      setEditableSettings(globalSettings);
    }
  }, [globalSettings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        // Reverting to the original, correct endpoint and data structure for saving settings.
        await api.post('/admin/settings', { settings: editableSettings });
        window.location.reload(); // Refresh the page to ensure all components reflect the changes.
    } catch (err) {
        console.error('Failed to save settings:', err);
    } finally {
        setIsSaving(false);
        setModalContent(null);
    }
};

  const openModal = (content) => setModalContent(content);
  const closeModal = () => {
    setModalContent(null);
    setEditableSettings(globalSettings); // Discard changes
  }

  return (
    <div className="space-y-8">
        <div className='mb-8'>
            <h1 className="text-2xl font-bold text-gray-800">App Home Customization</h1>
            <p className="text-gray-500 mt-1">Preview and edit your application's main navigation and footer.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">Navbar Preview</h3>
                <button onClick={() => openModal('navbar')} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"><FaPencilAlt /></button>
            </div>
            <div className="p-4 bg-gray-50 overflow-hidden">
                <div className="pointer-events-none select-none opacity-90 transform scale-[0.8] origin-top hover:scale-[0.82] transition-transform duration-300"><Navbar /></div>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">Footer Preview</h3>
                <button onClick={() => openModal('footer')} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"><FaPencilAlt /></button>
            </div>
            <div className="p-4 bg-gray-50 overflow-hidden">
                <div className="pointer-events-none select-none opacity-90 transform scale-[0.8] origin-top hover:scale-[0.82] transition-transform duration-300"><Footer /></div>
            </div>
        </div>

      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all duration-300 ease-in-out" onClick={closeModal}>
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 ease-in-out scale-100 opacity-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">{modalContent === 'navbar' ? 'Navbar Settings' : 'Footer Settings'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-800 text-3xl"><FaTimes /></button>
            </div>
            <div className="space-y-6">
              {modalContent === 'navbar' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
                  <input type="text" name="app_name" value={editableSettings.app_name || ''} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              )}
              {modalContent === 'footer' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">App Description</label>
                    <textarea name="app_description" value={editableSettings.app_description || ''} onChange={handleInputChange} rows="3" className="w-full rounded-md border-gray-300 shadow-sm"></textarea>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Social Media Links</h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FaFacebook className="text-blue-600 h-6 w-6" />
                            <input type="text" name="facebook_url" placeholder="Facebook URL" value={editableSettings.facebook_url || ''} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div className="flex items-center gap-3">
                            <FaInstagram className="text-pink-500 h-6 w-6" />
                            <input type="text" name="instagram_url" placeholder="Instagram URL" value={editableSettings.instagram_url || ''} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                         <div className="flex items-center gap-3">
                            <FaTimes className="text-gray-800 h-6 w-6" />
                            <input type="text" name="twitter_url" placeholder="X/Twitter URL" value={editableSettings.twitter_url || ''} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-end gap-4">
                <button onClick={closeModal} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppHome;
