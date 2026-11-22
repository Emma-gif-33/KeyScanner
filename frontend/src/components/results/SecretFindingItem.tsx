import React, { useState } from 'react';
import { Key, Copy, Check, FileCode, Lightbulb } from 'lucide-react';
import { SecretFinding, Severity } from '../../types';

interface SecretFindingItemProps {
  finding: SecretFinding;
}

export const SecretFindingItem: React.FC<SecretFindingItemProps> = ({ finding }) => {
  const [copied, setCopied] = useState(false);

  const copySnippet = () => {
    navigator.clipboard.writeText(finding.masked_snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-wide">
              {finding.secret_type}
            </span>
            <div className="text-[11px] text-slate-400 font-mono">
              Regla: {finding.rule_id}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {finding.entropy_score && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-navy-950 border border-navy-800 text-slate-400">
              Entropía: {finding.entropy_score.toFixed(2)} bits
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

      {/* File & Line */}
      <div className="flex items-center gap-1.5 text-xs text-sky-300 font-mono bg-navy-950/60 px-3 py-1.5 rounded-lg border border-navy-800/80">
        <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="truncate">{finding.file_path}</span>
        <span className="text-slate-500">:L{finding.line_number}</span>
      </div>

      {/* Code Snippet Box */}
      <div className="relative group">
        <div className="p-3 bg-navy-950 border border-navy-800/90 rounded-xl font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre">
          {finding.masked_snippet}
        </div>
        <button
          onClick={copySnippet}
          className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 border border-navy-700/80 text-slate-400 hover:text-white transition-colors"
          title="Copiar fragmento seguro"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Remediation Tip */}
      {finding.remediation_tip && (
        <div className="p-3 bg-sky-500/5 border border-sky-500/20 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
          <Lightbulb className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-sky-400 text-[11px] uppercase tracking-wider">
              Acción de Mitigación Recomendada:
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {finding.remediation_tip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
