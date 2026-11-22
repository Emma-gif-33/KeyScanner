import React from 'react';
import { Package, ExternalLink, ArrowRight, FileText } from 'lucide-react';
import { DependencyFinding, Severity } from '../../types';

interface DependencyFindingItemProps {
  finding: DependencyFinding;
}

export const DependencyFindingItem: React.FC<DependencyFindingItemProps> = ({ finding }) => {
  const getSeverityStyle = (sev: Severity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    }
  };

  return (
    <div className="p-5 bg-navy-900/70 hover:bg-navy-900/90 border border-navy-800 rounded-2xl transition-all space-y-3.5 backdrop-blur-sm">
      {/* Top Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide font-mono">
                {finding.package_name}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-navy-950 border border-navy-800 text-sky-400">
                {finding.ecosystem}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
              <FileText className="w-3 h-3 text-slate-500" />
              <span>Manifiesto: {finding.manifest_file}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {finding.advisory_url ? (
            <a
              href={finding.advisory_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-navy-850 hover:bg-navy-800 border border-navy-700/80 text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>{finding.osv_id}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-navy-950 border border-navy-800 text-slate-300">
              {finding.osv_id}
            </span>
          )}

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSeverityStyle(
              finding.severity
            )}`}
          >
            {finding.severity}
          </span>
        </div>
      </div>

      {/* Version Comparison Box */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-navy-950/80 border border-navy-800/90 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">Versión instalada:</span>
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
            {finding.installed_version}
          </span>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">Versión segura recomendada:</span>
          {finding.fixed_version ? (
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {finding.fixed_version}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium text-[11px]">
              Actualizar a la última versión disponible
            </span>
          )}
        </div>
      </div>

      {/* Summary Description */}
      {finding.summary && (
        <p className="text-xs text-slate-300 leading-relaxed bg-navy-950/40 p-3 rounded-xl border border-navy-800/50">
          {finding.summary}
        </p>
      )}
    </div>
  );
};
