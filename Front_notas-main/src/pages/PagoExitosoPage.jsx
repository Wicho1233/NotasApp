import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PagoExitosoPage({ goToPrincipal }) {
  const [estado, setEstado] = useState('verificando');

  useEffect(() => {
    let ignore = false;

    // Leemos los parámetros directamente usando JS Nativo para evitar usar hooks del Router
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get('session_id');
    const userId = searchParams.get('user_id');

    const verificarPago = async () => {
      if (!sessionId || !userId) {
        setEstado('error');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/verificar-pago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            session_id: sessionId, 
            id_usuario: userId,
            user_id: userId
          })
        });

        const data = await response.json();

        if (ignore) return;

        if (data.status === 'success') {
          setEstado('exito');
          
          const datosSesion = localStorage.getItem('usuario_sesion');
          const usuarioActual = datosSesion ? JSON.parse(datosSesion) : {};
          
          localStorage.setItem('usuario_sesion', JSON.stringify({
            ...usuarioActual,
            tipo_usuario: 'premium'
          }));
          
          toast.success('¡Ahora eres Premium!');
        } else {
          setEstado('error');
        }
      } catch (error) {
        console.error(error);
        if (!ignore) setEstado('error');
      }
    };

    verificarPago();

    return () => {
      ignore = true;
    };
  }, []);

  // Limpia los parámetros de Stripe en la URL al regresar al Dashboard
  const manejarRegreso = () => {
    window.history.replaceState({}, document.title, "/");
    goToPrincipal();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      {estado === 'verificando' && (
        <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full">
          <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700">Verificando tu pago...</h2>
          <p className="text-gray-500 text-sm mt-1">Por favor, no cierres ni recargues la página.</p>
        </div>
      )}

      {estado === 'exito' && (
        <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pago exitoso!</h2>
          <p className="text-gray-600 mb-6">Tu cuenta ha sido actualizada. Gracias por suscribirte a Premium.</p>
          <button 
            onClick={manejarRegreso}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Ir al Dashboard
          </button>
        </div>
      )}

      {estado === 'error' && (
        <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full">
          <XCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Error al verificar el pago</h2>
          <p className="text-gray-600 mt-2 text-sm">
            No pudimos validar tu suscripción en el servidor. Si el cobro se realizó en tu tarjeta, contacta a soporte técnico.
          </p>
          <button 
            onClick={manejarRegreso} 
            className="w-full mt-6 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      )}
    </div>
  );
}