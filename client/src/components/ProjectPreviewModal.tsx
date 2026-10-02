import React, { useState } from 'react';
import { X, ExternalLink, RefreshCw, AlertCircle, Maximize2, Shield } from 'lucide-react';

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  const reloadIframe = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-rgukt-600 flex items-center justify-center text-white shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="font-semibold text-sm sm:text-base text-white truncate">{title}</h3>
              <p className="text-xs text-slate-400 font-mono truncate">{url}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={reloadIframe}
              title="Reload preview"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 bg-rgukt-600 hover:bg-rgukt-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              If this live application refuses to connect or shows a blank frame due to security headers (X-Frame-Options), use the <strong>Open in New Tab</strong> button above.
            </span>
          </div>
        </div>

        {/* Iframe Container */}
        <div className="relative flex-1 bg-slate-100">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 z-10">
              <div className="w-8 h-8 border-3 border-rgukt-600 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs text-slate-500 font-medium">Loading live project preview...</p>
            </div>
          )}
          <iframe
            key={iframeKey}
            src={url}
            title={title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};
