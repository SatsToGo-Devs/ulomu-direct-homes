
import { useAuth } from '@/contexts/AuthContext';

export const useSession = () => {
  const { user, loading } = useAuth();
  
  return {
    data: user ? { user } : null,
    status: loading ? 'loading' : user ? 'authenticated' : 'unauthenticated'
  };
};
