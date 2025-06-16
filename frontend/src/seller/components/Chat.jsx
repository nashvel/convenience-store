import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaSearch, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';

// Mock Data with message IDs
const mockContacts = [
  { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob' },
  { id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie' },
  { id: 4, name: 'David', avatar: 'https://i.pravatar.cc/150?u=david' },
  { id: 5, name: 'Eve', avatar: 'https://i.pravatar.cc/150?u=eve' },
  { id: 6, name: 'Frank', avatar: 'https://i.pravatar.cc/150?u=frank' },
  { id: 7, name: 'Grace', avatar: 'https://i.pravatar.cc/150?u=grace' },
  { id: 8, name: 'Heidi', avatar: 'https://i.pravatar.cc/150?u=heidi' },
];

const mockMessages = {
  1: [
    { id: 1, sender: 'other', text: 'Hey, how are you?' },
    { id: 2, sender: 'me', text: 'I am good, thanks! How about you?' },
    { id: 3, sender: 'other', text: 'Doing great! Did you see the latest sales report?' },
  ],
  2: [{ id: 4, sender: 'other', text: 'Can we reschedule our meeting?' }],
  3: [{ id: 5, sender: 'me', text: 'Project update is on the way.' }],
  4: [], 5: [], 6: [], 7: [], 8: [],
};

// Styled Components
const ChatContainer = styled.div`
  display: flex; height: calc(100vh - 180px); background: ${({ theme }) => theme.body};
  border-radius: 20px; ${({ theme }) => theme.neumorphism(false, '20px')}; overflow: hidden;
`;
const ContactList = styled.div`
  width: 300px; border-right: 2px solid ${({ theme }) => theme.shadows.dark}; display: flex; flex-direction: column;
  background: ${({ theme }) => theme.shadows.light};
`;
const SearchContainer = styled.div` padding: 15px; border-bottom: 2px solid ${({ theme }) => theme.shadows.dark}; `;
const SearchInputWrapper = styled.div`
  display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px;
  ${({ theme }) => theme.neumorphism(true, '10px')};
`;
const SearchInput = styled.input`
  border: none; background: transparent; width: 100%; color: ${({ theme }) => theme.text};
  font-size: 0.9rem; &:focus { outline: none; }
`;
const ContactsWrapper = styled.div` overflow-y: auto; flex-grow: 1; `;
const ConversationView = styled.div` flex-grow: 1; display: flex; flex-direction: column; `;
const ChatHeader = styled.div`
  padding: 15px 20px; border-bottom: 2px solid ${({ theme }) => theme.shadows.dark};
  display: flex; align-items: center; gap: 15px; h3 { margin: 0; color: ${({ theme }) => theme.text}; }
`;
const Avatar = styled.img` width: 40px; height: 40px; border-radius: 50%; `;
const MessageArea = styled.div`
  flex-grow: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${({ sender }) => (sender === 'me' ? 'flex-end' : 'flex-start')};
  align-items: center;
  position: relative;

  &:hover .options-button {
    opacity: 1;
  }
`;

const MessageBubble = styled.div`
  max-width: 100%;
  padding: 10px 15px;
  border-radius: 18px;
  
  ${({ sender, theme }) => 
    sender === 'me' 
    ? `
      background: #3498db;
      color: white;
    ` 
    : `
      color: ${theme.text};
      background: ${theme.body};
      ${theme.neumorphism(false, '18px')}
    `}
`;

const MessageOptionsButton = styled.button`
  opacity: 0;
  transition: opacity 0.2s ease;
  background: transparent; border: none; cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  padding: 5px;
  margin: 0 5px;
  align-self: center;
`;

const MessageDropdownMenu = styled.div`
  ${({ theme }) => theme.neumorphism(false, '8px')}; position: absolute; top: 35px;
  right: ${({ sender }) => (sender === 'me' ? '0' : 'auto')};
  left: ${({ sender }) => (sender === 'me' ? 'auto' : '0')};
  background: ${({ theme }) => theme.body}; border-radius: 8px; z-index: 10; width: 120px; overflow: hidden;
`;

const MessageDropdownItem = styled.button`
  background: transparent; border: none; padding: 10px 15px; width: 100%; text-align: left; cursor: pointer;
  color: ${({ theme, color }) => color || theme.textSecondary}; display: flex; align-items: center; gap: 10px;

  &:hover {
    background: ${({ theme }) => theme.shadows.light};
  }
`;

const MessageInputContainer = styled.div`
  padding: 15px 20px; display: flex; gap: 15px; align-items: center;
  border-top: 2px solid ${({ theme }) => theme.shadows.dark};
`;

const MessageInput = styled.input`
  flex-grow: 1; border: none; padding: 15px; border-radius: 15px;
  background: ${({ theme }) => theme.body}; color: ${({ theme }) => theme.text};
  ${({ theme }) => theme.neumorphism(true, '15px')};
  &:focus { outline: none; }
`;

const SendButton = styled.button`
  border: none; width: 50px; height: 50px; border-radius: 50%;
  color: white;
  background: #3498db;
  cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
  ${({ theme }) => theme.neumorphism(false, '50%')};
  transition: all 0.2s ease-in-out;

  &:hover { background: #2980b9; }
  &:active { ${({ theme }) => theme.neumorphismPressed('50%')}; }
`;

const ContactItem = styled.div`
  padding: 15px 20px; display: flex; align-items: center; gap: 15px; cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.shadows.dark};
  background: ${({ active, theme }) => (active ? theme.shadows.dark : 'transparent')};
  &:hover { background: ${({ theme }) => theme.shadows.light}; }
`;

const EditMessageForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`;

const EditInput = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const EditActions = styled.div`
  display: flex;
  gap: 5px;
  justify-content: flex-end;

  button {
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;

    &:first-child {
      background-color: #3498db;
      color: white;
    }

    &:last-child {
      background-color: #e0e0e0;
    }
  }
`;

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(mockContacts[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openMessageMenuId, setOpenMessageMenuId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState('');

  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);

  const handleSend = () => {
    if (newMessage.trim() === '' || !selectedContact) return;
    const newMsg = { id: Date.now(), sender: 'me', text: newMessage };
    const contactId = selectedContact.id;
    const newMessages = { ...messages, [contactId]: [...(messages[contactId] || []), newMsg] };
    setMessages(newMessages);
    setNewMessage('');
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditingMessageText(message.text);
    setOpenMessageMenuId(null);
  };

  const handleSaveEdit = (contactId, messageId) => {
    const newMessages = { ...messages };
    const messageIndex = newMessages[contactId].findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      newMessages[contactId][messageIndex].text = editingMessageText;
      setMessages(newMessages);
    }
    setEditingMessageId(null);
    setEditingMessageText('');
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingMessageText('');
  };

  const handleDeleteMessage = (contactId, messageId) => {
    const newMessages = { ...messages };
    newMessages[contactId] = newMessages[contactId].filter(m => m.id !== messageId);
    setMessages(newMessages);
    setOpenMessageMenuId(null);
  };

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ChatContainer>
      <ContactList>
        <SearchContainer>
          <SearchInputWrapper>
            <FaSearch style={{ color: '#888' }} />
            <SearchInput type="text" placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </SearchInputWrapper>
        </SearchContainer>
        <ContactsWrapper>
          {filteredContacts.map(contact => (
            <ContactItem key={contact.id} onClick={() => setSelectedContact(contact)} active={selectedContact.id === contact.id}>
              <Avatar src={contact.avatar} alt={contact.name} />
              <span>{contact.name}</span>
            </ContactItem>
          ))}
        </ContactsWrapper>
      </ContactList>
      <ConversationView>
        {selectedContact ? (
          <>
            <ChatHeader>
              <Avatar src={selectedContact.avatar} alt={selectedContact.name} />
              <h3>{selectedContact.name}</h3>
            </ChatHeader>
            <MessageArea>
              {(messages[selectedContact.id] || []).map(msg => (
                <MessageWrapper key={msg.id} sender={msg.sender}>
                  {msg.sender === 'me' && (
                    <MessageOptionsButton className="options-button" onClick={() => setOpenMessageMenuId(openMessageMenuId === msg.id ? null : msg.id)}>
                      <FaEllipsisV />
                    </MessageOptionsButton>
                  )}
                                    {editingMessageId === msg.id ? (
                    <EditMessageForm onSubmit={(e) => { e.preventDefault(); handleSaveEdit(selectedContact.id, msg.id); }}>
                      <EditInput type="text" value={editingMessageText} onChange={(e) => setEditingMessageText(e.target.value)} autoFocus />
                      <EditActions>
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleCancelEdit}>Cancel</button>
                      </EditActions>
                    </EditMessageForm>
                  ) : (
                    <MessageBubble sender={msg.sender}>{msg.text}</MessageBubble>
                  )}
                  {openMessageMenuId === msg.id && (
                    <MessageDropdownMenu sender={msg.sender}>
                                            <MessageDropdownItem onClick={() => handleEditMessage(msg)}><FaEdit /> Edit</MessageDropdownItem>
                      <MessageDropdownItem color="#FF5722" onClick={() => handleDeleteMessage(selectedContact.id, msg.id)}><FaTrash /> Delete</MessageDropdownItem>
                    </MessageDropdownMenu>
                  )}
                </MessageWrapper>
              ))}
              <div ref={messageEndRef} />
            </MessageArea>
            <MessageInputContainer>
              <MessageInput type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
              <SendButton onClick={handleSend}><FaPaperPlane /></SendButton>
            </MessageInputContainer>
          </>
        ) : (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>Select a conversation</div>
        )}
      </ConversationView>
    </ChatContainer>
  );
};

export default Chat;
