import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/axios-config';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/settings', { skipAuthRefresh: true });
            setSettings(response.data.settings || response.data || {});
        } catch (error) {
            console.error('Failed to fetch site settings:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const value = {
        settings,
        loading,
        refreshSettings: fetchSettings
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
