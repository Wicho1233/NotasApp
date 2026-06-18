import { UserRound, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Premium from '../components/Premium';

export default function PerfilPage() {
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    tipo_usuario: 'gratis'
  });

  useEffect(() => {
    const datosSesion = localStorage.getItem('usuario_sesion');
    if (datosSesion) {
      const datosParseados = JSON.parse(datosSesion);
      setUsuario({
        nombre: datosParseados.nombre || 'Usuario',
        correo: datosParseados.correo || '',
        tipo_usuario: datosParseados.tipo_usuario || 'gratis'
      });
    }
  }, []);

  return (
    <div className="relative">
      
      {usuario.tipo_usuario !== 'premium' && (
        <button
          onClick={() => setMostrarPremium(true)}
          className="absolute top-0 right-0 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg px-4 py-3 shadow-md transition-all duration-200 flex flex-col items-center gap-1"
        >
          <Crown size={20} />
          <span className="text-xs">PREMIUM</span>
        </button>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-10 border border-gray-100">
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-rose-100 flex items-center justify-center mb-6 shadow-lg relative">
            <UserRound size={80} className="text-rose-600" />
            {usuario.tipo_usuario === 'premium' && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 p-2 rounded-full text-black shadow-md">
                <Crown size={16} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Nombre:</p>
              <p className="font-medium text-lg text-gray-800">{usuario.nombre}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              usuario.tipo_usuario === 'premium' 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              Cuenta {usuario.tipo_usuario}
            </span>
          </div>

          <p className="text-sm text-gray-600 mt-4">Correo:</p>
          <p className="font-medium text-lg text-gray-800">{usuario.correo}</p>
        </div>
      </div>

      <Premium
        abierto={mostrarPremium}
        cerrar={() => setMostrarPremium(false)}
      />
    </div>
  );
}