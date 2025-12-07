import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AiAssistant = () => {
    const [messages, setMessages] = useState([
        { id: 1, type: 'ai', text: 'Hello! I am your Sathi AI health assistant. I can help you with general health questions, explain medical terms, or guide you to nearest facilities. How can I help you today?', time: '10:30 AM' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestedQuestions = [
        "What are symptoms of flu?",
        "Find nearest gynecologist",
        "Diet for pregnancy",
        "Menstrual cycle advice"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (text = inputText) => {
        if (!text.trim()) return;

        // User Message
        const newMessage = {
            id: messages.length + 1,
            type: 'user',
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulated AI Response
        setTimeout(() => {
            const responseText = getSimulatedResponse(text);
            const aiMessage = {
                id: messages.length + 2,
                type: 'ai',
                text: responseText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const getSimulatedResponse = (query) => {
        const q = query.toLowerCase();
        if (q.includes('flu') || q.includes('symptom')) return "Common flu symptoms include fever, cough, sore throat, runny nose, muscle aches, headaches, and fatigue. Be sure to stay hydrated and rest!";
        if (q.includes('find') || q.includes('hospital') || q.includes('doctor')) return "I can help you find that. Check out the 'Facility Finder' feature in the dashboard to see locations near you.";
        if (q.includes('pregnant') || q.includes('pregnancy')) return "For pregnancy, a balanced diet rich in leafy greens, calcium, and iron is important. Are you tracking your pregnancy week by week?";
        return "I see. That sounds important. While I am an AI, I suggest consulting a real doctor for specific advice. Would you like to connect with one?";
    };

    return (
        <div className="h-screen bg-[#FAFAFA] flex flex-col font-sans">
            {/* Disclaimer Banner */}
            <div className="bg-blue-50 text-blue-800 text-[10px] text-center py-1 px-4 font-medium border-b border-blue-100">
                AI provides information, not medical diagnosis. In emergencies, call standard emergency numbers.
            </div>

            {/* Top Bar */}
            <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center">
                    <Link to="/dashboard" className="mr-3 text-gray-500 hover:text-gray-700">←</Link>
                    <div>
                        <h1 className="font-bold text-gray-800 text-lg leading-tight">AI Health Assistant</h1>
                        <span className="text-[10px] text-green-500 font-medium flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                            Online
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition">EN</button>
                    <button className="text-gray-400 text-xl">⋮</button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm
                            ${msg.type === 'user'
                                ? 'bg-primary-pink text-white rounded-br-none'
                                : 'bg-[#4ECDC4] text-white rounded-bl-none'
                            }
                        `}>
                            {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1.5 px-1">{msg.time}</span>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex items-start">
                        <div className="bg-[#4ECDC4] text-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Chips (Only if few messages) */}
            {messages.length < 3 && (
                <div className="px-4 pb-2">
                    <p className="text-xs text-gray-400 mb-2 font-medium ml-1">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(q)}
                                className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-full border border-gray-200 flex items-center px-2 py-1 focus-within:ring-1 focus-within:ring-primary-pink focus-within:border-primary-pink transition">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/50 transition">
                        🎤
                    </button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your health query..."
                        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 px-2 h-10 placeholder-gray-400"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!inputText.trim()}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-sm
                            ${inputText.trim()
                                ? 'bg-primary-pink text-white hover:bg-pink-500 hover:shadow-md transform hover:scale-105'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiAssistant;
