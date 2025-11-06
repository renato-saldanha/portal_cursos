'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import { authService } from '@/lib/auth';
import { useAutenticacao } from '@/lib/hooks/useApi';
import { Turma } from '@/types';
import { toast } from '@/components/ToastContainer';

export default function UploadRecurso() {
  const [tipoRecurso, setTipoRecurso] = useState<'video' | 'pdf' | 'zip'>('video');
  const [turmas, setTurmas] = useState<Turma[]>([]);

  useEffect(() => {
    const carregarTurmas = async () => {
      try {
        const turmasResponse = await authService.getTurmas();
        setTurmas(turmasResponse);
      } catch (error) {
        toast.error('Erro ao carregar turmas');
      }
    };
    carregarTurmas();
  }, []);

  const handleUpload = async (arquivo: File, dados: any) => {
    try {
      const resultado = await authService.uploadArquivo(arquivo, dados);
      
      if (resultado.sucesso) {
        toast.success('Arquivo enviado com sucesso!');
        console.log('Recurso criado:', resultado.recurso);
      } else {
        throw new Error(resultado.mensagem);
      }
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao enviar arquivo';
      toast.error(mensagem);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Upload de Recursos
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Faça upload de vídeos, PDFs ou arquivos ZIP para suas turmas
          </p>
        </div>

        {/* Seletor de tipo */}
        <div className="mb-6">
          <label className="label-md text-orange-base mb-3 block">
            TIPO DE RECURSO
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {(['video', 'pdf', 'zip'] as const).map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setTipoRecurso(tipo)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors min-h-[44px] ${
                  tipoRecurso === tipo
                    ? 'border-orange-base bg-orange-50 text-orange-base'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Componente de upload */}
        <FileUpload
          onUpload={handleUpload}
          tipoRecurso={tipoRecurso}
          turmas={turmas.map(t => ({ id: t.id, nome: t.nome, treinamento_nome: t.treinamento_nome }))}
        />

        {/* Instruções */}
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Instruções:</h3>
          <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
            <li>• <strong>Vídeos:</strong> MP4, AVI, MOV, MKV (máximo 100MB)</li>
            <li>• <strong>PDFs:</strong> Arquivos PDF (máximo 100MB)</li>
            <li>• <strong>ZIPs:</strong> ZIP, RAR, 7Z (máximo 100MB)</li>
            <li>• <strong>Acesso prévio:</strong> Disponível antes da data de início da turma</li>
            <li>• <strong>Rascunho:</strong> Não será exibido para alunos após início da turma</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
