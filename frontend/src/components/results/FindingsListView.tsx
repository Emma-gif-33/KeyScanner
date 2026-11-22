import React, { useState, useMemo } from 'react';
import { Search, Key, Package, ShieldCheck } from 'lucide-react';
import { SecretFinding, DependencyFinding } from '../../types';
import { SecretFindingItem } from './SecretFindingItem';
import { DependencyFindingItem } from './DependencyFindingItem';

interface FindingsListViewProps {
  secrets: SecretFinding[];
  dependencies: DependencyFinding[];
}

type TabType = 'all' | 'secrets' | 'dependencies';

export const FindingsListView: React.FC<FindingsListViewProps> = ({
  secrets,
  dependencies,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSecrets = useMemo(() => {
    return secrets.filter((s) => {
      const matchesSeverity =
        selectedSeverity === 'ALL' || s.severity === selectedSeverity;
      const matchesSearch =
        !searchTerm ||
        s.secret_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.file_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rule_id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
  }, [secrets, selectedSeverity, searchTerm]);

  const filteredDeps = useMemo(() => {
    return dependencies.filter((d) => {
      const matchesSeverity =
        selectedSeverity === 'ALL' || d.severity === selectedSeverity;
      const matchesSearch =
        !searchTerm ||
        d.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.osv_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.manifest_file.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.summary && d.summary.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSeverity && matchesSearch;
    });
  }, [dependencies, selectedSeverity, searchTerm]);

  const totalFiltered =
    activeTab === 'all'
      ? filteredSecrets.length + filteredDeps.length
      : activeTab === 'secrets'
      ? filteredSecrets.length
      : filteredDeps.length;

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="p-4 bg-navy-900/80 border border-navy-800 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 backdrop-blur-md">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-navy-950 rounded-xl border border-navy-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({secrets.length + dependencies.length})
          </button>
          <button
            onClick={() => setActiveTab('secrets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'secrets'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Secretos ({secrets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('dependencies')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'dependencies'
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Dependencias ({dependencies.length})</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Severity selector */}
          <div className="flex items-center gap-1">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all uppercase border ${
                  selectedSeverity === sev
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                    : 'bg-navy-950/60 text-slate-500 border-navy-800 hover:text-slate-300'
                }`}
              >
                {sev === 'ALL' ? 'Todas' : sev}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar hallazgos..."
              className="w-full pl-8 pr-3 py-1.5 bg-navy-950 border border-navy-800 focus:border-sky-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Findings List */}
      {totalFiltered === 0 ? (
        <div className="p-12 text-center bg-navy-900/40 border border-navy-800 rounded-3xl space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            {secrets.length + dependencies.length === 0
              ? '¡Excelente! No se detectaron vulnerabilidades ni secretos en este proyecto.'
              : 'No hay hallazgos que coincidan con los filtros aplicados.'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {secrets.length + dependencies.length === 0
              ? 'El código fuente no contiene claves sensibles expuestas ni paquetes conocidos vulnerables según los motores analíticos.'
              : 'Intenta limpiar el término de búsqueda o seleccionar "Todas" las severidades.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Secret Findings Section */}
          {(activeTab === 'all' || activeTab === 'secrets') && filteredSecrets.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Key className="w-4 h-4" />
                <span>Secretos y Credenciales Filtradas ({filteredSecrets.length})</span>
              </div>
              <div className="space-y-3">
                {filteredSecrets.map((s) => (
                  <SecretFindingItem key={s.id} finding={s} />
                ))}
              </div>
            </div>
          )}

          {/* Dependency Findings Section */}
          {(activeTab === 'all' || activeTab === 'dependencies') && filteredDeps.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <Package className="w-4 h-4" />
                <span>Dependencias Vulnerables OSV.dev ({filteredDeps.length})</span>
              </div>
              <div className="space-y-3">
                {filteredDeps.map((d) => (
                  <DependencyFindingItem key={d.id} finding={d} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
