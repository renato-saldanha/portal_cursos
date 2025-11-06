'use client';

import { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import Button from '@/components/Button';
import { api } from '@/lib/api';
import { Recurso } from '@/types';
import { FileText } from 'lucide-react';

export default function PlayerTeste() {
  const [recursoId, setRecursoId] = useState<string>('');
  const [recurso, setRecurso] = useState<Recurso | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const carregarRecurso = async () => {
    try {
      setCarregando(true);
      setErro('');
      setRecurso(null);
      const resp = await api.get(`/recursos/${recursoId}/`);
      setRecurso(resp.data as Recurso);
    } catch (e) {
      setErro('Não foi possível carregar o recurso. Verifique o ID.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/background.jpg)' }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bol mb-1 text-orange-light">Pré-visualização de Vídeo</h1>
          <p className="text-white">Carregue um recurso pelo ID para testar o player</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-orange-light mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              placeholder="ID do recurso"
              className="input-base flex-1"
              value={recursoId}
              onChange={(e) => setRecursoId(e.target.value)}
            />
            <Button onClick={carregarRecurso} carregando={carregando} desabilitado={!recursoId}>
              Carregar
            </Button>
          </div>
          {erro && (
            <div className="mt-3 p-3 bg-red-50 rounded text-red-600">{erro}</div>
          )}
        </div>

        {!recurso ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informe um ID de recurso</h3>
            <p className="text-gray-600">O player utiliza o download autenticado do backend</p>
          </div>
        ) : (
          <div className="bg-black rounded-2xl overflow-hidden">
            <VideoPlayer recurso={recurso} className="w-full h-[480px]" />
          </div>
        )}
      </div>
    </div>
  );
}
