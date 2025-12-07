import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Send,
    Paperclip,
    Image as ImageIcon,
    File,
    Phone,
    Video,
    MoreVertical,
    Check,
    CheckCheck,
    Loader
} from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import doctorService from '../../services/doctorService';

const ConsultationChat = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load appointment details
    useEffect(() => {
        loadAppointment();
    }, [appointmentId]);

    // Initialize Socket.IO
    useEffect(() => {
        if (!appointment || !user) return;

        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            withCredentials: true
        });

        newSocket.on('connect', () => {
            console.log('✅ Socket connected');
            setConnected(true);

            // Join consultation room
            newSocket.emit('join-consultation', {
                appointmentId,
                userId: user._id,
                userType: 'user'
            });
        });

        newSocket.on('consultation-joined', ({ messages: chatMessages }) => {
            setMessages(chatMessages || []);
            setLoading(false);
        });

        newSocket.on('message-received', ({ message }) => {
            setMessages(prev => [...prev, message]);
        });

        newSocket.on('user-typing', ({ isTyping }) => {
            setOtherUserTyping(isTyping);
        });

        newSocket.on('user-joined', ({ userType }) => {
            console.log(`${userType} joined the consultation`);
        });

        newSocket.on('user-left', ({ userType }) => {
            console.log(`${userType} left the consultation`);
        });

        newSocket.on('consultation-ended', () => {
            alert('Consultation has ended');
            navigate('/consultations');
        });

        newSocket.on('error', ({ message }) => {
            console.error('Socket error:', message);
            alert(message);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.emit('leave-consultation', {
                    appointmentId,
                    userId: user._id,
                    userType: 'user'
                });
                newSocket.disconnect();
            }
        };
    }, [appointment, user, appointmentId]);

    const loadAppointment = async () => {
        try {
            const response = await doctorService.getAppointmentById(appointmentId);
            if (response.success) {
                setAppointment(response.data.appointment);
            }
        } catch (error) {
            console.error('Failed to load appointment:', error);
            alert('Failed to load consultation');
            navigate('/consultations');
        }
    };

    const handleSendMessage = () => {
        if (!inputText.trim() || !socket || !connected) return;

        const messageData = {
            appointmentId,
            senderId: user._id,
            senderType: 'user',
            message: {
                type: 'text',
                content: inputText.trim()
            }
        };

        socket.emit('send-message', messageData);
        setInputText('');
        handleStopTyping();
    };

    const handleTyping = () => {
        if (!socket || !connected) return;

        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', {
                appointmentId,
                userId: user._id,
                userType: 'user'
            });
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
            handleStopTyping();
        }, 1000);
    };

    const handleStopTyping = () => {
        if (socket && connected && isTyping) {
            setIsTyping(false);
            socket.emit('stop-typing', {
                appointmentId,
                userId: user._id,
                userType: 'user'
            });
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await doctorService.uploadConsultationMedia(appointmentId, file);
            if (response.success) {
                // Message will be received via socket
                console.log('File uploaded successfully');
            }
        } catch (error) {
            console.error('File upload failed:', error);
            alert('Failed to upload file');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/consultations')}
                            className="p-2 hover:bg-white/20 rounded-lg transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                                👨‍⚕️
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">
                                    {appointment?.doctorId?.name || 'Doctor'}
                                </h2>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                    <span>{connected ? 'Connected' : 'Connecting...'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 hover:bg-white/20 rounded-lg transition">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-3 hover:bg-white/20 rounded-lg transition">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-3 hover:bg-white/20 rounded-lg transition">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                                💬
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Start Consultation</h3>
                            <p className="text-gray-500 text-sm">Send a message to begin your consultation</p>
                        </div>
                    )}

                    {messages.map((msg, index) => {
                        const isOwnMessage = msg.senderId === user._id;
                        const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;

                        return (
                            <motion.div
                                key={msg._id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isOwnMessage && showAvatar && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">
                                        Dr
                                    </div>
                                )}
                                {!isOwnMessage && !showAvatar && <div className="w-8 mr-2"></div>}

                                <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                                    <div
                                        className={`px-4 py-3 rounded-2xl ${isOwnMessage
                                                ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-200'
                                            }`}
                                    >
                                        {msg.messageType === 'text' && (
                                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                        )}
                                        {msg.messageType === 'image' && (
                                            <div>
                                                <img
                                                    src={msg.fileUrl}
                                                    alt="Shared image"
                                                    className="max-w-full rounded-lg mb-2"
                                                />
                                                {msg.content && <p className="text-sm">{msg.content}</p>}
                                            </div>
                                        )}
                                        {msg.messageType === 'document' && (
                                            <div className="flex items-center gap-2">
                                                <File className="w-5 h-5" />
                                                <div>
                                                    <p className="text-sm font-semibold">{msg.fileName}</p>
                                                    <p className="text-xs opacity-75">
                                                        {(msg.fileSize / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 px-2">
                                        <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                                        {isOwnMessage && (
                                            <span className="text-xs text-gray-400">
                                                {msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {otherUserTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs">
                                Dr
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-200">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto flex items-end gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 hover:bg-gray-100 rounded-xl transition"
                    >
                        <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex-1 relative">
                        <textarea
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value);
                                handleTyping();
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            rows="1"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            style={{ minHeight: '48px', maxHeight: '120px' }}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || !connected}
                        className="p-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                {!connected && (
                    <p className="text-xs text-center text-red-500 mt-2">
                        Connecting to server...
                    </p>
                )}
            </div>
        </div>
    );
};

export default ConsultationChat;
