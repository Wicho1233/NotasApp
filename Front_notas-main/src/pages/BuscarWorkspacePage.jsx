import { useState } from 'react';
import { Search, Pencil } from 'lucide-react';

export default function BuscarWorkspacePage({
  workspaces,
  setWorkspaces,
}) {
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState(null);
  const [nuevoNombre, setNuevoNombre] =
    useState('');

  const resultados = workspaces.filter(
    (workspace) =>
      workspace.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  const editarWorkspace = (workspace) => {
    setEditando(workspace.id);
    setNuevoNombre(workspace.nombre);
  };

  const guardarCambios = () => {
    const nuevosWorkspaces = workspaces.map(
      (workspace) =>
        workspace.id === editando
          ? {
              ...workspace,
              nombre: nuevoNombre,
            }
          : workspace
    );

    setWorkspaces(nuevosWorkspaces);
    setEditando(null);
    setNuevoNombre('');
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Barra búsqueda */}
      <div className="relative mb-6">
        <Search
          size={20}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Buscar workspace..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
          className="
            w-full
            bg-white
            border
            border-gray-200
            rounded-xl
            pl-12
            pr-4
            py-3
            outline-none
            focus:border-rose-500
          "
        />
      </div>

      {/* Sin Workspaces */}
      {workspaces.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No hay workspaces disponibles
        </p>
      )}

      {/* Resultados */}
      <div className="space-y-4">
        {resultados.map((workspace) => (
          <div
            key={workspace.id}
            className="
              bg-white
              border
              border-gray-200
              rounded-xl
              p-5
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h2 className="text-lg font-semibold">
                {workspace.nombre}
              </h2>

              <p className="text-sm text-gray-500">
                {workspace.notas.length} notas
              </p>
            </div>

            <button
              onClick={() =>
                editarWorkspace(workspace)
              }
              className="
                flex
                items-center
                gap-2
                bg-blue-500
                text-white
                px-4
                py-2
                rounded-lg
                hover:bg-blue-600
                transition-all
              "
            >
              <Pencil size={16} />
              Editar
            </button>
          </div>
        ))}
      </div>

      {/* Modal Editar */}
      {editando && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
          "
        >
          <div
            className="
              bg-white
              w-[400px]
              rounded-2xl
              p-6
            "
          >
            <h2 className="text-2xl font-bold mb-4">
              Editar Workspace
            </h2>

            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) =>
                setNuevoNombre(
                  e.target.value
                )
              }
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                p-3
                mb-4
              "
            />

            <div className="flex gap-3">
              <button
                onClick={guardarCambios}
                className="
                  flex-1
                  bg-green-600
                  text-white
                  py-3
                  rounded-xl
                  hover:bg-green-700
                "
              >
                Guardar
              </button>

              <button
                onClick={() =>
                  setEditando(null)
                }
                className="
                  flex-1
                  bg-gray-200
                  py-3
                  rounded-xl
                  hover:bg-gray-300
                "
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}