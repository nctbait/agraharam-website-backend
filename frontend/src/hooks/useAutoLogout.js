import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTO_LOGOUT_MINUTES = 15;

export default function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }, AUTO_LOGOUT_MINUTES * 60 * 1000);
    };

    const activityEvents = ["mousemove", "keydown", "click", "scroll"];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
  }, [navigate]);
}
