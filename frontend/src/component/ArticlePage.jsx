import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ArticlePage = () => {
    const { id } = useParams();

    // Mock Content - in real app, fetch by ID
    const article = {
        title: "The Ultimate Guide to First Trimester Nutrition",
        author: "Dr. Sarah Khan",
        date: "Oct 24, 2025",
        readTime: "5 min read",
        category: "Pregnancy",
        image: "https://images.unsplash.com/photo-1544367563-12123d832d61?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        content: `
            <p>Pregnancy is a time of rapid change for your body, and your nutritional needs shift just as quickly. The first trimester is critical for fetal development, yet it can be challenging due to nausea and food aversions.</p>
            
            <h2>Why Nutrition Matters Early On</h2>
            <p>During the first 12 weeks, your baby's major organs are forming. Essential nutrients like Folic Acid, Iron, and Calcium play a massive role in preventing birth defects and ensuring strong development.</p>

            <ul>
                <li><strong>Folic Acid:</strong> Crucial for neural tube development.</li>
                <li><strong>Iron:</strong> Supports the increase in blood volume.</li>
                <li><strong>Calcium:</strong> Vital for building baby's bones.</li>
            </ul>

            <tip-box>
                <strong>Pro Tip:</strong> If you're struggling with morning sickness, try eating small, frequent meals rather than three large ones. Ginger tea can also be a lifesaver!
            </tip-box>

            <h2>Foods to Focus On</h2>
            <p>Aim for a rainbow on your plate. Leafy greens, citrus fruits, lean proteins, and whole grains should be staples. Don't forget hydration! Water is essential for forming amniotic fluid.</p>
        `
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-700">
            {/* Navigation */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-30 border-b border-gray-100 flex justify-between items-center px-4 py-3">
                <Link to="/library" className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition">
                    <span className="bg-gray-50 p-1.5 rounded-full mr-2 group-hover:bg-gray-100 transition">←</span>
                    Back to Library
                </Link>
                <div className="flex gap-4">
                    <button className="text-gray-400 hover:text-primary-pink transition">♥</button>
                    <button className="text-gray-400 hover:text-blue-500 transition">🔖</button>
                    <button className="text-gray-400 hover:text-gray-800 transition">📤</button>
                </div>
            </div>

            {/* Hero Image */}
            <div className="w-full h-64 md:h-80 relative">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 md:left-1/2 md:-translate-x-1/2 md:max-w-3xl md:w-full px-4 text-white">
                    <span className="bg-primary-pink text-xs font-bold px-2 py-1 rounded mb-2 inline-block shadow-sm">
                        {article.category}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Header Info */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                    {article.title}
                </h1>

                <div className="flex items-center text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600 mr-3">
                        {article.author.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">{article.author}</p>
                        <p>{article.date} • {article.readTime}</p>
                    </div>
                </div>

                {/* Article Body */}
                <div className="prose prose-lg prose-pink max-w-none">
                    {/* Transforming mock HTML to React elements for safety/styling manually for this demo */}
                    <p className="mb-6 leading-relaxed">
                        Pregnancy is a time of rapid change for your body, and your nutritional needs shift just as quickly. The first trimester is critical for fetal development, yet it can be challenging due to nausea and food aversions.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Nutrition Matters Early On</h2>
                    <p className="mb-6 leading-relaxed">
                        During the first 12 weeks, your baby's major organs are forming. Essential nutrients like Folic Acid, Iron, and Calcium play a massive role in preventing birth defects and ensuring strong development.
                    </p>

                    <ul className="list-disc pl-6 space-y-2 mb-8 text-gray-700 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <li><strong className="text-gray-900">Folic Acid:</strong> Crucial for neural tube development.</li>
                        <li><strong className="text-gray-900">Iron:</strong> Supports the increase in blood volume.</li>
                        <li><strong className="text-gray-900">Calcium:</strong> Vital for building baby's bones.</li>
                    </ul>

                    {/* Tip Box */}
                    <div className="my-8 bg-[#E6FFFA] border-l-4 border-[#4ECDC4] p-6 rounded-r-xl shadow-sm">
                        <div className="flex items-start">
                            <span className="text-2xl mr-3">💡</span>
                            <div>
                                <h3 className="font-bold text-teal-800 text-sm uppercase tracking-wide mb-1">Health Tip</h3>
                                <p className="text-teal-900 leading-relaxed">
                                    If you're struggling with morning sickness, try eating small, frequent meals rather than three large ones. Ginger tea can also be a lifesaver!
                                </p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Foods to Focus On</h2>
                    <p className="leading-relaxed mb-6">
                        Aim for a rainbow on your plate. Leafy greens, citrus fruits, lean proteins, and whole grains should be staples. Don't forget hydration! Water is essential for forming amniotic fluid.
                    </p>
                </div>

                {/* Related Articles */}
                <div className="mt-16 pt-10 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition cursor-pointer">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 leading-tight mb-1">Top 5 Prenatal Vitamins</h4>
                                <span className="text-xs text-gray-500">Nutrition • 4 min read</span>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition cursor-pointer">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 leading-tight mb-1">Managing Postpartum Emotions</h4>
                                <span className="text-xs text-gray-500">Mental Health • 8 min read</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating AI Action */}
            <div className="fixed bottom-6 right-6 z-40">
                <Link to="/ai-chat" className="flex items-center gap-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white pl-4 pr-2 py-2 rounded-full shadow-lg shadow-teal-200/50 hover:scale-105 transition transform">
                    <span className="font-bold text-sm">Ask AI about this</span>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🤖</div>
                </Link>
            </div>
        </div>
    );
};

export default ArticlePage;
