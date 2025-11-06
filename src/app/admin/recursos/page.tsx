'use client';

import { useState, useEffect } from 'react';
import { useAutenticacao } from '@/lib/hooks/useApi';
import { authService } from '@/lib/auth';
import FileUpload from '@/components/FileUpload';
import Button from '@/components/Button';
import { Plus, Eye, Edit, Trash2, Play, FileText, Archive, Calendar, Search, Filter, X } from 'lucide-react';
import { Recurso, TipoArquivoSuportado, Turma } from '@/types';
import { formatarData, getDescricaoFormatada } from '@/utils/utils';
import BotaoVoltar from '@/components/BotaoVoltar';
import { useRouter } from 'next/navigation';
import { ARRAY_ARQUIVOS_SUPORTADOS } from '@/utils/Const';
import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import Input from '@/components/Input';

export default function GerenciarRecursos() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [recursosFiltrados, setRecursosFiltrados] = useState<Recurso[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [mostrarUpload, setMostrarUpload] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalVisualizar, setMostrarModalVisualizar] = useState(false);
  const [recursoSelecionado, setRecursoSelecionado] = useState<Recurso | null>(null);
  const [tipoRecurso, setTipoRecurso] = useState<TipoArquivoSuportado['arquivos']>('video');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [recursoParaExcluir, setRecursoParaExcluir] = useState<Recurso | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [formDataEditar, setFormDataEditar] = useState({
    nome: '',
    descricao: '',
    turma: '',
    acesso_previo: false,
    rascunho: false
  });
  const [enviandoEditar, setEnviandoEditar] = useState(false);
  const [novoArquivo, setNovoArquivo] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  // Filtros
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoArquivoSuportado['arquivos'] | 'todos'>('todos');
  const [filtroTurma, setFiltroTurma] = useState<number | 'todos'>('todos');
  const [filtroAcessoPrevio, setFiltroAcessoPrevio] = useState<boolean | 'todos'>('todos');
  const [filtroRascunho, setFiltroRascunho] = useState<boolean | 'todos'>('todos');
  
  const router = useRouter();

  const { carregandoEstado, downloadRecursoArquivo } = useAutenticacao();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro('');

      const [recursosResponse, turmasResponse] = await Promise.all([
        authService.getRecursos(),
        authService.getTurmas()
      ]);

      setRecursos(recursosResponse);
      setRecursosFiltrados(recursosResponse);
      setTurmas(turmasResponse);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Erro ao carregar dados. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleUpload = async (arquivo: File, dados: any) => {
    try {
      const resultado = await authService.uploadArquivo(arquivo, dados);

      if (resultado.sucesso) {
        await carregarDados();
        setMostrarUpload(false);
        alert('Recurso criado com sucesso!');
      } else {
        throw new Error(resultado.mensagem);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleExcluir = (recurso: Recurso) => {
    setRecursoParaExcluir(recurso);
  };

  const confirmarExclusao = async () => {
    if (!recursoParaExcluir) return;

    try {
      setExcluindo(true);
      const response = await authService.excluirRecurso(recursoParaExcluir.id);
      if (response) {
        await carregarDados();
        alert('Recurso excluído com sucesso!');
      } else {
        alert('Erro ao excluir recurso');
      }
    } catch (error) {
      console.error('Erro ao excluir recurso:', error);
      const mensagem = error instanceof Error ? error.message : 'Erro ao excluir recurso. Tente novamente.';
      alert(mensagem);
    } finally {
      setExcluindo(false);
      setRecursoParaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setRecursoParaExcluir(null);
  };

  const handleAbrirModalEditar = (recurso: Recurso) => {
    setRecursoSelecionado(recurso);
    setFormDataEditar({
      nome: recurso.nome,
      descricao: recurso.descricao || '',
      turma: recurso.turma.toString(),
      acesso_previo: recurso.acesso_previo,
      rascunho: recurso.rascunho
    });
    setNovoArquivo(null);
    setErro('');
    setMostrarModalEditar(true);
  };

  const handleFecharModalEditar = () => {
    setMostrarModalEditar(false);
    setRecursoSelecionado(null);
    setFormDataEditar({
      nome: '',
      descricao: '',
      turma: '',
      acesso_previo: false,
      rascunho: false
    });
    setNovoArquivo(null);
    setErro('');
  };

  const handleEditarRecurso = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recursoSelecionado) return;
    
    if (!formDataEditar.nome.trim()) {
      setErro('Nome é obrigatório');
      return;
    }

    try {
      setEnviandoEditar(true);
      setErro('');
      await authService.atualizarRecurso(
        recursoSelecionado.id,
        {
          nome: formDataEditar.nome,
          descricao: formDataEditar.descricao,
          turma: parseInt(formDataEditar.turma),
          acesso_previo: formDataEditar.acesso_previo,
          rascunho: formDataEditar.rascunho
        },
        novoArquivo || undefined
      );
      await carregarDados();
      handleFecharModalEditar();
      alert('Recurso atualizado com sucesso!');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao atualizar recurso');
    } finally {
      setEnviandoEditar(false);
    }
  };

  const handleVisualizarRecurso = async (recurso: Recurso) => {
    setRecursoSelecionado(recurso);
    setMostrarModalVisualizar(true);
    
    if (recurso.tipo_recurso === 'pdf') {
      try {
        const blob = await authService.baixarRecursoArquivo(recurso);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Erro ao carregar PDF:', error);
        setErro('Erro ao carregar PDF');
      }
    }
  };

  const handleFecharModalVisualizar = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setMostrarModalVisualizar(false);
    setRecursoSelecionado(null);
  };

  const getIconeRecurso = (tipo: TipoArquivoSuportado['arquivos']) => {
    switch (tipo) {
      case 'video': return Play;
      case 'pdf': return FileText;
      case 'zip': return Archive;
      default: return FileText;
    }
  };

  const handleVoltar = () => {
    router.back();
  }

  // Função de filtragem
  useEffect(() => {
    let filtrados = [...recursos];

    // Filtro por texto (nome/descrição)
    if (buscaTexto.trim()) {
      const texto = buscaTexto.toLowerCase();
      filtrados = filtrados.filter(
        (r) =>
          r.nome.toLowerCase().includes(texto) ||
          r.descricao?.toLowerCase().includes(texto)
      );
    }

    // Filtro por tipo
    if (filtroTipo !== 'todos') {
      filtrados = filtrados.filter((r) => r.tipo_recurso === filtroTipo);
    }

    // Filtro por turma
    if (filtroTurma !== 'todos') {
      filtrados = filtrados.filter((r) => r.turma === filtroTurma);
    }

    // Filtro por acesso prévio
    if (filtroAcessoPrevio !== 'todos') {
      filtrados = filtrados.filter((r) => r.acesso_previo === filtroAcessoPrevio);
    }

    // Filtro por rascunho
    if (filtroRascunho !== 'todos') {
      filtrados = filtrados.filter((r) => r.rascunho === filtroRascunho);
    }

    setRecursosFiltrados(filtrados);
  }, [recursos, buscaTexto, filtroTipo, filtroTurma, filtroAcessoPrevio, filtroRascunho]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-base mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando recursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <BotaoVoltar
                onClick={handleVoltar}
              />
              <Header
                titulo='Gerencie seus Recursos'
                descricao='Gerencie vídeos, PDFs e arquivos ZIP das suas turmas' />
            </div>
            <Button
              onClick={() => setMostrarUpload(true)}
              variant="primary"
              icon="plus"
              className="w-full sm:w-auto"
            >
              Novo Recurso
            </Button>
          </div>
        </div>

        {erro && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{erro}</p>
          </div>
        )}

        {/* Modal de Upload */}
        {mostrarUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Adicionar Novo Recurso
                  </h2>
                  <button
                    onClick={() => setMostrarUpload(false)}
                    className="text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Fechar modal"
                  >
                    ✕
                  </button>
                </div>

                {/* Seletor de tipo */}
                <div className="mb-6">
                  <label className="label-md text-orange-base mb-3 block">
                    TIPO DE RECURSO
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    {(ARRAY_ARQUIVOS_SUPORTADOS).map((tipo) => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => setTipoRecurso(tipo)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors min-h-[44px] ${tipoRecurso === tipo
                          ? 'border-orange-base bg-orange-50 text-orange-base'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                      >
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <FileUpload
                  onUpload={handleUpload}
                  tipoRecurso={tipoRecurso}
                  carregando={carregandoEstado}
                  turmas={turmas && turmas.length > 0 ? turmas.map(t => ({ id: t.id, nome: t.nome, treinamento_nome: t.treinamento_nome })) : []}
                />
              </div>
            </div>
          </div>
        )}

        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Busca por texto */}
            <div>
              <label className="label-md text-orange-base mb-2 block">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  placeholder="Buscar por nome ou descrição..."
                  className="input-base pl-10 min-h-[44px]"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por tipo */}
              <div>
                <label className="label-md text-orange-base mb-2 block">
                  Tipo de Recurso
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value as TipoArquivoSuportado['arquivos'] | 'todos')}
                  className="input-base min-h-[44px]"
                >
                  <option value="todos">Todos</option>
                  {ARRAY_ARQUIVOS_SUPORTADOS.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por turma */}
              <div>
                <label className="label-md text-orange-base mb-2 block">
                  Turma
                </label>
                <select
                  value={filtroTurma}
                  onChange={(e) => setFiltroTurma(e.target.value === 'todos' ? 'todos' : parseInt(e.target.value))}
                  className="input-base min-h-[44px]"
                >
                  <option value="todos">Todas</option>
                  {turmas && turmas.length > 0 && turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por acesso prévio */}
              <div>
                <label className="label-md text-orange-base mb-2 block">
                  Acesso Prévio
                </label>
                <select
                  value={filtroAcessoPrevio === 'todos' ? 'todos' : filtroAcessoPrevio.toString()}
                  onChange={(e) => setFiltroAcessoPrevio(e.target.value === 'todos' ? 'todos' : e.target.value === 'true')}
                  className="input-base min-h-[44px]"
                >
                  <option value="todos">Todos</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>

              {/* Filtro por rascunho */}
              <div>
                <label className="label-md text-orange-base mb-2 block">
                  Rascunho
                </label>
                <select
                  value={filtroRascunho === 'todos' ? 'todos' : filtroRascunho.toString()}
                  onChange={(e) => setFiltroRascunho(e.target.value === 'todos' ? 'todos' : e.target.value === 'true')}
                  className="input-base min-h-[44px]"
                >
                  <option value="todos">Todos</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>
            </div>

            {/* Botão limpar filtros */}
            {(buscaTexto || filtroTipo !== 'todos' || filtroTurma !== 'todos' || filtroAcessoPrevio !== 'todos' || filtroRascunho !== 'todos') && (
              <div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setBuscaTexto('');
                    setFiltroTipo('todos');
                    setFiltroTurma('todos');
                    setFiltroAcessoPrevio('todos');
                    setFiltroRascunho('todos');
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Recursos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-3 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recursos ({recursosFiltrados.length} de {recursos.length})
            </h2>
          </div>

          {recursosFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum recurso encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece adicionando seu primeiro recurso
              </p>
              <Button
                onClick={() => setMostrarUpload(true)}
                variant="primary"
                icon="plus"
              >
                Adicionar Recurso
              </Button>
            </div>
          ) : (
            <div className="max-h-[750px] overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 divide-gray-200">
              {recursosFiltrados.map((recurso) => {
                const Icone = getIconeRecurso(recurso.tipo_recurso);
                return (
                  <div key={recurso.id} className="p-4 hover:bg-orange-light rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                        <Icone className="w-6 h-6 text-orange-base" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 break-words">
                              {recurso.nome}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-2 break-words">
                              {getDescricaoFormatada(recurso.descricao, 30)}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                {formatarData(recurso.data_criacao, 'data')}
                              </div>
                              <span className="capitalize">
                                {recurso.tipo_recurso}
                              </span>
                              <span className="truncate max-w-[100px] sm:max-w-none">
                                {recurso.turma_nome}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {recurso.acesso_previo && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Acesso Prévio
                                </span>
                              )}
                              {recurso.rascunho && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  Rascunho
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              onClick={() => handleVisualizarRecurso(recurso)}
                              variant="secondary"
                              size="sm"
                              className="min-h-[44px] min-w-[44px] p-3 sm:p-2 text-yellow-mid flex items-center justify-center"
                              aria-label="Visualizar recurso"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleAbrirModalEditar(recurso)}
                              variant="secondary"
                              size="sm"
                              className="min-h-[44px] min-w-[44px] p-3 sm:p-2 text-green-dark flex items-center justify-center"
                              aria-label="Editar recurso"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleExcluir(recurso)}
                              variant="secondary"
                              size="sm"
                              className="min-h-[44px] min-w-[44px] p-3 sm:p-2 text-red-dark hover:text-red-dark flex items-center justify-center"
                              aria-label="Excluir recurso"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Excluir Recurso */}
        {recursoParaExcluir && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Excluir Recurso
                  </h2>
                  <button
                    onClick={cancelarExclusao}
                    className="text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Fechar modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-700 mb-6">
                  Tem certeza que deseja excluir o recurso <strong>{recursoParaExcluir.nome}</strong>?
                  Esta ação não pode ser desfeita.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={cancelarExclusao}
                    className="min-h-[44px]"
                    desabilitado={excluindo}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={confirmarExclusao}
                    className="min-h-[44px] bg-red-600 hover:bg-red-700"
                    carregando={excluindo}
                    desabilitado={excluindo}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editar Recurso */}
        {mostrarModalEditar && recursoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Editar Recurso
                  </h2>
                  <button
                    onClick={handleFecharModalEditar}
                    className="text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Fechar modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {erro && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{erro}</p>
                  </div>
                )}

                <form onSubmit={handleEditarRecurso} className="space-y-4">
                  <div>
                    <label className="label-md text-orange-base mb-2 block">
                      TURMA *
                    </label>
                    <select
                      value={formDataEditar.turma}
                      onChange={(e) => setFormDataEditar({ ...formDataEditar, turma: e.target.value })}
                      className="input-base min-h-[44px] w-full"
                      required
                    >
                      <option value="">Selecione uma turma</option>
                      {turmas && turmas.length > 0 && turmas.map((turma) => (
                        <option key={turma.id} value={turma.id}>
                          {turma.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="NOME *"
                    type="text"
                    placeholder="Nome do recurso"
                    value={formDataEditar.nome}
                    onChange={(e) => setFormDataEditar({ ...formDataEditar, nome: e.target.value })}
                    required
                  />

                  <div>
                    <label className="label-md text-orange-base mb-2 block">
                      DESCRIÇÃO
                    </label>
                    <textarea
                      value={formDataEditar.descricao}
                      onChange={(e) => setFormDataEditar({ ...formDataEditar, descricao: e.target.value })}
                      placeholder="Descrição do recurso"
                      className="input-base min-h-[100px] resize-none w-full"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="label-md text-orange-base mb-2 block">
                      NOVO ARQUIVO (OPCIONAL)
                    </label>
                    <input
                      type="file"
                      accept={recursoSelecionado.tipo_recurso === 'video' ? 'video/*' : recursoSelecionado.tipo_recurso === 'pdf' ? 'application/pdf' : '.zip,.rar,.7z'}
                      onChange={(e) => setNovoArquivo(e.target.files?.[0] || null)}
                      className="input-base min-h-[44px] w-full"
                    />
                    {novoArquivo && (
                      <p className="text-sm text-gray-600 mt-2">
                        Novo arquivo selecionado: {novoArquivo.name}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Deixe vazio para manter o arquivo atual
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formDataEditar.acesso_previo}
                        onChange={(e) => setFormDataEditar({ ...formDataEditar, acesso_previo: e.target.checked })}
                        className="w-5 h-5 sm:w-4 sm:h-4 text-orange-base cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">Acesso prévio</span>
                    </label>

                    <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formDataEditar.rascunho}
                        onChange={(e) => setFormDataEditar({ ...formDataEditar, rascunho: e.target.checked })}
                        className="w-5 h-5 sm:w-4 sm:h-4 text-orange-base cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">Rascunho</span>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleFecharModalEditar}
                      className="min-h-[44px]"
                      desabilitado={enviandoEditar}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="min-h-[44px]"
                      carregando={enviandoEditar}
                      desabilitado={enviandoEditar}
                    >
                      Salvar
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Visualizar Recurso */}
        {mostrarModalVisualizar && recursoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">{recursoSelecionado.nome}</h3>
                <button
                  onClick={handleFecharModalVisualizar}
                  className="text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {recursoSelecionado.tipo_recurso === 'video' ? (
                  <VideoPlayer
                    recurso={recursoSelecionado}
                    className="w-full h-96"
                  />
                ) : recursoSelecionado.tipo_recurso === 'pdf' ? (
                  <div className="w-full h-[600px] border">
                    {pdfUrl ? (
                      <iframe
                        src={pdfUrl}
                        className="w-full h-full border-0"
                        title={recursoSelecionado.nome}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-base mx-auto mb-4"></div>
                          <p className="text-gray-600">Carregando PDF...</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Arquivo ZIP: {recursoSelecionado.nome}
                    </p>
                    <Button
                      onClick={async () => {
                        try {
                          const blob = await authService.baixarRecursoArquivo(recursoSelecionado);
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `${recursoSelecionado.nome}.${recursoSelecionado.tipo_recurso}`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        } catch (error) {
                          alert('Erro ao fazer download');
                        }
                      }}
                      variant="primary"
                      icon="download"
                    >
                      Download
                    </Button>
                  </div>
                )}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {recursoSelecionado.descricao}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 capitalize">
                      {recursoSelecionado.tipo_recurso}
                    </span>
                    {recursoSelecionado.acesso_previo && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Acesso Prévio
                      </span>
                    )}
                    {recursoSelecionado.rascunho && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Rascunho
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
