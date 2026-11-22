import React, { useState, useRef } from 'react';
import { UploadCloud, FileArchive, CheckCircle2, X, Sparkles, Shield, ArrowRight, AlertTriangle } from 'lucide-react';

interface GeminiZipUploaderProps {
  onStartScan: (file: File, projectName?: string) => void;
  isLoading: boolean;
  onRequireAuth: () => void;
  isAuthenticated: boolean;
}

export const GeminiZipUploader: React.FC<GeminiZipUploaderProps> = ({
  onStartScan,
  isLoading,
  onRequireAuth,
  isAuthenticated,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setError('Únicamente se admiten archivos comprimidos en formato .zip.');
      return;
    }
    // Max 50 MB
    if (file.size > 50 * 1024 * 1024) {
      setError('El archivo excede el límite permitido de 50 MB.');
      return;
    }
    setSelectedFile(file);
    const baseName = file.name.replace(/\.zip$/i, '');
    setProjectName(baseName);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setProjectName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerUpload = () => {
    if (!selectedFile) return;
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    onStartScan(selectedFile, projectName);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Title & Concept */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auditoría Estática de Seguridad & CVEs</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Escanea tu código en busca de <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">claves y vulnerabilidades</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto font-normal">
          Sube el archivo comprimido (.zip) de tu proyecto de Python o Node.js para inspeccionar secretos filtrados y paquetes vulnerables en segundos.
        </p>
      </div>

      {/* Gemini-Inspired Drag and Drop Card */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative rounded-3xl p-8 sm:p-12 transition-all duration-300 backdrop-blur-md ${
          selectedFile
            ? 'bg-navy-900/80 border-2 border-navy-700/80 shadow-2xl'
            : dragActive
            ? 'bg-navy-850/90 border-2 border-dashed border-sky-400 shadow-[0_0_35px_rgba(56,189,248,0.25)] scale-[1.01]'
            : 'bg-navy-900/50 hover:bg-navy-900/70 border-2 border-dashed border-sky-500/30 hover:border-sky-400/70 shadow-xl cursor-pointer group'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="hidden"
        />

        {!selectedFile ? (
          /* Empty / Awaiting Upload State */
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative p-5 rounded-2xl bg-gradient-to-b from-navy-800 to-navy-850 border border-navy-700/80 group-hover:border-sky-500/50 group-hover:scale-105 transition-all duration-300 shadow-lg">
              <UploadCloud className="w-10 h-10 text-sky-400 group-hover:text-sky-300 transition-colors" />
              <div className="absolute inset-0 rounded-2xl bg-sky-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="space-y-1.5">
              <p className="text-base font-semibold text-white">
                Arrastra y suelta tu archivo ZIP aquí
              </p>
              <p className="text-xs text-slate-400">
                o <span className="text-sky-400 font-medium underline underline-offset-2">explora tus archivos locales</span> (.zip hasta 50 MB)
              </p>
            </div>

            {/* Feature Tags */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-navy-950/80 border border-navy-800 text-slate-300">
                AWS, GCP & GitHub Secrets
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-navy-950/80 border border-navy-800 text-slate-300">
                Entropía de Shannon
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-navy-950/80 border border-navy-800 text-slate-300">
                OSV.dev / PyPI & npm CVEs
              </span>
            </div>
          </div>
        ) : (
          /* Gemini-style File Chip Preview State */
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-navy-950/90 border border-navy-800 rounded-2xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shrink-0">
                  <FileArchive className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">
                      {formatFileSize(selectedFile.size)}
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Listo para auditar
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors ml-2"
                title="Cambiar archivo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Project Name Customizer */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-medium text-slate-300">
                Nombre del Proyecto (opcional):
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Nombre descriptivo para la auditoría"
                className="w-full px-4 py-2.5 bg-navy-950 border border-navy-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Launch Audit Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleTriggerUpload}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              <Shield className="w-4 h-4 text-sky-200" />
              <span>Ejecutar Auditoría de Seguridad</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-rose-400 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Samples Hint */}
      <div className="p-4 rounded-2xl bg-navy-900/40 border border-navy-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>
            ¿Quieres probarlo rápido? Puedes usar los paquetes de muestra disponibles en <code className="text-sky-300 font-mono">samples/</code>
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          demo_node_project.zip | demo_python_project.zip
        </div>
      </div>
    </div>
  );
};
