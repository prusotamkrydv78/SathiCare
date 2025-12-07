import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';

const PregnancyAiWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Namaste! 🤰 I'm your pregnancy companion. Ask me anything about your baby or your health!", sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            // Prepare history for context
            const history = messages.map(m => ({
                text: m.text,
                sender: m.sender
            }));

            const response = await geminiService.getPregnancyChatResponse(inputText, history);

            const aiMsg = { id: Date.now() + 1, text: response.text, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I couldn't reach the server. 🌸", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative z-50">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all transform hover:scale-105 font-bold border-2 ${isOpen
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-primary-pink border-primary-pink'
                    }`}
            >
                <span className="text-xl">🤰</span>
                <span>{isOpen ? 'Close AI' : 'Ask Saathi AI'}</span>
            </button>

            {/* Chat Window Popup */}
            {isOpen && (
                <div className="absolute top-14 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-pink-100 flex flex-col h-[500px] overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-pink to-soft-pink p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">🤖</div>
                            <div>
                                <h3 className="font-bold text-sm">Pregnancy Companion</h3>
                                <p className="text-xs opacity-90">Always here for you</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-primary-pink text-white rounded-tr-none'
                                            : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-sm'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                                    <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ask about symptoms, diet..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/50 transition"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputText.trim()}
                                className="w-10 h-10 bg-primary-pink text-white rounded-xl flex items-center justify-center hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                ➤
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-400 mt-2">
                            Always consult a doctor for medical emergencies.
                        </p>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PregnancyAiWidget;
