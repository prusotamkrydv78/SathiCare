import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
    const detailedFeatures = [
        {
            title: "Period Tracker with AI Insights",
            icon: "🌸",
            color: "pink",
            workflow: [
                "User Logs Data (Cycle, Symptoms, Mood)",
                "Database Saves Securely",
                "AI Analyzes Trends (Predicts Phase + Detects Issues)",
                "System Triggers personalized Alerts",
                "User Sees Smart Calendar + Daily Tips",
                "Option to Consult Doctor directly if issues found"
            ],
            link: "/track",
            btnText: "Start Tracking"
        },
        {
            title: "Pregnancy Companion with AI Support",
            icon: "🤰",
            color: "purple",
            workflow: [
                "User enters pregnancy week & health info",
                "AI analyzes development weekly",
                "App provides tailored safety tips + alerts",
                "User tracks week-by-week baby progress",
                "AI answers maternal health queries instantly"
            ],
            link: "/pregnancy-tracker",
            btnText: "View Companion"
        },
        {
            title: "Find Healthcare Services",
            icon: "🏥",
            color: "blue",
            workflow: [
                "App detects User Location",
                "Fetches nearby hospitals, clinics, pharmacies",
                "User filters by specialty or rating",
                "View Interactive Map + Facility List",
                "Click for details / one-tap call / directions"
            ],
            link: "/find-facility",
            btnText: "Find Facilities"
        },
        {
            title: "AI Health Assistant + Doctor Consultations",
            icon: "🤖",
            color: "indigo",
            workflow: [
                "User chooses: Ask AI or Book Doctor",
                "AI analyzes symptoms & advises immediately",
                "OR Doctor provides professional consultation",
                "User receives actionable guidance",
                "AI logs data for future health personalization"
            ],
            link: "/ai-chat",
            btnText: "Ask AI Now"
        },
        {
            title: "Emergency SOS",
            icon: "🆘",
            color: "red",
            workflow: [
                "User presses big SOS button",
                "App sends immediate Location + SMS Alerts",
                "Nearby hospitals & emergency contacts notified",
                "AI provides real-time First-Aid tips",
                "Voice Call feature connects to Ambulance (102)"
            ],
            link: "/emergency",
            btnText: "Open SOS"
        },
        {
            title: "Health Library",
            icon: "📚",
            color: "green",
            workflow: [
                "User opens Health Library",
                "App fetches curated, verified content",
                "AI recommends personalized articles based on health data",
                "User reads & interacts (saves/likes)",
                "Optional AI Q&A for specific article topics"
            ],
            link: "/library",
            btnText: "Browse Library"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24">

            {/* Header */}
            <div className="bg-white p-6 sticky top-0 z-20 shadow-sm border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-gray-500 hover:text-gray-700 transition">← Back</Link>
                    <h1 className="text-xl font-bold text-gray-800">Sathi Features</h1>
                </div>
            </div>

            {/* Intro */}
            <div className="bg-primary-pink/10 p-12 text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">How Sathi Works</h2>
                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                    Explore the powerful workflows designed to support women's health at every stage.
                </p>
            </div>

            {/* Detailed Features List */}
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                {detailedFeatures.map((feature, index) => (
                    <div key={index} className={`bg-white rounded-3xl p-8 shadow-sm border-l-4 border-${feature.color}-500 hover:shadow-lg transition duration-300`}>
                        <div className="flex flex-col md:flex-row gap-6">

                            {/* Icon & Title */}
                            <div className="md:w-1/3 flex flex-col items-start">
                                <span className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-${feature.color}-50 text-${feature.color}-600 mb-4`}>
                                    {feature.icon}
                                </span>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                                <Link to={feature.link} className={`px-6 py-2.5 rounded-xl font-bold text-white text-sm bg-${feature.color}-500 hover:bg-${feature.color}-600 transition shadow-${feature.color}-200 shadow-md`}>
                                    {feature.btnText} →
                                </Link>
                            </div>

                            {/* Workflow Steps */}
                            <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 pt-6 md:pt-0">
                                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Workflow</h4>
                                <ul className="space-y-4">
                                    {feature.workflow.map((step, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-700">
                                            <div className={`mt-1 w-5 h-5 rounded-full bg-${feature.color}-100 text-${feature.color}-600 flex items-center justify-center text-[10px] font-bold shrink-0`}>
                                                {i + 1}
                                            </div>
                                            <span className="leading-relaxed">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-12 mb-8">
                <Link to="/signup" className="text-primary-pink font-bold hover:underline">
                    Ready to get started? Join Sathi today
                </Link>
            </div>

        </div>
    );
};

export default FeaturesPage;
