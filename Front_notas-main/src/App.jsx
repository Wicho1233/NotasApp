import { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrincipalPage from './pages/PrincipalPage';
import PagoExitosoPage from './pages/PagoExitosoPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const [page, setPage] = useState('login');

  useEffect(() => {
    const usuario = localStorage.getItem('usuario_sesion');
    const params = new URLSearchParams(window.location.search);
    
    const tieneSessionId = params.has('session_id');
    const esRutaPago = window.location.pathname.includes('pago-exitoso');

    if ((tieneSessionId || esRutaPago) && usuario) {
      setPage('pago-exitoso');
    } else if (usuario) {
      setPage('principal');
    } else {
      setPage('login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario_sesion');
    setPage('login');
  };

  return (
    <>
      <Toaster position="top-right" />

      {page === 'login' && (
        <LoginPage
          goToRegister={() => setPage('register')}
          goToPrincipal={() => setPage('principal')}
        />
      )}

      {page === 'register' && (
        <RegisterPage
          goToLogin={() => setPage('login')}
        />
      )}

      {page === 'principal' && (
        <PrincipalPage
          logout={handleLogout}
        />
      )}

      {page === 'pago-exitoso' && (
        <PagoExitosoPage
          goToPrincipal={() => setPage('principal')}
        />
      )}
    </>
  );
}

export default App;