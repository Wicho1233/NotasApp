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
    const path = window.location.pathname;

    // 🔥 PRIORIDAD: rutas de Stripe (NO dependen del login)
    if (path.includes('pago-exitoso')) {
      setPage('pago-exitoso');
      return;
    }

    if (path.includes('pago-cancelado')) {
      setPage('principal'); // puedes cambiarlo si haces una página cancelado
      return;
    }

    // 🔐 Flujo normal
    if (usuario) {
      setPage('principal');
    } else {
      setPage('login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario_sesion');
    setPage('login');
    window.history.replaceState({}, document.title, "/");
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
          goToPrincipal={() => {
            window.history.replaceState({}, document.title, "/");
            setPage('principal');
          }}
        />
      )}
    </>
  );
}

export default App;