import React, { useRef, useEffect } from 'react';

const PeriodAiChat = ({ showMainChat, setShowMainChat, messages, loading, input, setInput, handleSubmit, messagesEndRef }) => {
    // Scroll to bottom when messages change or chat opens
    useEffect(() => {
        if (showMainChat) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, showMainChat, messagesEndRef]);

    if (!showMainChat) return null;

    return (
        <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100 flex flex-col mb-8 transition-all duration-300 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-purple-800 flex items-center gap-2">
                    <span className="bg-purple-100 p-1.5 rounded-lg">🤖</span> Period Health Companion
                </h3>
                <button
                    onClick={() => setShowMainChat(false)}
                    className="text-gray-400 hover:text-gray-600 px-2"
                >
                    ✕
                </button>
            </div>

            <div className="mt-2">
                <div className="h-64 overflow-y-auto mb-4 bg-white rounded-xl p-3 border border-purple-100 space-y-3">
                    {messages.map(msg => (
                        <div key={msg.id} className={`p-2 rounded-lg text-xs ${msg.sender === 'user' ? 'bg-purple-500 text-white ml-auto max-w-[85%]' : 'bg-gray-100 text-gray-700 mr-auto max-w-[90%]'}`}>
                            {msg.text}
                        </div>
                    ))}
                    {loading && (
                        <div className="text-xs text-gray-400 italic">Thinking...</div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 text-sm border border-purple-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Type here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-purple-700"
                    >
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PeriodAiChat;
