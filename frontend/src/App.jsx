
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './component/LandingPage'
import LoginPage from './component/LoginPage';
import SignupPage from './component/SignupPage';
import Dashboard from './component/Dashboard';
import PeriodTracker from './component/PeriodTracker';
import CompleteProfile from './component/CompleteProfile';
import HealthDetails from './component/HealthDetails';
import PregnancyTracker from './component/PregnancyTracker';
import FacilityFinder from './component/FacilityFinder';
import FacilityDetails from './component/FacilityDetails';
import AiAssistant from './component/AiAssistant';
import ContentLibrary from './component/ContentLibrary';
import ArticlePage from './component/ArticlePage';
import HealthRecords from './component/HealthRecords';
import ProfileSettings from './component/ProfileSettings';
import AppointmentCalendar from './component/AppointmentCalendar';
import EmergencyAccess from './component/EmergencyAccess';
import FeaturesPage from './component/FeaturesPage';
import TestimonialsPage from './component/TestimonialsPage';
import CommunityForum from './component/CommunityForum';
import DoctorConsultations from './component/DoctorConsultations';
import NotificationsPage from './component/NotificationsPage';
import AboutPage from './component/AboutPage';
import SymptomChecker from './component/SymptomChecker';
import Layout from './component/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Authenticated Routes with Layout */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/track" element={<Layout><PeriodTracker /></Layout>} />
        <Route path="/complete-profile" element={<Layout><CompleteProfile /></Layout>} />
        <Route path="/health-details" element={<Layout><HealthDetails /></Layout>} />
        <Route path="/pregnancy-tracker" element={<Layout><PregnancyTracker /></Layout>} />
        <Route path="/find-facility" element={<Layout><FacilityFinder /></Layout>} />
        <Route path="/facility/:id" element={<Layout><FacilityDetails /></Layout>} />
        <Route path="/ai-chat" element={<Layout><AiAssistant /></Layout>} />
        <Route path="/library" element={<Layout><ContentLibrary /></Layout>} />
        <Route path="/article/:id" element={<Layout><ArticlePage /></Layout>} />
        <Route path="/records" element={<Layout><HealthRecords /></Layout>} />
        <Route path="/profile-settings" element={<Layout><ProfileSettings /></Layout>} />
        <Route path="/appointments" element={<Layout><AppointmentCalendar /></Layout>} />
        <Route path="/emergency" element={<Layout><EmergencyAccess /></Layout>} />
        <Route path="/features" element={<Layout><FeaturesPage /></Layout>} />
        <Route path="/testimonials" element={<Layout><TestimonialsPage /></Layout>} />
        <Route path="/forum" element={<Layout><CommunityForum /></Layout>} />
        <Route path="/consultations" element={<Layout><DoctorConsultations /></Layout>} />
        <Route path="/notifications" element={<Layout><NotificationsPage /></Layout>} />
        <Route path="/symptom-checker" element={<Layout><SymptomChecker /></Layout>} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  )
}

export default App
