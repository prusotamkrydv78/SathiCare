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
      </Routes>
    </Router>
  )
}

export default App
