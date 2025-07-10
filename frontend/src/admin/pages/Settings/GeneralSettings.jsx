import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
    SettingsIcon,
    CheckCircleIcon,
    CloseIcon,
    AlertIcon,
    ArrowUpIcon,
    FacebookIcon,
    InstagramIcon,
    XIcon,
    BoxCubeIcon,
    ChatIcon,
    TrashBinIcon,
    DollarLineIcon,
    AngleRightIcon,
} from '../../icons';
import { Link } from 'react-router-dom';

// Card for general settings
const SettingsCard = ({ onManage }) => (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <SettingsIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
                <h3 className="font-bold text-gray-800 dark:text-white">General</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">View and update your store details</p>
            </div>
        </div>
        <button onClick={onManage} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Manage
        </button>
    </div>
);

// Card for linking to other settings pages
const SettingsLinkCard = ({ icon, name, description, to }) => (
    <Link to={to} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
        <div className="flex items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-800 dark:text-white">{name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </div>
        <AngleRightIcon className="h-5 w-5 text-gray-400" />
    </Link>
);

// Card for social media integrations
const IntegrationCard = ({ icon, name, description, isConnected, onManage, url }) => (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between">
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        {React.cloneElement(icon, { className: "h-6 w-6" })}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">{name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                    </div>
                </div>
            </div>
            {isConnected && url && (
                <div className="mt-2 mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Connected to: <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline truncate block" title={url}>{url}</a>
                    </p>
                </div>
            )}
        </div>
        <button onClick={onManage} className="w-full font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-left mt-auto">
            {isConnected ? 'Manage' : 'Connect'}
        </button>
    </div>
);

const SocialLinkModal = ({ isOpen, onClose, onSave, social, setSocial, isSaving }) => {
    if (!isOpen || !social) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center animate-fade-in p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Connect {social.name}</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <CloseIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enter the full URL for your {social.name} profile.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sr-only">
                            {social.name} URL
                        </label>
                        <input
                            type="url"
                            value={social.url}
                            onChange={(e) => setSocial(prev => ({ ...prev, url: e.target.value }))}
                            className="w-full rounded-md border border-gray-300 bg-white py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder={`https://www.${social.name.toLowerCase().split(' ')[0]}.com/yourprofile`}
                            autoFocus
                        />
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-4">
                    <button onClick={onClose} disabled={isSaving} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onSave} disabled={isSaving} className="flex items-center justify-center gap-2 w-28 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors">
                        {isSaving ? <ArrowUpIcon className="h-5 w-5 animate-spin" /> : <CheckCircleIcon className="h-5 w-5" />}
                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const GeneralSettings = () => {
  const [settings, setSettings] = useState({});
  const [initialSettings, setInitialSettings] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);

  const fetchSettings = useCallback(async () => {
    if (!user?.token) {
      setError('Authentication token not found. Please log in again.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/settings', { headers: { 'Authorization': `Bearer ${user.token}` } });
      if (!response.ok) throw new Error(`Failed to fetch settings. Status: ${response.status}`);
      const settingsData = await response.json();
      setSettings(settingsData);
      setInitialSettings(settingsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? (checked ? '1' : '0') : value;
    setSettings(prev => ({ ...prev, [name]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess('');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ settings }),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      setSuccess('Settings saved successfully!');
      await fetchSettings();
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManageSocial = (socialKey, socialName) => {
    setEditingSocial({
        key: socialKey,
        name: socialName,
        url: settings[socialKey] || '',
    });
    setIsModalOpen(true);
  };

  const handleSocialSave = async () => {
    if (!editingSocial) return;

    setIsSaving(true);
    setError(null);
    setSuccess('');

    const { key, url } = editingSocial;
    const updatedSetting = { [key]: url };

    try {
        const response = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
            body: JSON.stringify({ settings: updatedSetting }),
        });
        if (!response.ok) throw new Error(`Failed to update ${editingSocial.name} link`);
        
        setSuccess(`${editingSocial.name} link updated successfully!`);
        await fetchSettings();
        setIsModalOpen(false);
        setEditingSocial(null);
        setTimeout(() => setSuccess(''), 4000);

    } catch (err) {
        setError(err.message);
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSettings(initialSettings);
    setIsEditing(false);
    setError(null);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><ArrowUpIcon className="animate-spin h-8 w-8 text-indigo-500" /></div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/95 rounded-2xl transition-all duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Store Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">View and update your store details</p>
      </div>

      {success && <div className="flex items-center justify-between gap-2 mb-4 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 p-3 rounded-lg animate-fade-in"><div className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5"/> {success}</div><button onClick={() => setSuccess('')} className="p-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800"><CloseIcon className="h-4 w-4" /></button></div>}
      {error && <div className="flex items-center justify-between gap-2 mb-4 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg animate-fade-in"><div className="flex items-center gap-2"><AlertIcon className="h-5 w-5"/> {error}</div><button onClick={() => setError(null)} className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-800"><CloseIcon className="h-4 w-4" /></button></div>}

      {!isEditing ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Settings</h2>
            <SettingsCard onManage={() => setIsEditing(true)} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Settings Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingsLinkCard 
                icon={<BoxCubeIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />} 
                name="API & Logging" 
                description="Configure API settings and view logs" 
                to="/admin/settings-api" 
              />
              <SettingsLinkCard 
                icon={<ChatIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />} 
                name="Review Management" 
                description="Manage customer reviews and ratings" 
                to="/admin/settings-reviews" 
              />
              <SettingsLinkCard 
                icon={<TrashBinIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />} 
                name="Blacklist" 
                description="Manage blocked users and content" 
                to="/admin/settings-blacklist" 
              />
              <SettingsLinkCard 
                icon={<DollarLineIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />} 
                name="Delivery Rates" 
                description="Set and manage delivery fees" 
                to="/admin/settings-delivery-rates" 
              />
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="animate-fade-in">
          <fieldset disabled={isSaving} className="group">
              <div className="space-y-8">
                  {/* Section 1: General Information */}
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">General Information</h3>
                      <div className="space-y-6">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Banner Text</label>
                              <textarea name="main_banner_text" value={settings.main_banner_text || ''} onChange={handleInputChange} rows="2" className="w-full rounded-md border border-gray-300 bg-white py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"></textarea>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Restaurant Banner Text</label>
                              <textarea name="restaurant_banner_text" value={settings.restaurant_banner_text || ''} onChange={handleInputChange} rows="2" className="w-full rounded-md border border-gray-300 bg-white py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"></textarea>
                          </div>
                      </div>
                  </div>

                  {/* Section 2: Advanced Settings */}
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Advanced Settings</h3>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Logging</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" name="api_logging" checked={parseInt(settings.api_logging) === 1} onChange={handleInputChange} className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-indigo-600"></div>
                              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{parseInt(settings.api_logging) === 1 ? 'Enabled' : 'Disabled'}</span>
                          </label>
                      </div>
                  </div>
              </div>
          </fieldset>
          <div className="mt-8 flex items-center gap-4">
              <button type="submit" disabled={isSaving} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors">
                  {isSaving ? <ArrowUpIcon className="h-5 w-5 animate-spin" /> : <CheckCircleIcon className="h-5 w-5" />}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button type="button" onClick={handleCancel} disabled={isSaving} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50">
                  <CloseIcon className="h-5 w-5" />
                  <span>Cancel</span>
              </button>
          </div>
      </form>
      )}

      <SocialLinkModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSocialSave}
        social={editingSocial}
        setSocial={setEditingSocial}
        isSaving={isSaving}
      />
    </div>
  );
};

export default GeneralSettings;
