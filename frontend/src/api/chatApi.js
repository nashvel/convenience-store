import axios from './axios-config';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const findOrCreateChat = async (recipientId) => {
  try {
    const response = await axios.post(`${API_URL}/api/chats/find-or-create`, { recipientId });
    return response.data;
  } catch (error) {
    console.error('Error finding or creating chat:', error);
    throw error;
  }
};

export const getChats = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/chats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

export const getMessages = async (chatId) => {
  try {
    const response = await axios.get(`${API_URL}/api/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (chatId, messageData) => {
  try {
    const response = await axios.post(`${API_URL}/api/chats/${chatId}/messages`, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
