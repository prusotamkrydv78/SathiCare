import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar,
    Baby,
    Stethoscope,
    MessageCircle,
    CalendarCheck,
    UserRound,
    Users,
    FolderOpen,
    Bell,
    Settings,
    AlertCircle,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Heart
} from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
            setIsCollapsed(JSON.parse(savedState));
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const navSections = [
        {
            title: 'HEALTH TRACKING',
            items: [
                { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { path: '/track', label: 'Period Tracker', icon: Calendar },
                { path: '/pregnancy-tracker', label: 'Pregnancy', icon: Baby },
                { path: '/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
            ]
        },
        {
            title: 'CARE & SUPPORT',
            items: [
                { path: '/ai-chat', label: 'AI Assistant', icon: MessageCircle, badge: 'AI' },
                { path: '/appointments', label: 'Appointments', icon: CalendarCheck },
                { path: '/consultations', label: 'Find Doctors', icon: UserRound },
                { path: '/forum', label: 'Community', icon: Users },
                { path: '/records', label: 'Health Records', icon: FolderOpen },
            ]
        },
        {
            title: 'ACCOUNT',
            items: [
                { path: '/notifications', label: 'Notifications', icon: Bell, badge: 12 },
                { path: '/profile-settings', label: 'Settings', icon: Settings },
            ]
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Mobile Header */}
            <motion.header
                className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3 flex items-center justify-between"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                            S
                        </div>
                        <span className="font-bold text-gray-800">SaathiCare</span>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            className="md:hidden fixed inset-0 bg-black/50 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.aside
                            className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl overflow-y-auto"
                            initial={{ x: -288 }}
                            animate={{ x: 0 }}
                            exit={{ x: -288 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <SidebarContent
                                user={user}
                                navSections={navSections}
                                isActive={isActive}
                                isCollapsed={false}
                                handleLogout={handleLogout}
                                isMobile={true}
                                onClose={() => setIsMobileMenuOpen(false)}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.aside
                className={`hidden md:flex flex-col fixed h-full bg-white border-r border-gray-100 z-30`}
                style={{ width: isCollapsed ? '70px' : '260px' }}
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <SidebarContent
                    user={user}
                    navSections={navSections}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                    toggleSidebar={toggleSidebar}
                    handleLogout={handleLogout}
                    isMobile={false}
                />
            </motion.aside>

            {/* Main Content */}
            <main
                className="flex-1 pt-16 md:pt-0"
                style={{ marginLeft: isCollapsed ? '70px' : '260px' }}
            >
                <div className="p-4 md:p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

const SidebarContent = ({ user, navSections, isActive, isCollapsed, toggleSidebar, handleLogout, isMobile, onClose }) => {
    return (
        <>
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                        S
                    </div>
                    {(!isCollapsed || isMobile) && (
                        <span className="font-bold text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            SaathiCare
                        </span>
                    )}
                </div>
                {isMobile ? (
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                ) : (
                    !isCollapsed && (
                        <button onClick={toggleSidebar} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                    )
                )}
            </div>

            {/* User Profile */}
            {(!isCollapsed || isMobile) && (
                <Link to="/profile-settings">
                    <motion.div
                        className="p-4 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                        whileHover={{ x: 2 }}
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                                {user?.name || 'Stuart Kirkland'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email || 'user@example.com'}
                            </p>
                        </div>
                        <Heart className="w-4 h-4 text-pink-500 flex-shrink-0" />
                    </motion.div>
                </Link>
            )}

            {/* Collapsed Avatar */}
            {isCollapsed && !isMobile && (
                <div className="p-3 border-b border-gray-100 flex justify-center">
                    <Link to="/profile-settings">
                        <div className="w-11 h-11 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm cursor-pointer hover:scale-110 transition-transform">
                            {user?.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                    </Link>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                {navSections.map((section) => (
                    <div key={section.title} className="mb-5">
                        {(!isCollapsed || isMobile) && (
                            <h3 className="px-3 mb-2 text-[10px] font-bold text-gray-400 tracking-wider">
                                {section.title}
                            </h3>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);

                                return (
                                    <Link key={item.path} to={item.path}>
                                        <motion.div
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active
                                                    ? 'bg-pink-50 text-pink-600'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            whileHover={{ x: active ? 0 : 3 }}
                                        >
                                            <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-pink-600' : 'text-gray-500'}`} />
                                            {(!isCollapsed || isMobile) && (
                                                <>
                                                    <span className="font-medium text-sm flex-1">
                                                        {item.label}
                                                    </span>
                                                    {item.badge && (
                                                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${typeof item.badge === 'number'
                                                                ? 'bg-pink-600 text-white'
                                                                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                                            }`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            {isCollapsed && !isMobile && item.badge && typeof item.badge === 'number' && (
                                                <div className="absolute right-1.5 top-1.5 w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                                            )}
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Emergency Button */}
            <div className="p-3">
                <Link to="/emergency">
                    <motion.div
                        className={`${isCollapsed && !isMobile
                                ? 'w-11 h-11 mx-auto flex items-center justify-center'
                                : 'p-4'
                            } bg-gradient-to-r from-pink-600 to-pink-500 rounded-xl text-white text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isCollapsed && !isMobile ? (
                            <AlertCircle className="w-5 h-5" />
                        ) : (
                            <>
                                <AlertCircle className="w-6 h-6 mx-auto mb-1.5" />
                                <p className="font-bold text-sm">Emergency</p>
                                <p className="text-xs opacity-90">Get Help Now</p>
                            </>
                        )}
                    </motion.div>
                </Link>
            </div>

            {/* Logout */}
            <div className="p-3 border-t border-gray-100">
                <motion.button
                    onClick={handleLogout}
                    className={`${isCollapsed && !isMobile
                            ? 'w-11 h-11 mx-auto justify-center'
                            : 'w-full justify-start'
                        } flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm`}
                    whileHover={{ x: isCollapsed ? 0 : 3 }}
                >
                    <LogOut className="w-5 h-5" />
                    {(!isCollapsed || isMobile) && <span>Logout</span>}
                </motion.button>
            </div>

            {/* Expand Button (when collapsed) */}
            {isCollapsed && !isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                >
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                </button>
            )}
        </>
    );
};

export default Layout;
