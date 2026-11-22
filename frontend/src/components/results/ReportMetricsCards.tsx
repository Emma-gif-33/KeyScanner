import React from 'react';
import { AlertCircle, Key, Package, FileCheck, Timer } from 'lucide-react';
import { ReportSummary, SeverityBreakdown } from '../../types';

interface ReportMetricsCardsProps {
  summary: ReportSummary;
}

export const ReportMetricsCards: React.FC<ReportMetricsCardsProps> = ({ summary }) => {
  const bySev: SeverityBreakdown = summary.by_severity || { critical: 0, high: 0, medium: 0, low: 0 };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Findings */}
      <div className="p-5 bg-navy-900/80 border border-navy-800 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Total Hallazgos</span>
          <AlertCircle className="w-4 h-4 text-sky-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white">
            {summary.total_findings}
          </span>
          <span className="text-[11px] text-slate-500">alertas</span>
        </div>
        <div className="flex items-center gap-1.5 pt-1 text-[10px]">
          {bySev.critical > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
              {bySev.critical} críticas
            </span>
          )}
          {bySev.high > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20">
              {bySev.high} altas
            </span>
          )}
          {bySev.critical === 0 && bySev.high === 0 && (
            <span className="text-slate-500">Sin severidad crítica</span>
          )}
        </div>
      </div>

      {/* Secrets Detected */}
      <div className="p-5 bg-navy-900/80 border border-navy-800 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Secretos Detectados</span>
          <Key className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white">
            {summary.total_secrets}
          </span>
          <span className="text-[11px] text-slate-500">credenciales</span>
        </div>
        <p className="text-[11px] text-slate-400 truncate pt-1">
          RegEx & Entropía de Shannon
        </p>
      </div>

      {/* Vulnerable Dependencies */}
      <div className="p-5 bg-navy-900/80 border border-navy-800 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Dependencias Vulnerables</span>
          <Package className="w-4 h-4 text-rose-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white">
            {summary.total_vulnerabilities}
          </span>
          <span className="text-[11px] text-slate-500">paquetes CVE</span>
        </div>
        <p className="text-[11px] text-slate-400 truncate pt-1">
          Base de datos OSV.dev (Google)
        </p>
      </div>

      {/* Files & Timing */}
      <div className="p-5 bg-navy-900/80 border border-navy-800 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">Archivos & Duración</span>
          <Timer className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white">
            {summary.files_extracted}
          </span>
          <span className="text-[11px] text-slate-500">archivos</span>
        </div>
        <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
          <FileCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>Tiempo: {summary.scan_duration_seconds ? `${summary.scan_duration_seconds}s` : '< 1s'}</span>
        </p>
      </div>
    </div>
  );
};
