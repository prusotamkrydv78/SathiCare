import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './component/ProtectedRoute';
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

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/track" element={<ProtectedRoute><PeriodTracker /></ProtectedRoute>} />
          <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
          <Route path="/health-details" element={<ProtectedRoute><HealthDetails /></ProtectedRoute>} />
          <Route path="/pregnancy-tracker" element={<ProtectedRoute><PregnancyTracker /></ProtectedRoute>} />
          <Route path="/find-facility" element={<ProtectedRoute><FacilityFinder /></ProtectedRoute>} />
          <Route path="/facility/:id" element={<ProtectedRoute><FacilityDetails /></ProtectedRoute>} />
          <Route path="/ai-chat" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><ContentLibrary /></ProtectedRoute>} />
          <Route path="/article/:id" element={<ProtectedRoute><ArticlePage /></ProtectedRoute>} />
          <Route path="/records" element={<ProtectedRoute><HealthRecords /></ProtectedRoute>} />
          <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><AppointmentCalendar /></ProtectedRoute>} />
          <Route path="/emergency" element={<ProtectedRoute><EmergencyAccess /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
