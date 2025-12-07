import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, Heart, Share2, Filter, Plus,
    Search, User, Send, X, MoreHorizontal, ThumbsUp
} from 'lucide-react';
import communityService from '../services/communityService';
import { useAuth } from '../context/AuthContext';

const CommunityForum = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // New Post Form State
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        category: 'General',
        tags: '',
        isAnonymous: false
    });

    const categories = ['All', 'Health', 'Pregnancy', 'Period', 'Mental Wellness', 'Relationships', 'Career', 'Motherhood'];

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const params = filter !== 'All' ? { category: filter } : {};
            const response = await communityService.getPosts(params);
            if (response.success) {
                setPosts(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const tagsArray = newPost.tags.split(',').map(tag => tag.trim()).filter(t => t);
            const postData = {
                ...newPost,
                userName: user?.name || 'Anonymous',
                tags: tagsArray
            };

            const response = await communityService.createPost(postData);
            if (response.success) {
                setIsCreateModalOpen(false);
                setNewPost({ title: '', content: '', category: 'General', tags: '', isAnonymous: false });
                fetchPosts(); // Refresh list
            }
        } catch (error) {
            console.error('Failed to create post', error);
        }
    };

    const handleLike = async (postId) => {
        try {
            const response = await communityService.likePost(postId);
            if (response.success) {
                setPosts(posts.map(p =>
                    p._id === postId ? { ...p, likes: response.data.likes } : p
                ));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="font-sans text-gray-800 min-h-screen pb-10">
            {/* Header Section */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
                    Women's Community
                </h1>
                <p className="text-gray-600 max-w-2xl">
                    A safe space to share your experiences, ask questions, and support each other.
                    You are not alone in your journey.
                </p>
            </motion.div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                {/* Categories */}
                <div className="flex overflow-x-auto pb-2 w-full md:w-auto gap-2 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${filter === cat
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Create Button */}
                <motion.button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={20} />
                    <span>Share Details</span>
                </motion.button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Posts Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                            <MessageCircle size={48} className="mx-auto text-pink-200 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700">No posts yet</h3>
                            <p className="text-gray-500">Be the first to share your story!</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostCard key={post._id} post={post} onLike={() => handleLike(post._id)} />
                        ))
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="hidden lg:block space-y-6">
                    <TrendingTags />
                    <CommunityGuidelines />
                </div>
            </div>

            {/* Create Post Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <CreatePostModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSubmit={handleCreatePost}
                        newPost={newPost}
                        setNewPost={setNewPost}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-components

const PostCard = ({ post, onLike }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Author Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${post.isAnonymous ? 'bg-gray-400' : 'bg-gradient-to-br from-pink-400 to-purple-500'
                        }`}>
                        {post.isAnonymous ? <User size={20} /> : post.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 text-sm">
                            {post.isAnonymous ? 'Anonymous Member' : post.user.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="text-pink-500 font-medium">{post.category}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h3>
                <p className={`text-gray-600 leading-relaxed text-sm ${!isExpanded && 'line-clamp-3'}`}>
                    {post.content}
                </p>
                {post.content.length > 150 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-pink-600 text-sm font-semibold mt-2 hover:underline"
                    >
                        {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onLike}
                        className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors group"
                    >
                        <Heart size={18} className={post.likes > 0 ? "fill-pink-50 text-pink-600" : "group-hover:scale-110 transition-transform"} />
                        <span className="text-sm font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors">
                        <MessageCircle size={18} />
                        <span className="text-sm font-medium">{post.comments.length}</span>
                    </button>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <Share2 size={18} />
                </button>
            </div>
        </motion.div>
    );
};

const CreatePostModal = ({ isOpen, onClose, onSubmit, newPost, setNewPost }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-pink-50 to-purple-50">
                    <h3 className="text-xl font-bold text-gray-800">Share Your Story</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            placeholder="Give your post a title..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                            <select
                                value={newPost.category}
                                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 outline-none bg-white"
                            >
                                <option>General</option>
                                <option>Health</option>
                                <option>Pregnancy</option>
                                <option>Period</option>
                                <option>Mental Wellness</option>
                                <option>Relationships</option>
                                <option>Career</option>
                                <option>Motherhood</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tags</label>
                            <input
                                type="text"
                                value={newPost.tags}
                                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                                placeholder="advice, help (comma separated)"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                        <textarea
                            required
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            rows={5}
                            placeholder="Share your experience..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="anon"
                            checked={newPost.isAnonymous}
                            onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                            className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                        />
                        <label htmlFor="anon" className="text-sm text-gray-600">Post Anonymously</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all"
                    >
                        Post to Community
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

const TrendingTags = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🔥</span> Trending Topics
        </h3>
        <div className="flex flex-wrap gap-2">
            {['#MorningSickness', '#Yoga', '#MentalHealth', '#DietTips', '#FirstTimeMom', '#PeriodPain'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-gray-50 hover:bg-pink-50 text-gray-600 hover:text-pink-600 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                    {tag}
                </span>
            ))}
        </div>
    </div>
);

const CommunityGuidelines = () => (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Guidelines</h3>
        <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Be kind and respectful to others.
            </li>
            <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                No hate speech or bullying.
            </li>
            <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Respect privacy and anonymity.
            </li>
            <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Support each other!
            </li>
        </ul>
    </div>
);

export default CommunityForum;
