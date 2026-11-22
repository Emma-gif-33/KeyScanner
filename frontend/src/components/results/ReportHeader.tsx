import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Copy, Check, ArrowLeft, Clock, Hash, FileCode } from 'lucide-react';
import { ScanReport, RiskLevel } from '../../types';

interface ReportHeaderProps {
  report: ScanReport;
  onNewScan: () => void;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ report, onNewScan }) => {
  const [copiedHash, setCopiedHash] = useState(false);

  const copyHashToClipboard = () => {
    if (report.file_hash_sha256) {
      navigator.clipboard.writeText(report.file_hash_sha256);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return {
          label: 'Riesgo Crítico',
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: ShieldX,
        };
      case 'HIGH':
        return {
          label: 'Riesgo Alto',
          bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          icon: ShieldAlert,
        };
      case 'MEDIUM':
        return {
          label: 'Riesgo Medio',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: ShieldAlert,
        };
      case 'LOW':
        return {
          label: 'Riesgo Bajo',
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          icon: ShieldAlert,
        };
      default:
        return {
          label: 'Limpio / Sin Riesgo',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: ShieldCheck,
        };
    }
  };

  const badge = getRiskBadge(report.risk_level);
  const Icon = badge.icon;

  return (
    <div className="space-y-4">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNewScan}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver y analizar otro archivo</span>
        </button>

        <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {new Date(report.created_at).toLocaleString()}
        </span>
      </div>

      {/* Main Header Card */}
      <div className="p-6 sm:p-8 bg-navy-900/90 border border-navy-800 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {report.project_name}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
            >
              <Icon className="w-4 h-4" />
              {badge.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-slate-500" />
              <span>{report.source_filename}</span>
            </span>

            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate max-w-[120px] sm:max-w-[200px]" title={report.file_hash_sha256}>
                SHA-256: {report.file_hash_sha256.substring(0, 16)}...
              </span>
              <button
                onClick={copyHashToClipboard}
                className="text-slate-500 hover:text-sky-400 p-0.5 transition-colors"
                title="Copiar Hash SHA-256 completo"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewScan}
            className="px-4 py-2.5 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700/80 text-xs font-semibold text-white shadow-md transition-all hover:border-sky-500/40"
          >
            Nueva Auditoría
          </button>
        </div>
      </div>
    </div>
  );
};
