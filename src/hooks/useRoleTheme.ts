
import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserRole } from '@/hooks/useUserRole';

export const useRoleTheme = () => {
  const { setRoleTheme } = useTheme();
  const { isAdmin, isLandlord, isVendor, isTenant } = useUserRole();

  useEffect(() => {
    if (isAdmin()) {
      setRoleTheme('admin');
    } else if (isLandlord()) {
      setRoleTheme('landlord');
    } else if (isVendor()) {
      setRoleTheme('vendor');
    } else if (isTenant()) {
      setRoleTheme('tenant');
    } else {
      setRoleTheme('default');
    }
  }, [isAdmin, isLandlord, isVendor, isTenant, setRoleTheme]);
};
