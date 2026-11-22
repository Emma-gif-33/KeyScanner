import React, { useState } from 'react';
import { X, Lock, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }
        await register(email, password, fullName || undefined);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error durante la autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoAccount = () => {
    setEmail('auditor@keyscanner.io');
    setPassword('AuditorKey2026!');
    setFullName('Emma Reyes');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-navy-900 border border-navy-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isRegisterMode ? 'Crear Cuenta en KeyScanner' : 'Iniciar Sesión'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegisterMode
              ? 'Regístrate para auditar código y guardar tu historial seguro'
              : 'Accede a tu panel para gestionar tus auditorías de seguridad'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nombre Completo (opcional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Emma Reyes"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isRegisterMode ? 'Registrarme' : 'Entrar a la Plataforma'}</span>
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 pt-4 border-t border-navy-800 text-center">
          <p className="text-xs text-slate-400">
            {isRegisterMode ? '¿Ya tienes una cuenta?' : '¿Aún no tienes cuenta?'}
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
              }}
              className="ml-1.5 text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2"
            >
              {isRegisterMode ? 'Inicia sesión aquí' : 'Crea una cuenta gratis'}
            </button>
          </p>

          <button
            type="button"
            onClick={handleUseDemoAccount}
            className="mt-3 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            Llenar con cuenta de auditoría rápida
          </button>
        </div>
      </div>
    </div>
  );
};
