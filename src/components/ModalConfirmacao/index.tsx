'use client';

import { X, AlertTriangle } from 'lucide-react';
import Button from '../Button';

export interface ModalConfirmacaoProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  tipo?: 'danger' | 'warning' | 'info';
  onConfirmar: () => void;
  onCancelar: () => void;
  carregando?: boolean;
}

const ModalConfirmacao = ({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  tipo = 'danger',
  onConfirmar,
  onCancelar,
  carregando = false,
}: ModalConfirmacaoProps) => {
  if (!aberto) return null;

  const cores = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const coresBotao = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`flex-shrink-0 ${cores[tipo]}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
              <p className="text-gray-600 text-sm">{mensagem}</p>
            </div>
            <button
              onClick={onCancelar}
              className="text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Fechar"
              disabled={carregando}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={onCancelar}
              desabilitado={carregando}
            >
              {textoCancelar}
            </Button>
            <Button
              variant="primary"
              onClick={onConfirmar}
              carregando={carregando}
              className={coresBotao[tipo]}
            >
              {textoConfirmar}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;

