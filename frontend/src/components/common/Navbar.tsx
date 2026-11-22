import React from 'react';
import { Shield, Key, History, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenHistory: () => void;
  onNewScan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenHistory, onNewScan }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-navy-950/80 border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewScan}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-600/20 border border-sky-500/30 group-hover:border-sky-400/60 transition-all shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <Shield className="w-5 h-5 text-sky-400 group-hover:scale-105 transition-transform" />
            <Key className="w-3 h-3 text-indigo-300 absolute bottom-1.5 right-1.5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Key<span className="text-sky-400">Scanner</span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Auditoría de Seguridad & CVEs
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={onOpenHistory}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-navy-850 hover:bg-navy-800 border border-navy-700/80 hover:text-white transition-colors"
                title="Historial de Auditorías"
              >
                <History className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Historial</span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-navy-800">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-medium text-slate-200">
                    {user?.full_name || user?.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    {user?.email}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow">
                  {(user?.full_name || user?.email || 'U')[0].toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-1"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md shadow-sky-500/20 transition-all hover:shadow-sky-500/30"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
