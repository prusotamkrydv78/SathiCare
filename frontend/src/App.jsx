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

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/track" element={<PeriodTracker />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/health-details" element={<HealthDetails />} />
        <Route path="/pregnancy-tracker" element={<PregnancyTracker />} />
        <Route path="/find-facility" element={<FacilityFinder />} />
        <Route path="/facility/:id" element={<FacilityDetails />} />
        <Route path="/ai-chat" element={<AiAssistant />} />
        <Route path="/library" element={<ContentLibrary />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/records" element={<HealthRecords />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/appointments" element={<AppointmentCalendar />} />
        <Route path="/emergency" element={<EmergencyAccess />} />
      </Routes>
    </Router>
  )
}

export default App
