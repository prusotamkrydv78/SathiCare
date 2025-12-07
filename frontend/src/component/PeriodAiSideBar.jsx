import React from 'react';

const PeriodAiSideBar = ({ showMainChat, setShowMainChat }) => {
    return (
        <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100 transition-all duration-300">
            <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                <span className="bg-purple-100 p-1.5 rounded-lg">🤖</span> Ask AI Companion
            </h3>
            <p className="text-sm text-purple-700 mb-4">
                "Is this recurring cramp normal?"
            </p>

            <button
                onClick={() => setShowMainChat(!showMainChat)}
                className={`block w-full py-3 rounded-xl font-bold text-center transition shadow-lg ${showMainChat ? 'bg-gray-800 text-white hover:bg-black' : 'bg-purple-500 text-white hover:bg-purple-600 shadow-purple-200'}`}
            >
                {showMainChat ? 'Close Chat' : 'Ask Now'}
            </button>
        </div>
    );
};

export default PeriodAiSideBar;
