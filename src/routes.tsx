import { createBrowserRouter } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import LandlordDashboard from './pages/landlord/Dashboard';
import TenantDashboard from './pages/tenant/Dashboard';
import RootLayout from './layouts/RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'auth/signup',
        element: <SignUp />,
      },
      {
        path: 'auth/signin',
        element: <SignIn />,
      },
      {
        path: 'landlord/dashboard',
        element: <LandlordDashboard />,
      },
      {
        path: 'tenant/dashboard',
        element: <TenantDashboard />,
      },
    ],
  },
]);