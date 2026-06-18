import { BadgePlus, Pin, PinOff } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Creacion from '../components/Creacion';

export default function DashboardPage({
  workspaces,
  setWorkspaces,
  refrescarWorkspaces,
}) {
  const [abrirModal, setAbrirModal] = useState(false);
  const [nombreWorkspace, setNombreWorkspace] = useState('');

  const crearWorkspace = async () => {
    if (!nombreWorkspace.trim()) {
      toast.error('Introduce un nombre para el workspace');
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario_sesion'));
    if (!usuario || !usuario.id) {
      toast.error('Sesión inválida. Por favor, inicia sesión de nuevo.');
      return;
    }

    try {
      const response = await fetch('https://notasapp-1.onrender.com/espacios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreWorkspace,
          id_usuario: usuario.id,
          accion: 'crear'
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success(data.message || 'Workspace creado');
        setNombreWorkspace('');
        setAbrirModal(false);
        if (refrescarWorkspaces) {
          await refrescarWorkspaces();
        }
      } else if (data.status === 'limite') {
        toast.error(data.message || 'Límite de espacios alcanzado. Actualiza a Premium.');
      } else {
        toast.error(data.message || 'Error al crear el espacio');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor');
    }
  };

  const notasRecientes = Array.isArray(workspaces)
    ? workspaces
        .flatMap((workspace) =>
          Array.isArray(workspace.notas)
            ? workspace.notas.map((nota) => ({
                ...nota,
                workspace: workspace.nombre,
              }))
            : []
        )
        .slice(-6)
        .reverse()
    : [];

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">
        Notas recientes
      </h2>

      {notasRecientes.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-10 text-center">
          <PinOff size={42} className="mx-auto text-amber-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">
            No hay notas recientes
          </h3>
          <p className="text-gray-600 mt-2">
            Las notas que crees aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notasRecientes.map((nota) => (
            <div
              key={nota.id}
              className="relative rounded-xl border border-amber-200 bg-amber-50 p-5 transition-all hover:border-amber-300"
            >
              <Pin size={18} className="absolute top-4 right-4 text-red-600" />
              <h3 className="font-semibold text-lg text-gray-800 pr-8">
                {nota.titulo}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {nota.workspace}
              </p>
              <p className="text-gray-700 whitespace-pre-wrap">
                {nota.contenido}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setAbrirModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all duration-200 flex items-center justify-center"
      >
        <BadgePlus size={28} />
      </button>

      <Creacion
        abierto={abrirModal}
        cerrar={() => setAbrirModal(false)}
        nombreWorkspace={nombreWorkspace}
        setNombreWorkspace={setNombreWorkspace}
        onWorkspaceCreado={crearWorkspace}
      />
    </>
  );
}