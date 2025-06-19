
import { useAuth } from '@/contexts/AuthContext';

export const useSession = () => {
  const { user, session, loading } = useAuth();
  
  return {
    data: session ? { user, session } : null,
    status: loading ? 'loading' : session ? 'authenticated' : 'unauthenticated'
  };
};
