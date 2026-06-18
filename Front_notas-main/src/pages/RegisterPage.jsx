import { useState } from 'react';
import imagenLogin from '../assets/nota.jpg';
import toast from 'react-hot-toast';

export default function RegisterPage({
  goToLogin,
}) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!nombre || !correo || !password) {
      toast.error('Completa todos los campos');
      return;
    }

    try {
      const response = await fetch('https://notasapp-1.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre,
          correo,
          contrasena: password
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success(data.message || 'Usuario registrado correctamente');

        setTimeout(() => {
          goToLogin();
        }, 800);
      } else {
        toast.error(data.message || 'Error al registrar usuario');
      }

    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-gray-100">

      <div className="w-[40%] hidden md:flex">
        <img
          src={imagenLogin}
          alt="Registro"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl w-full max-w-md border border-gray-200">

          <h2 className="text-3xl font-semibold text-slate-700 text-center mb-6">
            Registrarse
          </h2>

          <div className="flex flex-col gap-3">

            <label htmlFor="nombre" className="font-medium text-gray-700">
              Nombre
            </label>

            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border border-gray-300 rounded-lg py-3 px-3"
            />

            <label htmlFor="correo" className="font-medium text-gray-700">
              Correo
            </label>

            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="border border-gray-300 rounded-lg py-3 px-3"
            />

            <label htmlFor="password" className="font-medium text-gray-700">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg py-3 px-3"
            />

            <button
              onClick={handleRegister}
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all mt-4"
            >
              Registrarse
            </button>

            <p className="text-center text-sm mt-2">
              ¿Ya tienes una cuenta?
              <button
                onClick={goToLogin}
                className="ml-1 text-rose-600 hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>

          </div>
        </div>
      </div>

    </div>
  );
}