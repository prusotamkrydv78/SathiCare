import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CommunityForum = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'Anonymous',
            authorRole: 'Mom-to-be',
            avatar: '🤰',
            time: '2 hours ago',
            category: 'Pregnancy',
            title: 'Anxiety about upcoming delivery',
            content: 'Hi everyone, I am 36 weeks pregnant and feeling very nervous about labor. Does anyone have tips for calming down?',
            likes: 24,
            replies: 12,
            liked: false
        },
        {
            id: 2,
            author: 'Sita R.',
            authorRole: 'Community Member',
            avatar: '👤',
            time: '5 hours ago',
            category: 'PCOS',
            title: 'Diet changes that helped my PCOS',
            content: 'I wanted to share that switching to a low-sugar diet has really helped regulate my cycles. Has anyone else tried this?',
            likes: 45,
            replies: 8,
            liked: true
        },
        {
            id: 3,
            author: 'Dr. Anjali',
            authorRole: 'Verified Doctor',
            avatar: '👩‍⚕️',
            time: '1 day ago',
            category: 'Expert Q&A',
            title: 'Weekly Q&A: Ask me about Iron Supplements',
            content: 'Namaste everyone! I am taking questions about anemia and iron supplements today. Drop your questions below.',
            likes: 156,
            replies: 42,
            liked: false
        },
        {
            id: 4,
            author: 'Anonymous',
            authorRole: 'User',
            avatar: '🌸',
            time: '1 day ago',
            category: 'Periods',
            title: 'Severe cramps every month',
            content: 'Is it normal to be unable to get out of bed? I feel weak.',
            likes: 12,
            replies: 5,
            liked: false
        }
    ]);

    const categories = ['All', 'Pregnancy', 'Periods', 'PCOS', 'Mental Health', 'Expert Q&A'];

    const handleLike = (id) => {
        setPosts(posts.map(post =>
            post.id === id
                ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
                : post
        ));
    };

    const filteredPosts = activeCategory === 'All'
        ? posts
        : posts.filter(post => post.category === activeCategory);

    return (
        <div className="font-sans text-gray-800 pb-12">

            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/dashboard" className="text-gray-400 hover:text-primary-pink transition">Dashboard</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-600 font-medium">Community</span>
                    </div>
                    <h1 className="text-2xl font-bold">Community Forum</h1>
                    <p className="text-gray-500 text-sm">A safe space to share, ask, and support.</p>
                </div>
                <button className="px-6 py-3 bg-primary-pink text-white rounded-xl font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-200 flex items-center gap-2">
                    <span>✏️</span> New Post
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar - Categories */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Topics</h3>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex justify-between items-center group ${activeCategory === cat ? 'bg-pink-50 text-primary-pink' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span>{cat}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === cat ? 'bg-pink-200 text-pink-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {cat === 'All' ? posts.length : posts.filter(p => p.category === cat).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Community Rules</h3>
                        <ul className="text-sm space-y-3 opacity-90">
                            <li className="flex gap-2 items-start"><span className="text-lg">🤝</span> Be kind and supportive</li>
                            <li className="flex gap-2 items-start"><span className="text-lg">🤐</span> Respect privacy</li>
                            <li className="flex gap-2 items-start"><span className="text-lg">⚠️</span> No medical advice from non-doctors</li>
                        </ul>
                    </div>
                </div>

                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Filter/Search Bar (Optional enhancement) */}
                    <div className="flex gap-4 mb-2">
                        <input type="text" placeholder="Search discussions..." className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-pink transition" />
                        <select className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-pink cursor-pointer">
                            <option>Latest</option>
                            <option>Top Liked</option>
                            <option>Most Replied</option>
                        </select>
                    </div>

                    {filteredPosts.map(post => (
                        <div key={post.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl border border-gray-200">
                                    {post.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                                {post.author}
                                                {post.authorRole === 'Verified Doctor' && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-200 font-bold">Doctor</span>}
                                                {post.authorRole === 'Mom-to-be' && <span className="text-[10px] bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full font-bold">Mom-to-be</span>}
                                            </h4>
                                            <p className="text-xs text-gray-500">{post.time} • <span className="text-primary-pink font-medium">{post.category}</span></p>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600">...</button>
                                    </div>

                                    <Link to={`/forum/${post.id}`} className="block group">
                                        <h3 className="font-bold text-lg text-gray-800 mt-3 mb-2 group-hover:text-primary-pink transition">{post.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.content}</p>
                                    </Link>

                                    <div className="flex items-center gap-6 border-t border-gray-50 pt-4">
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className={`flex items-center gap-2 text-sm font-bold transition ${post.liked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'}`}
                                        >
                                            <span className="text-xl">{post.liked ? '❤️' : '🤍'}</span> {post.likes}
                                        </button>
                                        <Link to={`/forum/${post.id}`} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-500 transition">
                                            <span className="text-xl">💬</span> {post.replies} Replies
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default CommunityForum;
