import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandlordDashboard from './components/Landlord/Dashboard';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import TenantDashboard from './components/Tenant/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/signin" replace />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;