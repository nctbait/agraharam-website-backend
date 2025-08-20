// AuthContext.js
import { createContext, useState } from 'react';
import { clearToken, triggerLogout } from '../auth/token';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('guest');

  const logout = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      //localStorage.removeItem('jwtToken');
      clearToken();
      setUserRole('guest');
      triggerLogout("Signed out.");
    }
  };

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
