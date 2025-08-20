import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function SessionBoundary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserRole } = useContext(AuthContext);

  useEffect(() => {
    const onLogout = (e) => {
      const msg = e?.detail?.reason || 'Signed out.';
      // Clear app auth state
      localStorage.removeItem('jwtToken');
      setUserRole('guest');
      sessionStorage.setItem('logout.msg', msg); // <-- fallback if router state is lost

      // Avoid infinite redirects: if we’re already on /login, just replace state
      if (location.pathname === '/login') {
        navigate('/login', { replace: true, state: { msg } });
      } else {
        navigate('/login', { replace: true, state: { msg } });
      }
    };

    window.addEventListener('app:logout', onLogout);
    return () => window.removeEventListener('app:logout', onLogout);
  }, [navigate, location.pathname, setUserRole]);

  return null;
}
