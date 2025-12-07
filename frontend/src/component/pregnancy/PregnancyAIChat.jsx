import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import pregnancyService from '../../services/pregnancyService';

const PregnancyAIChat = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your pregnancy companion. Ask me anything about your pregnancy journey! 🤰", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentChatId, setCurrentChatId] = useState(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { id: Date.now(), text: userMessage, sender: 'user' }]);
        setLoading(true);

        try {
            const response = await pregnancyService.sendChatMessage(userMessage, currentChatId);

            if (response.success) {
                // Set chat ID if this is the first message
                if (!currentChatId && response.data.chatId) {
                    setCurrentChatId(response.data.chatId);
                }

                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: response.data.message,
                    sender: 'ai'
                }]);
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
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[600px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                        🤰
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Pregnancy AI Companion</h3>
                        <p className="text-sm text-gray-500">Ask me anything about your journey</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map(msg => (
                    <motion.div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {msg.sender === 'ai' ? (
                                <div className="text-sm leading-relaxed prose prose-sm max-w-none">
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
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            )}
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="bg-gray-100 p-4 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-sm text-gray-500">Thinking...</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-100">
                <form onSubmit={handleSend} className="flex gap-3">
                    <input
                        type="text"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        placeholder="Ask about symptoms, nutrition, baby development..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <motion.button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        whileHover={{ scale: loading ? 1 : 1.05 }}
                        whileTap={{ scale: loading ? 1 : 0.95 }}
                    >
                        <Send className="w-5 h-5" />
                        <span>Send</span>
                    </motion.button>
                </form>
                <p className="text-xs text-gray-400 mt-3 text-center">
                    💡 Get personalized advice based on your pregnancy data
                </p>
            </div>
        </motion.div>
    );
};

export default PregnancyAIChat;
