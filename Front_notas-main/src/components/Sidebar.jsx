import {
  PanelTop,
  LogOut,
  UserRound,
  Search,
  ChevronRight,
  ListCollapse,
  NotepadText,
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage }) {
  const handleLogout = () => {
     localStorage.removeItem('usuario_sesion');
    localStorage.removeItem('token');
    sessionStorage.clear();
    window.location.href = '/'; 
  };

  const navItems = [
    { id: 'dashboard', label: 'Página Principal', icon: PanelTop },
    { id: 'buscarwork', label: 'Buscar Workspace', icon: Search },
    { id: 'lista', label: 'Lista de workspace', icon: ListCollapse },
    { id: 'perfil', label: 'Perfil', icon: UserRound },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-xl flex flex-col p-3">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white">
          <NotepadText size={22} />
        </div>
        <div>
          <p className="text-xs text-gray-700">APP</p>
          <h1 className="text-lg font-semibold text-gray-900">DE NOTAS</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                active ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {active && <ChevronRight className="ml-auto" size={16} />}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border border-gray-200 bg-gray-50 rounded-xl p-3">
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-600 hover:text-white"
        >
          <LogOut size={16} />
          Salir
        </button>
      </div>
    </aside>
  );
}