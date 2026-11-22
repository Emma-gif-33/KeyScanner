import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { GeminiZipUploader } from './components/scanner/GeminiZipUploader';
import { ScanProgressCard } from './components/scanner/ScanProgressCard';
import { ReportHeader } from './components/results/ReportHeader';
import { ReportMetricsCards } from './components/results/ReportMetricsCards';
import { FindingsListView } from './components/results/FindingsListView';
import { ScanHistoryModal } from './components/history/ScanHistoryModal';
import { useAuth } from './context/AuthContext';
import { Scan, ScanReport } from './types';
import { scanService } from './services/scanService';
import { AlertCircle, Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [activeScan, setActiveScan] = useState<Scan | null>(null);
  const [activeReport, setActiveReport] = useState<ScanReport | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartScan = async (file: File, projectName?: string) => {
    setError(null);
    setIsUploading(true);
    setActiveReport(null);
    try {
      const scan = await scanService.uploadScan(file, projectName);
      setActiveScan(scan);
    } catch (err: any) {
      setError(err.message || 'Error al subir el archivo para análisis.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleScanCompleted = async (completedScan: Scan) => {
    setActiveScan(null);
    setLoadingReport(true);
    try {
      const report = await scanService.getScanReport(completedScan.id);
      setActiveReport(report);
    } catch (err: any) {
      setError('Error al obtener el reporte consolidado: ' + err.message);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleScanFailed = (failedScan: Scan) => {
    setError('La auditoría falló: ' + (failedScan.error_message || 'Error desconocido'));
  };

  const handleSelectScanFromHistory = async (scanId: string) => {
    setError(null);
    setActiveScan(null);
    setLoadingReport(true);
    try {
      const report = await scanService.getScanReport(scanId);
      setActiveReport(report);
    } catch (err: any) {
      setError('Error al cargar la auditoría seleccionada: ' + err.message);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleNewScan = () => {
    setActiveScan(null);
    setActiveReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenHistory={() => {
          if (!isAuthenticated) {
            setIsAuthOpen(true);
          } else {
            setIsHistoryOpen(true);
          }
        }}
        onNewScan={handleNewScan}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-rose-400 text-xs animate-fade-in max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-400 hover:text-white font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading Report Indicator */}
        {loadingReport && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="relative p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <p className="text-sm font-medium text-slate-300">
              Cargando reporte ejecutivo y correlación de vulnerabilidades...
            </p>
          </div>
        )}

        {/* State 1: Active Scan Running */}
        {!loadingReport && activeScan && (
          <ScanProgressCard
            scan={activeScan}
            onScanCompleted={handleScanCompleted}
            onScanFailed={handleScanFailed}
          />
        )}

        {/* State 2: Active Report Completed / Displayed */}
        {!loadingReport && !activeScan && activeReport && (
          <div className="space-y-8 animate-fade-in">
            <ReportHeader report={activeReport} onNewScan={handleNewScan} />
            <ReportMetricsCards summary={activeReport.summary} />
            <FindingsListView
              secrets={activeReport.secrets}
              dependencies={activeReport.dependencies}
            />
          </div>
        )}

        {/* State 3: Default Home - Gemini Zip Uploader */}
        {!loadingReport && !activeScan && !activeReport && (
          <GeminiZipUploader
            onStartScan={handleStartScan}
            isLoading={isUploading}
            isAuthenticated={isAuthenticated}
            onRequireAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-900 bg-navy-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            KeyScanner © 2026 • Plataforma de Seguridad Informática • UP Chiapas
          </p>
          <p className="text-slate-600">
            Desarrollado con FastAPI, React, Tailwind CSS y PostgreSQL
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <ScanHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectScan={handleSelectScanFromHistory}
      />
    </div>
  );
};

export default App;
