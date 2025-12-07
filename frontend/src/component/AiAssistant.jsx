import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Trash2, Clock, ArrowLeft, Sparkles, Brain } from 'lucide-react';
import healthService from '../services/healthService';
import ReactMarkdown from 'react-markdown';

const AiAssistant = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Load chat history on mount
    useEffect(() => {
        loadChatHistory();
    }, []);

    const loadChatHistory = async () => {
        try {
            setLoadingHistory(true);
            const response = await healthService.getAllChats();
            if (response.success) {
                setChatHistory(response.data.chats);
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const startNewChat = () => {
        setCurrentChatId(null);
        setMessages([
            { id: 1, text: "Namaste! I am Saathi, your personal health assistant. I have access to your health data and can provide personalized advice. How can I help you today?", sender: 'ai' }
        ]);
        loadChatHistory();
    };

    const loadChat = async (chatId) => {
        try {
            const response = await healthService.getChatHistory(chatId);
            if (response.success) {
                const chat = response.data.chat;
                setCurrentChatId(chat._id);

                const formattedMessages = chat.messages.map((msg, index) => ({
                    id: index + 1,
                    text: msg.content,
                    sender: msg.role === 'user' ? 'user' : 'ai',
                    timestamp: msg.timestamp
                }));

                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error('Failed to load chat:', error);
        }
    };

    const deleteChat = async (chatId, e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this chat?')) return;

        try {
            await healthService.deleteChat(chatId);
            if (currentChatId === chatId) {
                startNewChat();
            }
            loadChatHistory();
        } catch (error) {
            console.error('Failed to delete chat:', error);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || isTyping) return;

        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const messageText = inputText;
        setInputText('');
        setIsTyping(true);

        try {
            const response = await healthService.sendChatMessage(messageText, currentChatId);

            if (response.success) {
                if (!currentChatId && response.data.chatId) {
                    setCurrentChatId(response.data.chatId);
                    loadChatHistory();
                }

                const aiMsg = {
                    id: Date.now() + 1,
                    text: response.data.message,
                    sender: 'ai',
                    urgency: response.data.urgency
                };

                setMessages(prev => [...prev, aiMsg]);
            } else {
                throw new Error('Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I'm having trouble connecting right now. Please try again in a moment.",
                sender: 'ai'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestions = [
        "What foods should I eat during pregnancy?",
        "How to manage period cramps naturally?",
        "I'm feeling anxious, what can I do?",
        "Best exercises during menstruation?",
        "Is it normal to have mood swings?",
        "Tips for better sleep during pregnancy"
    ];

    const handleSuggestionClick = (text) => {
        setInputText(text);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col">
            {/* Header with Back Button */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl p-6 mb-4 shadow-xl"
            >
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate('/health-assistant')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold transition backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm font-medium">AI Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                        🤖
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-1">Saathi AI Assistant</h1>
                        <p className="text-white/90 text-sm flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Personalized health guidance powered by AI
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Chat History Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-80 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden"
                >
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-purple-600" />
                            Chat History
                        </h3>
                        <button
                            onClick={startNewChat}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                        >
                            <Plus className="w-5 h-5" />
                            New Conversation
                        </button>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {loadingHistory ? (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-2"></div>
                                Loading chats...
                            </div>
                        ) : chatHistory.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                                    💬
                                </div>
                                <p className="text-gray-400 text-sm">No chat history yet</p>
                                <p className="text-gray-300 text-xs mt-1">Start a new conversation!</p>
                            </div>
                        ) : (
                            chatHistory.map((chat) => (
                                <motion.div
                                    key={chat._id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => loadChat(chat._id)}
                                    className={`p-3 rounded-xl cursor-pointer transition group ${currentChatId === chat._id
                                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 shadow-sm'
                                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(chat.updatedAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800 truncate mb-1">
                                                {chat.lastMessage?.content?.substring(0, 35) || 'New chat'}...
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                                    {chat.messageCount} msgs
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => deleteChat(chat._id, e)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Chat Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden"
                >
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                        {messages.length === 0 && (
                            <div className="text-center py-16">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg"
                                >
                                    🤖
                                </motion.div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Start a Conversation</h3>
                                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                                    I have access to your period and pregnancy data to provide personalized health advice
                                </p>
                                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="w-4 h-4" />
                                        AI-Powered
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Brain className="w-4 h-4" />
                                        Personalized
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'ai' && (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm mr-3 self-end mb-1 flex-shrink-0 shadow-md">
                                        AI
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none shadow-lg'
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                                        } ${msg.urgency === 'high' ? 'border-2 border-red-500 shadow-red-200' : ''}`}
                                >
                                    {msg.sender === 'ai' ? (
                                        <div className="prose prose-sm max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                                                    li: ({ children }) => <li className="ml-2">{children}</li>,
                                                    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                                                    em: ({ children }) => <em className="italic">{children}</em>,
                                                    code: ({ children }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">{children}</code>
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    )}
                                    {msg.urgency === 'high' && (
                                        <Link to="/emergency" className="block mt-3 bg-red-600 text-white text-center py-2 rounded-lg font-bold hover:bg-red-700 transition">
                                            🆘 Emergency SOS
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm mr-3 self-end mb-1 shadow-md">AI</div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex gap-1.5">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white border-t border-gray-100">
                        {messages.length === 0 && (
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Suggested Questions</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {suggestions.slice(0, 4).map((text, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSuggestionClick(text)}
                                            className="text-left px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl text-xs text-gray-700 hover:from-purple-100 hover:to-pink-100 hover:border-purple-200 transition"
                                        >
                                            {text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about your health..."
                                disabled={isTyping}
                                className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputText.trim() || isTyping}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition shadow-md disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                            >
                                <span>Send</span>
                                <span className="text-lg">➤</span>
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-400 mt-3">
                            💡 I analyze your health data to provide personalized advice • AI responses may not always be accurate
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AiAssistant;
