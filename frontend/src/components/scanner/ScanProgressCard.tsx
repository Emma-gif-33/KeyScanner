import React, { useEffect, useState } from 'react';
import { Loader2, ShieldAlert, CheckCircle2, FileSearch, Database, KeyRound, AlertTriangle } from 'lucide-react';
import { Scan } from '../../types';
import { scanService } from '../../services/scanService';

interface ScanProgressCardProps {
  scan: Scan;
  onScanCompleted: (completedScan: Scan) => void;
  onScanFailed: (failedScan: Scan) => void;
}

export const ScanProgressCard: React.FC<ScanProgressCardProps> = ({
  scan,
  onScanCompleted,
  onScanFailed,
}) => {
  const [currentScan, setCurrentScan] = useState<Scan>(scan);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { label: 'Descompresión segura y verificación de Magic Bytes (Anti-Zip Slip)', icon: FileSearch },
    { label: 'Análisis estático de secretos (RegEx & Entropía de Shannon)', icon: KeyRound },
    { label: 'Auditoría de manifiestos y consulta en lote a OSV.dev (CVEs)', icon: Database },
    { label: 'Cálculo de vector de riesgo y generación de reporte ejecutivo', icon: ShieldAlert },
  ];

  useEffect(() => {
    // Step progression animation timer
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(stepTimer);
  }, [steps.length]);

  useEffect(() => {
    let isCancelled = false;

    const pollInterval = setInterval(async () => {
      try {
        const updated = await scanService.getScan(currentScan.id);
        if (isCancelled) return;
        setCurrentScan(updated);

        if (updated.status === 'COMPLETED') {
          clearInterval(pollInterval);
          onScanCompleted(updated);
        } else if (updated.status === 'FAILED') {
          clearInterval(pollInterval);
          onScanFailed(updated);
        }
      } catch (err) {
        console.error('Error polling scan status:', err);
      }
    }, 1200);

    return () => {
      isCancelled = true;
      clearInterval(pollInterval);
    };
  }, [currentScan.id, onScanCompleted, onScanFailed]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-navy-900/90 border border-navy-800 rounded-3xl shadow-2xl backdrop-blur-md space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Auditoría en Progreso: {currentScan.project_name}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Archivo: {currentScan.source_filename}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 animate-pulse">
          {currentScan.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-navy-800">
        <div
          className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="space-y-3 pt-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
                isDone
                  ? 'bg-navy-950/40 border-navy-800 text-slate-300'
                  : isCurrent
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-300 font-medium shadow-sm'
                  : 'bg-navy-950/20 border-transparent text-slate-600'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Error detail if failed */}
      {currentScan.status === 'FAILED' && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-400 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">La auditoría no pudo completarse:</p>
            <p className="mt-1">{currentScan.error_message || 'Error interno desconocido.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};
