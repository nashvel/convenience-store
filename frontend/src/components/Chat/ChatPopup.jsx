import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaMinus, FaPaperPlane, FaImage, FaVideo, FaSpinner, FaTrash } from 'react-icons/fa';
import { HiTrash } from 'react-icons/hi2';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { formatInTimeZone } from 'date-fns-tz';
import getAvatarUrl from '../../utils/getAvatarUrl';

// A component to render message content, converting URLs to links/images
const MessageRenderer = ({ text, onImageClick }) => {
    if (!text) return null;

    // Regex to find URLs and split the text by them
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
        <div className="whitespace-pre-wrap text-sm">
            {parts.map((part, index) => {
                if (part.match(urlRegex)) {
                    // Check if the URL is for an image
                    if (/\.(jpeg|jpg|gif|png)$/i.test(part)) {
                        return (
                            <img 
                                key={index} 
                                src={part} 
                                alt="User uploaded content" 
                                className="rounded-lg my-2 max-w-[4rem] h-auto cursor-pointer hover:opacity-80 transition-opacity" 
                                onClick={() => onImageClick(part)}
                            />
                        );
                    } else {
                        // Otherwise, render it as a clickable link
                        return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{part}</a>;
                    }
                }
                return part;
            })}
        </div>
    );
};

