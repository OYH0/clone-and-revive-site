
import { useState, useCallback } from 'react';

export const useCamerinoAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticate = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const reset = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const checkCamerinoAccess = useCallback((empresa: string): boolean => {
    if (empresa === 'Camerino' && !isAuthenticated) {
      return false;
    }
    return true;
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    checkCamerinoAccess,
    authenticate,
    reset
  };
};
