import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  NotebookPen,
  Pencil,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ListaWorkspacePage({
  workspaces,
  setWorkspaces,
  refrescarWorkspaces,
}) {
  const [workspaceActivo, setWorkspaceActivo] = useState(null);
  const [workspaceAbierto, setWorkspaceAbierto] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [linkArchivo, setLinkArchivo] = useState('');
  const [notaEditando, setNotaEditando] = useState(null);

  const guardarNota = async () => {
    if (!titulo.trim() || !contenido.trim()) {
      toast.error('Completa todos los campos');
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario_sesion'));
    if (!usuario || !usuario.id) {
      toast.error('Sesión no válida. Inicia sesión de nuevo.');
      return;
    }

    try {
      const cuerpo = notaEditando 
        ? { id: notaEditando, titulo, contenido, link_archivo: linkArchivo, accion: 'editar' }
        : { espacio_trab_id: workspaceActivo, id_usuario: usuario.id, titulo, contenido, link_archivo: linkArchivo, accion: 'crear' };

      const response = await fetch('http://localhost:8000/paginas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo)
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success(data.message || (notaEditando ? 'Nota actualizada' : 'Nota creada'));
        
        if (refrescarWorkspaces) {
          await refrescarWorkspaces();
        }
        cerrarModal();
      } else if (data.status === 'limite' || data.status === 'premium_required') {
        toast.error(data.message || 'Límite alcanzado. Sube a premium.');
      } else {
        toast.error(data.message || 'Error al procesar la nota');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor');
    }
  };

  const editarNota = (workspaceId, nota) => {
    setWorkspaceActivo(workspaceId);
    setTitulo(nota.titulo);
    setContenido(nota.contenido);
    setLinkArchivo(nota.link_archivo || '');
    setNotaEditando(nota.id);
  };

  const eliminarNota = async (notaId) => {
    try {
      const response = await fetch('http://localhost:8000/paginas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: notaId,
          accion: 'eliminar'
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success(data.message || 'Nota eliminada');
        
        if (refrescarWorkspaces) {
          await refrescarWorkspaces();
        }
      } else {
        toast.error(data.message || 'Error al eliminar');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor');
    }
  };

  const cerrarModal = () => {
    setWorkspaceActivo(null);
    setNotaEditando(null);
    setTitulo('');
    setContenido('');
    setLinkArchivo('');
  };

  return (
    <div className="space-y-5">
      {workspaces.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 px-8 text-center">
          <NotebookPen size={52} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            Sin espacios de trabajo
          </h2>
          <p className="text-gray-500 mt-2">
            Crea tu primer workspace desde la página principal.
          </p>
        </div>
      )}

      {workspaces.map((workspace) => (
        <div
          key={workspace.id}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-50 p-5 flex justify-between items-center">
            <div
              onClick={() =>
                setWorkspaceAbierto(
                  workspaceAbierto === workspace.id ? null : workspace.id
                )
              }
              className="flex items-center gap-3 cursor-pointer"
            >
              <NotebookPen size={20} />
              <h2 className="text-xl font-bold text-gray-800">
                {workspace.nombre}
              </h2> 

              {workspaceAbierto === workspace.id ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>

            <button
              onClick={() => setWorkspaceActivo(workspace.id)}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all"
            >
              Crear Nota
            </button>
          </div>

          {workspaceAbierto === workspace.id && (
            <div className="p-5 space-y-4">
              {(!workspace.notas || workspace.notas.length === 0) ? (
                <p className="text-gray-500 text-sm">Sin notas en este espacio</p>
              ) : (
                workspace.notas.map((nota) => (
                  <div key={nota.id} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm flex justify-between items-start">
                    <div className="space-y-2 w-full">
                      <h3 className="font-bold text-gray-800">{nota.titulo}</h3>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">{nota.contenido}</p>
                      
                      {nota.link_archivo && (
                        <div className="mt-2 max-w-xs rounded-lg overflow-hidden border border-gray-200">
                          <img 
                            src={nota.link_archivo} 
                            alt="Archivo adjunto" 
                            className="max-h-40 object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => editarNota(workspace.id, nota)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Pencil size={16} />
                      </button>

                      <button 
                        onClick={() => eliminarNota(nota.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}

      {workspaceActivo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-2xl p-6 shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">
              {notaEditando ? 'Editar Nota' : 'Nueva Nota'}
            </h2>

            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título de la nota"
              className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:border-rose-500"
            />

            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Contenido de la nota..."
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:border-rose-500 resize-none"
            />

            <input
              value={linkArchivo}
              onChange={(e) => setLinkArchivo(e.target.value)}
              placeholder="Enlace de imagen o archivo (Premium)"
              className="w-full border border-gray-300 rounded-xl p-3 mb-4 focus:outline-none focus:border-rose-500"
            />

            <div className="flex gap-3 justify-end">
              <button 
                onClick={cerrarModal}
                className="px-4 py-2 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              
              <button 
                onClick={guardarNota}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-all"
              >
                {notaEditando ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}