const ChatPopup = ({ chat, onClose, onToggleMinimize }) => {
    const { sendMessage, currentUserId } = useChat();
    const [newMessage, setNewMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imageModalSrc, setImageModalSrc] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showDropTarget, setShowDropTarget] = useState(false);
    const [longPressTimer, setLongPressTimer] = useState(null);
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const [isNearTrash, setIsNearTrash] = useState(false);
    const dragControls = useDragControls();
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (chat.initialMessage) {
            // Handle both string and object formats for initialMessage
            if (typeof chat.initialMessage === 'string') {
                setNewMessage(chat.initialMessage);
            } else if (chat.initialMessage.text) {
                setNewMessage(chat.initialMessage.text);
                if (chat.initialMessage.files && chat.initialMessage.files.length > 0) {
                    setSelectedFiles(chat.initialMessage.files);
                }
            }
        }
    }, [chat.initialMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [chat.messages]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files].slice(0, 5));
        e.target.value = null;
    };

    const removeSelectedFile = (fileToRemove) => {
        setSelectedFiles(prev => prev.filter(file => file !== fileToRemove));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const submitMessage = () => {
        if (newMessage.trim() || selectedFiles.length > 0) {
            sendMessage(chat.recipient.id, { text: newMessage, files: selectedFiles });
            setNewMessage('');
            setSelectedFiles([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessage();
        }
    };

    const handleImageClick = (imageSrc) => {
        setImageModalSrc(imageSrc);
    };

    const closeImageModal = () => {
        setImageModalSrc(null);
    };

    // Mouse position tracking for smooth dragging
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                const newPosition = {
                    x: e.clientX - 28, // Center the 56px element under cursor
                    y: e.clientY - 28
                };
                setDragPosition(newPosition);
                
                // Check proximity to trash can for animation
                const dropTarget = document.getElementById('chat-drop-target');
                if (dropTarget) {
                    const rect = dropTarget.getBoundingClientRect();
                    const chatCenterX = e.clientX;
                    const chatCenterY = e.clientY;
                    const trashCenterX = rect.left + rect.width / 2;
                    const trashCenterY = rect.top + rect.height / 2;
                    
                    // Calculate distance between chat head and trash can
                    const distance = Math.sqrt(
                        Math.pow(chatCenterX - trashCenterX, 2) + 
                        Math.pow(chatCenterY - trashCenterY, 2)
                    );
                    
                    // Animate trash can when chat head is within 100px
                    setIsNearTrash(distance < 100);
                }
            }
        };

        const handleMouseUpGlobal = () => {
            if (isDragging) {
                setIsDragging(false);
                setShowDropTarget(false);
                
                // Check if dropped on cart target
                const dropTarget = document.getElementById('chat-drop-target');
                if (dropTarget) {
                    const rect = dropTarget.getBoundingClientRect();
                    const mouseX = dragPosition.x + 28;
                    const mouseY = dragPosition.y + 28;
                    
                    if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
                        // Dropped on cart - close chat
                        onClose(chat.recipient.id);
                    }
                }
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUpGlobal);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUpGlobal);
        };
    }, [isDragging, dragPosition, onClose]);

    // Long press and drag handlers
    const handleMouseDown = (e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        setInitialPosition({ x: rect.left, y: rect.top });
        
        const timer = setTimeout(() => {
            setIsDragging(true);
            setShowDropTarget(true);
            setDragPosition({
                x: e.clientX - 28,
                y: e.clientY - 28
            });
        }, 300);
        setLongPressTimer(timer);
    };

    const handleMouseUp = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        if (!isDragging) {
            // Normal click - toggle minimize
            onToggleMinimize(chat.recipient.id);
        }
    };

    const handleTouchStart = (e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        setInitialPosition({ x: rect.left, y: rect.top });
        
        const timer = setTimeout(() => {
            setIsDragging(true);
            setShowDropTarget(true);
            const touch = e.touches[0];
            setDragPosition({
                x: touch.clientX - 28,
                y: touch.clientY - 28
            });
        }, 300);
        setLongPressTimer(timer);
    };

    const handleTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        if (!isDragging) {
            onToggleMinimize(chat.recipient.id);
        }
    };

    // Touch move handler
    useEffect(() => {
        const handleTouchMove = (e) => {
            if (isDragging) {
                const touch = e.touches[0];
                const newPosition = {
                    x: touch.clientX - 28,
                    y: touch.clientY - 28
                };
                setDragPosition(newPosition);
                
                // Check proximity to trash can for animation
                const dropTarget = document.getElementById('chat-drop-target');
                if (dropTarget) {
                    const rect = dropTarget.getBoundingClientRect();
                    const chatCenterX = touch.clientX;
                    const chatCenterY = touch.clientY;
                    const trashCenterX = rect.left + rect.width / 2;
                    const trashCenterY = rect.top + rect.height / 2;
                    
                    // Calculate distance between chat head and trash can
                    const distance = Math.sqrt(
                        Math.pow(chatCenterX - trashCenterX, 2) + 
                        Math.pow(chatCenterY - trashCenterY, 2)
                    );
                    
                    // Animate trash can when chat head is within 100px
                    setIsNearTrash(distance < 100);
                }
            }
        };

        const handleTouchEndGlobal = () => {
            if (isDragging) {
                setIsDragging(false);
                setShowDropTarget(false);
                
                // Check if dropped on cart target
                const dropTarget = document.getElementById('chat-drop-target');
                if (dropTarget) {
                    const rect = dropTarget.getBoundingClientRect();
                    const touchX = dragPosition.x + 28;
                    const touchY = dragPosition.y + 28;
                    
                    if (touchX >= rect.left && touchX <= rect.right && touchY >= rect.top && touchY <= rect.bottom) {
                        onClose(chat.recipient.id);
                    }
                }
            }
        };

        if (isDragging) {
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEndGlobal);
        }

        return () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEndGlobal);
        };
    }, [isDragging, dragPosition, onClose]);

    // Facebook-style minimized chat (circular avatar)
    if (chat.minimized) {
        return (
            <>
                <motion.div
                    key="minimized-chat"
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ 
                        scale: isDragging ? 1.1 : 1, 
                        opacity: 1
                    }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    transition={{ 
                        type: isDragging ? "tween" : "spring", 
                        duration: isDragging ? 0 : 0.4,
                        stiffness: 300, 
                        damping: 25
                    }}
                    className={`${isDragging ? 'fixed' : 'fixed bottom-4 right-4'} w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow flex-shrink-0 ${isDragging ? 'shadow-2xl ring-4 ring-blue-300 cursor-grabbing' : 'cursor-grab'}`}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    whileHover={!isDragging ? { scale: 1.05 } : {}}
                    whileTap={!isDragging ? { scale: 0.95 } : {}}
                    style={{ 
                        width: '56px', 
                        height: '56px', 
                        minWidth: '56px', 
                        minHeight: '56px',
                        zIndex: isDragging ? 9999 : 'auto',
                        left: isDragging ? `${dragPosition.x}px` : undefined,
                        top: isDragging ? `${dragPosition.y}px` : undefined,
                        right: isDragging ? 'auto' : undefined,
                        bottom: isDragging ? 'auto' : undefined
                    }}
                >
                    <motion.div 
                        className="relative"
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        <img 
                            src={getAvatarUrl(chat.recipient)} 
                            alt={chat.recipient?.first_name} 
                            className="w-12 h-12 rounded-full border-2 border-white object-cover" 
                        />
                        {chat.recipient?.active && (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
                                className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"
                            ></motion.span>
                        )}
                    </motion.div>
                </motion.div>
                
                {/* Image Modal */}
                <AnimatePresence>
                    {imageModalSrc && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                            onClick={closeImageModal}
                        >
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                className="relative max-w-4xl max-h-4xl p-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img 
                                    src={imageModalSrc} 
                                    alt="Full size" 
                                    className="max-w-full max-h-full rounded-lg shadow-2xl" 
                                />
                                <button
                                    onClick={closeImageModal}
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Cart Drop Target */}
                <AnimatePresence>
                    {showDropTarget && (
                        <motion.div
                            id="chat-drop-target"
                            initial={{ scale: 0, opacity: 0, y: 50 }}
                            animate={{ 
                                scale: isNearTrash ? 1.15 : 1, 
                                opacity: 1, 
                                y: isNearTrash ? -5 : 0,
                                rotate: isNearTrash ? [0, -3, 3, -3, 0] : 0
                            }}
                            exit={{ scale: 0, opacity: 0, y: 50 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 20,
                                rotate: { duration: 0.8, repeat: isNearTrash ? Infinity : 0 }
                            }}
                            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
                        >
                            {/* Clean Blue Trash Can */}
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                {/* Trash Can Body */}
                                <motion.div
                                    className="relative"
                                    animate={{
                                        y: isNearTrash ? -2 : 0,
                                        scale: isNearTrash ? 1.2 : 1
                                    }}
                                    transition={{ duration: 0.3, type: "spring", stiffness: 400 }}
                                >
                                    {/* Custom SVG Trash Can - Blue */}
                                    <svg 
                                        width="48" 
                                        height="48" 
                                        viewBox="0 0 24 24" 
                                        className={`transition-colors duration-300 ${
                                            isNearTrash ? 'text-blue-600' : 'text-blue-500'
                                        }`}
                                    >
                                        {/* Trash Can Body */}
                                        <motion.path
                                            d="M3 6h18l-2 12H5L3 6z"
                                            fill="currentColor"
                                            opacity="0.9"
                                            animate={{
                                                scale: isNearTrash ? [1, 1.05, 1] : 1
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: isNearTrash ? Infinity : 0,
                                                repeatType: "reverse"
                                            }}
                                        />
                                        {/* Trash Can Lines */}
                                        <path d="M8 9v6M12 9v6M16 9v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                        {/* Trash Can Base */}
                                        <path d="M5 6h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                                    </svg>
                                </motion.div>
                                
                                {/* Trash Can Lid (opens when near) - Blue */}
                                <motion.div
                                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 origin-bottom-left"
                                    animate={{
                                        rotate: isNearTrash ? -35 : 0,
                                        x: isNearTrash ? 15 : 0,
                                        y: isNearTrash ? -5 : 0
                                    }}
                                    transition={{ duration: 0.4, type: "spring", stiffness: 250, damping: 15 }}
                                >
                                    <svg 
                                        width="28" 
                                        height="12" 
                                        viewBox="0 0 20 8" 
                                        className={`transition-colors duration-300 ${
                                            isNearTrash ? 'text-blue-600' : 'text-blue-500'
                                        }`}
                                    >
                                        {/* Lid */}
                                        <path d="M2 6h16c1 0 1-2 0-2H2c-1 0-1 2 0 2z" fill="currentColor"/>
                                        {/* Handle */}
                                        <path d="M7 4V2c0-1 1-1 1-1h4s1 0 1 1v2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                                    </svg>
                                </motion.div>
                                
                                {/* Sparkle Effects - Blue themed */}
                                <AnimatePresence>
                                    {isNearTrash && (
                                        <>
                                            {[...Array(6)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{
                                                        scale: [0, 1, 0],
                                                        opacity: [0, 1, 0],
                                                        x: [0, (Math.random() - 0.5) * 50],
                                                        y: [0, (Math.random() - 0.5) * 50]
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        delay: i * 0.2,
                                                        repeatType: "loop"
                                                    }}
                                                    style={{
                                                        left: '50%',
                                                        top: '50%'
                                                    }}
                                                />
                                            ))}
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                            
                            <motion.div 
                                className="text-center mt-2"
                                animate={{
                                    scale: isNearTrash ? 1.1 : 1
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                                    isNearTrash 
                                        ? 'bg-red-600 text-white shadow-lg' 
                                        : 'bg-black bg-opacity-75 text-white'
                                }`}>
                                    {isNearTrash ? '🔥 Release to delete!' : 'Drop to close chat'}
                                </span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    return (
        <>
            <motion.div
                key="expanded-chat"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0, height: '24rem' }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 25,
                    duration: 0.5
                }}
                className="w-80 bg-white rounded-t-lg shadow-2xl flex flex-col border border-gray-200 overflow-hidden"
            >
            {/* Header */}
            <div
                onClick={() => onToggleMinimize(chat.recipient.id)}
                className="flex items-center justify-between p-3 bg-primary text-white rounded-t-lg cursor-pointer flex-shrink-0"
            >
                <div className="flex items-center overflow-hidden">
                    <div className="relative mr-3">
                        <img src={getAvatarUrl(chat.recipient)} alt={chat.recipient?.first_name} className="w-8 h-8 rounded-full" />
                        {chat.recipient?.active && (
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-primary"></span>
                        )}
                    </div>
                    <div className="font-semibold truncate">{chat.recipient.name || ''}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleMinimize(chat.recipient.id); }}
                        className="text-white hover:bg-white/20 p-1 rounded-full"
                    >
                        <FaMinus size={16} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(chat.recipient.id); }}
                        className="text-white hover:bg-white/20 p-1 rounded-full"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <AnimatePresence>
                {!chat.minimized && (
                    <motion.div
                        className="flex-1 flex flex-col overflow-hidden"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                    >
                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {chat.loading ? (
                                <div className="space-y-4 animate-pulse"> 
                                    <div className="flex items-end gap-2"><div className="w-6 h-6 rounded-full bg-gray-300"></div><div className="h-10 rounded-lg bg-gray-300 w-2/3"></div></div>
                                    <div className="flex justify-end items-end gap-2"><div className="h-12 rounded-lg bg-gray-400 w-1/2"></div></div>
                                    <div className="flex items-end gap-2"><div className="w-6 h-6 rounded-full bg-gray-300"></div><div className="h-8 rounded-lg bg-gray-300 w-1/3"></div></div>
                                    <div className="flex justify-end items-end gap-2"><div className="h-10 rounded-lg bg-gray-400 w-3/4"></div></div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {chat.messages.map((msg) => (
                                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender_id === currentUserId ? 'justify-end' : ''} ${msg.isSending ? 'opacity-60' : ''}`}>
                                            {msg.sender_id !== currentUserId && (
                                                <img src={getAvatarUrl(chat.recipient)} alt={chat.recipient?.first_name} className="w-6 h-6 rounded-full self-start" />
                                            )}
                                            <div className={`flex flex-col ${msg.sender_id === currentUserId ? 'items-end' : 'items-start'}`}>
                                                <div className={`w-fit max-w-[75%] p-3 rounded-lg break-words ${msg.sender_id === currentUserId ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                                    <MessageRenderer text={msg.text} onImageClick={handleImageClick} />
                                                    
                                                    {msg.media && msg.media.length > 0 && (
                                                        <div className="mt-2 flex flex-col gap-2">
                                                            {msg.media.map(mediaItem => (
                                                                <div key={mediaItem.id || mediaItem.media_url} className="relative">
                                                                    {mediaItem.media_type === 'image' ? (
                                                                        <img src={mediaItem.media_url} alt="attachment" className="rounded-md max-w-full" />
                                                                    ) : (
                                                                        <video src={mediaItem.media_url} controls className="rounded-md max-w-full" />
                                                                    )}
                                                                    {(mediaItem.isUploading) && (
                                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                                                            <FaSpinner className="animate-spin text-white" size={24} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`text-xs mt-1 ${msg.sender_id === currentUserId ? 'text-gray-300' : 'text-gray-500'}`}>
                                                    {formatInTimeZone(new Date(msg.timestamp), 'Asia/Manila', 'p')}
                                                    {msg.isSending && <span className="ml-1">(Sending...)</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t bg-white">
                            {selectedFiles.length > 0 && (
                                <div className="p-2 flex gap-2 overflow-x-auto border-b mb-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="relative flex-shrink-0">
                                            {file.type.startsWith('image/') ? (
                                                <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center">
                                                    <FaVideo className="text-white" size={24} />
                                                </div>
                                            )}
                                            <button onClick={() => removeSelectedFile(file)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 flex items-center justify-center w-4 h-4">
                                                <FaTimes size={8} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="relative">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="w-full bg-gray-100 border-transparent rounded-2xl px-4 py-2 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={1}
                                />
                                <button onClick={submitMessage} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-blue-700 p-2 disabled:text-gray-400 disabled:cursor-not-allowed" disabled={!newMessage.trim() && selectedFiles.length === 0}>
                                    <FaPaperPlane size={20} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="file"
                                    multiple
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    accept="image/*,video/*"
                                />
                                <button onClick={triggerFileInput} className="text-gray-500 hover:text-primary p-2">
                                    <FaImage size={20} />
                                </button>
                                <button onClick={triggerFileInput} className="text-gray-500 hover:text-primary p-2">
                                    <FaVideo size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
        
        {/* Image Modal */}
        <AnimatePresence>
            {imageModalSrc && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={closeImageModal}
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="relative max-w-4xl max-h-4xl p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={imageModalSrc} 
                            alt="Full size" 
                            className="max-w-full max-h-full rounded-lg shadow-2xl" 
                        />
                        <button
                            onClick={closeImageModal}
                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                        >
                            <FaTimes size={16} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
    );
};

export default ChatPopup;
