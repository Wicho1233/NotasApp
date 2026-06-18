import { Crown, CreditCard, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Premium({ abierto, cerrar }) {

  const iniciarPago = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario_sesion'));
    
    if (!usuario || !usuario.id) {
      toast.error('Inicia sesión para continuar');
      return;
    }

    try {
      const response = await fetch('https://notasapp-1.onrender.com/crear-sesion-pago', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ id_usuario: usuario.id })
      });

     
      const textoRespuesta = await response.text();
      
      let data;
      try {
        data = JSON.parse(textoRespuesta);
      } catch (e) {
        console.error("Error de servidor (Respuesta no es JSON):", textoRespuesta);
        toast.error("Error: El servidor no devolvió un formato válido. Revisa la consola.");
        return;
      }

      if (data.status === 'success') {
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Error al conectar con Stripe');
      }

    } catch (error) {
      console.error("Error de conexión:", error);
      toast.error('Error al conectar con la pasarela de pagos');
    }
  };

  return (
    <div
      className={`
        fixed inset-0 bg-black/40 flex items-center justify-center z-50
        transition-all duration-300
        ${abierto ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
      `}
    >
      <div
        className={`
          relative
          w-[450px]
          rounded-2xl
          bg-yellow-200
          border-2 border-yellow-400
          p-8
          shadow-[0_0_40px_rgba(250,204,21,0.7)]
          transition-all duration-300
          ${abierto ? "scale-100" : "scale-90"}
        `}
      >
        <button
          onClick={cerrar}
          className="absolute top-4 right-4 text-yellow-900 hover:text-black"
        >
          <X size={22} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
            <Crown size={40} className="text-blue-900" />
          </div>

          <h2 className="text-3xl font-bold text-black">
            Premium
          </h2>

          <p className="mt-4 text-black font-serif">
            Desbloquea todas las funciones avanzadas de la plataforma.
          </p>

          <ul className="mt-6 text-left space-y-2 text-black font-mono">
            <li> Workspaces ilimitados</li>
            <li> Notas ilimitadas</li>
            <li> Poder agregar imágenes a tus notas</li>
          </ul>

          <button
            onClick={iniciarPago}
            className="mt-8 flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-900 transition-all"
          >
            <CreditCard size={20} />
            PAGAR CON STRIPE
          </button>
        </div>
      </div>
    </div>
  );
}