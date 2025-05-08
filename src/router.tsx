import { createBrowserRouter } from 'react-router-dom';
import SignUp from './pages/auth/signup';
import SignIn from './pages/auth/signin';
import TenantDashboard from './pages/tenant/dashboard';
import LandlordDashboard from './pages/landlord/dashboard';

export const router = createBrowserRouter([
  {
    path: '/auth/signup',
    element: <SignUp />,
  },
  {
    path: '/auth/signin',
    element: <SignIn />,
  },
  {
    path: '/tenant/dashboard',
    element: <TenantDashboard />,
  },
  {
    path: '/landlord/dashboard',
    element: <LandlordDashboard />,
  },
]);