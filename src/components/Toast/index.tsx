'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  mensagem: string;
  tipo: ToastType;
  duracao?: number;
  onClose: (id: string) => void;
}

const Toast = ({ id, mensagem, tipo, duracao = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    if (duracao > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duracao);
      return () => clearTimeout(timer);
    }
  }, [id, duracao, onClose]);

  const icones = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const cores = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const Icone = icones[tipo];

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        flex items-center gap-3
        px-4 py-3 rounded-lg shadow-lg border-2
        min-w-[300px] max-w-[500px]
        animate-in slide-in-from-right
        ${cores[tipo]}
      `}
    >
      <Icone className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{mensagem}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-current hover:opacity-70 transition-opacity min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Fechar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;

