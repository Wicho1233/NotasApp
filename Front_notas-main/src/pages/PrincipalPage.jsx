import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardPage from './DashboardPage';
import PerfilPage from './PerfilPage';
import BuscarWorkspacePage from './BuscarWorkspacePage';
import ListaWorkspacePage from './ListaWorkspacePage';
import toast from 'react-hot-toast';

export default function PrincipalPage({ logout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [workspaces, setWorkspaces] = useState([]);
  const [cargando, setCargando] = useState(true);

  const refrescarWorkspaces = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario_sesion'));
    if (!usuario || !usuario.id) {
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(`https://notasapp-ctau.onrender.com/ver-espacios?id_usuario=${usuario.id}`);
      const listadoEspacios = await response.json();

      if (Array.isArray(listadoEspacios)) {
        const espaciosConNotas = await Promise.all(
          listadoEspacios.map(async (espacio) => {
            try {
              const resNotas = await fetch(`https://notasapp-ctau.onrender.com/ver-paginas?espacio_trab_id=${espacio.id}`);
              const notas = await resNotas.json();
              return {
                ...espacio,
                id: Number(espacio.id),
                notas: Array.isArray(notas) ? notas.map(n => ({ ...n, id: Number(n.id) })) : []
              };
            } catch {
              return { ...espacio, id: Number(espacio.id), notas: [] };
            }
          })
        );
        setWorkspaces(espaciosConNotas);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    refrescarWorkspaces();
  }, []);

  const pageTitles = {
    dashboard: 'Página Principal',
    perfil: 'Perfil',
    buscarwork: 'Buscar Workspace',
    lista: 'Lista de Workspaces',
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        logout={logout}
      />

      <div className="flex-1 ml-64">
        <div className="flex items-center justify-center p-4 shadow-lg bg-white">
          <h1 className="text-2xl font-bold">
            {pageTitles[activePage]}
          </h1>
        </div>

        <div className="p-6">

          {activePage === 'dashboard' && (
            <DashboardPage
              workspaces={workspaces}
              setWorkspaces={setWorkspaces}
              refrescarWorkspaces={refrescarWorkspaces}
            />
          )}

          {activePage === 'perfil' && (
            <PerfilPage />
          )}

          {activePage === 'buscarwork' && (
            <BuscarWorkspacePage
              workspaces={workspaces}
              setWorkspaces={setWorkspaces}
            />
          )}

          {activePage === 'lista' && (
            <ListaWorkspacePage
              workspaces={workspaces}
              setWorkspaces={setWorkspaces}
              refrescarWorkspaces={refrescarWorkspaces}
            />
          )}

        </div>
      </div>
    </div>
  );
}