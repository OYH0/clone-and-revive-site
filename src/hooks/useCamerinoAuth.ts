
import { useState } from 'react';

export const useCamerinoAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkCamerinoAccess = (empresa: string): boolean => {
    if (empresa === 'Camerino' && !isAuthenticated) {
      return false;
    }
    return true;
  };

  const authenticate = () => {
    setIsAuthenticated(true);
  };

  const reset = () => {
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    checkCamerinoAccess,
    authenticate,
    reset
  };
};
