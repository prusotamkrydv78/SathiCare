import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContentLibrary = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = ['All', 'Pregnancy', 'Periods', 'Sexual Health', 'Nutrition', 'Mental Health'];

    const contentData = [
        { id: 1, type: 'Article', category: 'Pregnancy', title: 'First Trimester Guide', image: 'https://images.unsplash.com/photo-1544367563-12123d832d61?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', readTime: '5 min read', badgeColor: 'bg-pink-100 text-pink-600' },
        { id: 2, type: 'Video', category: 'Periods', title: 'Menstrual Cycle Explained', image: 'https://plus.unsplash.com/premium_photo-1663047240822-bd5a898b688c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', duration: '10:20', badgeColor: 'bg-purple-100 text-purple-600' },
        { id: 3, type: 'Infographic', category: 'Nutrition', title: 'Iron-Rich Foods', image: 'https://cdn.dribbble.com/users/3501309/screenshots/16383637/media/1d960787a4141d6b0445d36e2f1e2f75.jpg?resize=1200x900&vertical=center', badgeColor: 'bg-green-100 text-green-600' },
        { id: 4, type: 'Article', category: 'Mental Health', title: 'Postpartum Depression', image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', readTime: '8 min read', badgeColor: 'bg-blue-100 text-blue-600' },
        { id: 5, type: 'Video', category: 'Sexual Health', title: 'Safe Sex Practices', image: 'https://images.unsplash.com/photo-1576089172869-4f5f6f315620?q=80&w=2026&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', duration: '5:45', badgeColor: 'bg-teal-100 text-teal-600' },
        { id: 6, type: 'Article', category: 'Nutrition', title: 'Prenatal Vitamins', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', readTime: '4 min read', badgeColor: 'bg-green-100 text-green-600' },
    ];

    const filteredContent = contentData.filter(item => {
        const matchesTab = activeTab === 'All' || item.category === activeTab;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-text-dark pb-20">
            {/* Header */}
            <div className="bg-white p-5 sticky top-0 z-20 shadow-sm border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
                        <h1 className="text-xl font-bold text-gray-800">Library</h1>
                    </div>
                    <button className="relative bg-gray-50 p-2 rounded-full hover:bg-gray-100 transition">
                        <span className="text-xl">⚙️</span>
                        {/* Filter mockup tooltip or dropdown could go here */}
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-2">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search for health topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink transition"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white sticky top-[120px] z-10 shadow-[0_4px_6px_-6px_rgba(0,0,0,0.1)]">
                <div className="flex overflow-x-auto no-scrollbar px-4 space-x-6 border-b border-gray-100">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium whitespace-nowrap transition relative
                                ${activeTab === tab ? 'text-primary-pink' : 'text-gray-500 hover:text-gray-700'}
                            `}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-pink rounded-t-full"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredContent.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer">
                        {/* Image Container */}
                        <div className="relative h-32 md:h-40 overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />

                            {/* Overlay for Video */}
                            {item.type === 'Video' && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center pl-0.5 backdrop-blur-sm shadow-md">
                                        ▶
                                    </div>
                                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                                        {item.duration}
                                    </span>
                                </div>
                            )}

                            {/* Type Badge */}
                            <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md bg-white/90 text-gray-700 shadow-sm border border-gray-100`}>
                                {item.type}
                            </span>
                        </div>

                        {/* Content Body */}
                        <div className="p-3">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${item.badgeColor}`}>
                                    {item.category}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-primary-pink transition-colors">
                                {item.title}
                            </h3>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-[10px] text-gray-400 font-medium">
                                    {item.readTime || 'Watch now'}
                                </span>
                                <button className="text-gray-300 hover:text-primary-pink transition">
                                    ♥
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredContent.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <span className="text-4xl mb-2">📄</span>
                    <p className="text-sm">No results found for "{searchQuery}"</p>
                </div>
            )}
        </div>
    );
};

export default ContentLibrary;
