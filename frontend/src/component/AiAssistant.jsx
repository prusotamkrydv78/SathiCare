import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { Link } from 'react-router-dom';

const AiAssistant = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Namaste! I am Saathi, your personal health assistant. How can I help you today?", sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = { id: messages.length + 1, text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Process message through Gemini Service
        try {
            const history = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const response = await geminiService.getChatResponse(inputText, history);
            const aiMsg = {
                id: messages.length + 2,
                text: response.text,
                sender: 'ai',
                type: response.type
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { id: messages.length + 2, text: "Sorry, I am having trouble connecting right now.", sender: 'ai' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const suggestions = [
        "Remedies for menstrual cramps?",
        "Is spotting normal during pregnancy?",
        "I feel anxious lately",
        "Best diet for PCOD?"
    ];

    const handleSuggestionClick = (text) => {
        setInputText(text);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden font-sans">
            {/* Chat Header */}
            <div className="bg-primary-pink p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">
                        🤖
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-tight">Saathi AI Assistant</h2>
                        <div className="flex items-center gap-1.5 opacity-90">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-xs font-medium">Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center text-white text-xs mr-2 self-end mb-1">
                                AI
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-primary-pink text-white rounded-tr-none shadow-md shadow-pink-100'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
                                } ${msg.type === 'emergency' ? 'border-2 border-red-500 bg-red-50 text-red-700' : ''}`}
                        >
                            {msg.text}
                            {msg.type === 'emergency' && (
                                <Link to="/emergency" className="block mt-2 bg-red-600 text-white text-center py-2 rounded-lg font-bold hover:bg-red-700 transition">
                                    Open Emergency SOS
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center text-white text-xs mr-2 self-end mb-1">AI</div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                {messages.length < 3 && (
                    <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-2">
                        {suggestions.map((text, i) => (
                            <button
                                key={i}
                                onClick={() => handleSuggestionClick(text)}
                                className="whitespace-nowrap px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-pink-50 hover:border-pink-200 hover:text-primary-pink transition"
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                )}
                <div className="flex gap-2 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex gap-2">
                        <button className="hover:text-primary-pink transition">📷</button>
                        <button className="hover:text-primary-pink transition">🎤</button>
                    </div>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your health concern..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink transition"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className="bg-primary-pink text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-pink-600 transition shadow-lg shadow-pink-200 disabled:opacity-50 disabled:shadow-none"
                    >
                        ➤
                    </button>
                </div>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                    AI generated responses can be inaccurate.
                    <button className="underline hover:text-red-500 ml-1">Report Issue</button>
                </p>
            </div>
        </div>
    );
};

export default AiAssistant;
