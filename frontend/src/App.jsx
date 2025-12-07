import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DialogProvider } from './context/DialogContext';
import ProtectedRoute from './component/ProtectedRoute';
import ScrollToTopOnMount from './component/ScrollToTopOnMount';
import LandingPage from './component/LandingPage'
import LoginPage from './component/LoginPage';
import SignupPage from './component/SignupPage';
import Dashboard from './component/Dashboard';
import PeriodTracker from './component/PeriodTracker';
import CompleteProfile from './component/CompleteProfile';
import HealthDetails from './component/HealthDetails';
import PregnancyTracker from './component/PregnancyTrackerNew';
import FacilityFinder from './component/FacilityFinder';
import FacilityDetails from './component/FacilityDetails';
import AiAssistant from './component/AiAssistant';
import ContentLibrary from './component/ContentLibrary';
import ArticlePage from './component/ArticlePage';
import HealthRecords from './component/HealthRecords';
import ProfileSettings from './component/ProfileSettings';
import AppointmentCalendar from './component/AppointmentCalendar';
// EmergencyAccess removed - using SOSPage instead
import FeaturesPage from './component/FeaturesPage';
import TestimonialsPage from './component/TestimonialsPage';
import CommunityForum from './component/CommunityForum';
import DoctorConsultations from './component/DoctorConsultations';
import NotificationsPage from './component/NotificationsPage';
import AboutPage from './component/AboutPage';
import SymptomChecker from './component/SymptomChecker';
import HealthAssistant from './component/HealthAssistant';
import ConsultationChat from './component/consultations/ConsultationChat';
import FindCare from './component/FindCare';
import HospitalDetails from './component/HospitalDetails';
import SOSPage from './component/SOSPage';
import ProfileManage from './component/ProfileManage';
import Layout from './component/Layout';
import PublicLayout from './component/PublicLayout';

function App() {
  return (
    <Router>
      <ScrollToTopOnMount />
      <AuthProvider>
        <DialogProvider>
          <Routes>
            {/* Public Routes with PublicLayout */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/features" element={<PublicLayout><FeaturesPage /></PublicLayout>} />
            <Route path="/testimonials" element={<PublicLayout><TestimonialsPage /></PublicLayout>} />
            <Route path="/hospital/:id" element={<HospitalDetails />} />
            <Route path="/sos" element={<SOSPage />} />

            {/* Protected Routes with Layout */}
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/track" element={<ProtectedRoute><Layout><PeriodTracker /></Layout></ProtectedRoute>} />
            <Route path="/complete-profile" element={<ProtectedRoute><Layout><CompleteProfile /></Layout></ProtectedRoute>} />
            <Route path="/health-details" element={<ProtectedRoute><Layout><HealthDetails /></Layout></ProtectedRoute>} />
            <Route path="/pregnancy-tracker" element={<ProtectedRoute><Layout><PregnancyTracker /></Layout></ProtectedRoute>} />
            <Route path="/find-facility" element={<ProtectedRoute><Layout><FacilityFinder /></Layout></ProtectedRoute>} />
            <Route path="/facility/:id" element={<ProtectedRoute><Layout><FacilityDetails /></Layout></ProtectedRoute>} />
            <Route path="/ai-chat" element={<ProtectedRoute><Layout><AiAssistant /></Layout></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><Layout><ContentLibrary /></Layout></ProtectedRoute>} />
            <Route path="/article/:id" element={<ProtectedRoute><Layout><ArticlePage /></Layout></ProtectedRoute>} />
            <Route path="/records" element={<ProtectedRoute><Layout><HealthRecords /></Layout></ProtectedRoute>} />
            <Route path="/profile-settings" element={<ProtectedRoute><Layout><ProfileSettings /></Layout></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><Layout><AppointmentCalendar /></Layout></ProtectedRoute>} />
            <Route path="/emergency" element={<ProtectedRoute><Layout><SOSPage /></Layout></ProtectedRoute>} />
            <Route path="/forum" element={<ProtectedRoute><Layout><CommunityForum /></Layout></ProtectedRoute>} />
            <Route path="/consultations" element={<ProtectedRoute><Layout><DoctorConsultations /></Layout></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Layout><NotificationsPage /></Layout></ProtectedRoute>} />
            <Route path="/symptom-checker" element={<ProtectedRoute><Layout><SymptomChecker /></Layout></ProtectedRoute>} />
            <Route path="/health-assistant" element={<ProtectedRoute><Layout><HealthAssistant /></Layout></ProtectedRoute>} />
            <Route path="/consultations/:appointmentId/chat" element={<ProtectedRoute><ConsultationChat /></ProtectedRoute>} />
            <Route path="/find-care" element={<ProtectedRoute><Layout><FindCare /></Layout></ProtectedRoute>} />
            <Route path="/profile-manage" element={<ProtectedRoute><Layout><ProfileManage /></Layout></ProtectedRoute>} />
          </Routes>
        </DialogProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
