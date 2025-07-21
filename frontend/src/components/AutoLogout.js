// AutoLogout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AutoLogout({ logoutAfter = 30 * 60 * 1000, onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (onLogout) onLogout();
        navigate('/login');
      }, logoutAfter);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [navigate, logoutAfter, onLogout]);

  return null;
}
