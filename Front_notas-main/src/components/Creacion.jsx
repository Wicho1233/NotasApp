import { X } from 'lucide-react';

export default function Creacion({
  abierto,
  cerrar,
  nombreWorkspace,
  setNombreWorkspace,
  onWorkspaceCreado,
}) {
  return (
    <div
      className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-all duration-300 ${
        abierto ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <div
        className={`bg-white w-96 rounded-xl shadow-xl p-6 relative transition-all duration-300 ${
          abierto ? "scale-100" : "scale-90"
        }`}
      >
        <button
          onClick={cerrar}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Crear Workspace
        </h2>

        <input
          type="text"
          placeholder="Nombre del Workspace"
          value={nombreWorkspace}
          onChange={(e) => setNombreWorkspace(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4"
        />

        <button
          onClick={onWorkspaceCreado}
          className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-all duration-200"
        >
          Crear
        </button>
      </div>
    </div>
  );
}