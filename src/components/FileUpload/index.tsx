'use client';

import { useState, useRef } from 'react';
import { Upload, X, File, Video, FileText, Archive } from 'lucide-react';
import Button from '../Button';

interface FileUploadProps {
  onUpload: (file: File, data: UploadData) => Promise<void>;
  tipoRecurso: 'video' | 'pdf' | 'zip';
  carregando?: boolean;
  turmas?: Array<{ id: number; nome: string; treinamento_nome?: string }>;
}

interface UploadData {
  turma_id: number;
  nome: string;
  descricao: string;
  acesso_previo: boolean;
  rascunho: boolean;
}

const FileUpload = ({ onUpload, tipoRecurso, carregando = false, turmas = [] }: FileUploadProps) => {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [dados, setDados] = useState<UploadData>({
    turma_id: 0,
    nome: '',
    descricao: '',
    acesso_previo: false,
    rascunho: false
  });
  const [erro, setErro] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extensoesValidas = {
    video: ['mp4', 'avi', 'mov', 'mkv'],
    pdf: ['pdf'],
    zip: ['zip', 'rar', '7z']
  };

  const icones = {
    video: Video,
    pdf: FileText,
    zip: Archive
  };

  const Icone = icones[tipoRecurso];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar extensão
    const extensao = file.name.split('.').pop()?.toLowerCase();
    if (!extensoesValidas[tipoRecurso].includes(extensao || '')) {
      setErro(`Extensão ${extensao} não é válida para ${tipoRecurso}`);
      return;
    }

    // Validar tamanho (máximo 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setErro('Arquivo muito grande. Máximo 100MB');
      return;
    }

    setArquivo(file);
    setDados(prev => ({ ...prev, nome: file.name.split('.')[0] }));
    setErro('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!arquivo) {
      setErro('Selecione um arquivo');
      return;
    }

    if (!dados.turma_id || !dados.nome) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await onUpload(arquivo, dados);
      // Limpar formulário após sucesso
      setArquivo(null);
      setDados({
        turma_id: 0,
        nome: '',
        descricao: '',
        acesso_previo: false,
        rascunho: false
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao fazer upload');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Upload de arquivo */}
        <div>
          <label className="label-md text-orange-base mb-2 block">
            ARQUIVO *
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-base transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={extensoesValidas[tipoRecurso].map(ext => `.${ext}`).join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {arquivo ? (
              <div className="flex items-center justify-center gap-3">
                <Icone className="w-8 h-8 text-orange-base" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{arquivo.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(arquivo.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setArquivo(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  Clique para selecionar um arquivo {tipoRecurso}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Extensões aceitas: {extensoesValidas[tipoRecurso].join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Campos do formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="label-md text-orange-base mb-2 block">
              TURMA *
            </label>
            {turmas && turmas.length > 0 ? (
              <select
                value={dados.turma_id || ''}
                onChange={(e) => setDados(prev => ({ ...prev, turma_id: parseInt(e.target.value) || 0 }))}
                className="input-base min-h-[44px] w-full"
                required
              >
                <option value="0">Selecione uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.treinamento_nome ? `${turma.nome} - ${turma.treinamento_nome}` : turma.nome}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={dados.turma_id || ''}
                onChange={(e) => setDados(prev => ({ ...prev, turma_id: parseInt(e.target.value) || 0 }))}
                placeholder="ID da turma"
                className="input-base min-h-[44px] w-full"
                required
              />
            )}
          </div>

          <div>
            <label className="label-md text-orange-base mb-2 block">
              NOME *
            </label>
            <input
              type="text"
              value={dados.nome}
              onChange={(e) => setDados(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome do recurso"
              className="input-base min-h-[44px]"
              required
            />
          </div>
        </div>

        <div>
          <label className="label-md text-orange-base mb-2 block">
            DESCRIÇÃO
          </label>
          <textarea
            value={dados.descricao}
            onChange={(e) => setDados(prev => ({ ...prev, descricao: e.target.value }))}
            placeholder="Descrição do recurso"
            className="input-base min-h-[100px] resize-none"
            rows={3}
          />
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
            <input
              type="checkbox"
              checked={dados.acesso_previo}
              onChange={(e) => setDados(prev => ({ ...prev, acesso_previo: e.target.checked }))}
              className="w-5 h-5 sm:w-4 sm:h-4 text-orange-base cursor-pointer"
            />
            <span className="text-sm text-gray-700">Acesso prévio</span>
          </label>

          <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
            <input
              type="checkbox"
              checked={dados.rascunho}
              onChange={(e) => setDados(prev => ({ ...prev, rascunho: e.target.checked }))}
              className="w-5 h-5 sm:w-4 sm:h-4 text-orange-base cursor-pointer"
            />
            <span className="text-sm text-gray-700">Rascunho</span>
          </label>
        </div>

        {/* Erro */}
        {erro && (
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
            <div className="w-4 h-4 bg-danger rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <span className="body-sm text-danger">{erro}</span>
          </div>
        )}

        {/* Botão de submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          carregando={carregando}
          desabilitado={!arquivo || !dados.turma_id || !dados.nome}
        >
          {carregando ? 'Enviando...' : 'Enviar Arquivo'}
        </Button>
      </form>
    </div>
  );
};

export default FileUpload;
