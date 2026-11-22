import React, { useEffect, useState } from 'react';
import { X, History, Trash2, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { Scan, RiskLevel } from '../../types';
import { scanService } from '../../services/scanService';

interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScan: (scanId: string) => void;
}

export const ScanHistoryModal: React.FC<ScanHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectScan,
}) => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await scanService.listScans();
      setScans(response.scans);
    } catch (err) {
      console.error('Error fetching scan history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const handleDelete = async (e: React.MouseEvent, scanId: string) => {
    e.stopPropagation();
    if (!window.confirm('¿Deseas eliminar este registro de auditoría y purgar sus archivos?')) {
      return;
    }
    setDeletingId(scanId);
    try {
      await scanService.deleteScan(scanId);
      setScans((prev) => prev.filter((s) => s.id !== scanId));
    } catch (err) {
      console.error('Error deleting scan:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'HIGH':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'LOW':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-navy-900 border border-navy-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-navy-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Historial de Auditorías
              </h2>
              <p className="text-xs text-slate-400">
                Consulta y compara tus análisis anteriores
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
              <span className="text-xs">Cargando auditorías...</span>
            </div>
          ) : scans.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <p className="text-sm font-semibold text-slate-300">
                No hay auditorías registradas todavía
              </p>
              <p className="text-xs">
                Sube tu primer archivo ZIP para comenzar el análisis.
              </p>
            </div>
          ) : (
            scans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => {
                  onSelectScan(scan.id);
                  onClose();
                }}
                className="p-4 bg-navy-950/70 hover:bg-navy-850/80 border border-navy-800/80 hover:border-sky-500/40 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-sky-300 transition-colors">
                      {scan.project_name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getRiskColor(
                        scan.risk_level
                      )}`}
                    >
                      {scan.risk_level}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="truncate max-w-[150px]">{scan.source_filename}</span>
                    <span>•</span>
                    <span className="text-slate-300">
                      {scan.total_secrets} secretos, {scan.total_vulnerabilities} CVEs
                    </span>
                    <span>•</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(scan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDelete(e, scan.id)}
                    disabled={deletingId === scan.id}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Eliminar auditoría"
                  >
                    {deletingId === scan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                  <div className="p-2 text-slate-500 group-hover:text-sky-400 transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
