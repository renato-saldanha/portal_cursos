'use client';

import { useState, useEffect } from 'react';
import { useAutenticacao } from '@/lib/hooks/useApi';
import { authService } from '@/lib/auth';
import VideoPlayer from '@/components/VideoPlayer';
import Button from '@/components/Button';
import { Play, Download, FileText, Archive, Calendar, Clock, Users } from 'lucide-react';
import { formatarData } from '@/utils/utils';
import { Recurso, Treinamento, Turma, LoginData } from '@/types';

export default function DashboardAluno() {
  const [treinamentos, setTreinamentos] = useState<Treinamento[]>([]);
  const [recursosSelecionados, setRecursosSelecionados] = useState<Recurso[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [recursoSelecionado, setRecursoSelecionado] = useState<Recurso | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [usuario, setUsuario] = useState<LoginData | null>(null);

  const { fazerLogout, downloadRecursoArquivo, usuarioLogado } = useAutenticacao();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    carregarTreinamentos();
  }, []);

  // Observa mudanças no usuarioLogado e atualiza o estado local
  useEffect(() => {
    if (usuarioLogado) {
      setUsuario(usuarioLogado);
    }
  }, [usuarioLogado]);

  const carregarTreinamentos = async () => {
    try {
      setCarregando(true);
      setErro('');

      const resultado = await authService.buscarTreinamentosAluno();

      if (resultado.sucesso && resultado.treinamentos) {
        setTreinamentos(resultado.treinamentos);
      } else {
        setErro(resultado.erro || 'Erro ao carregar treinamentos');
      }
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error);
      setErro('Erro ao carregar dados. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleExit = () => {
    fazerLogout();
  };

  const selecionarTurma = (turma: Turma) => {
    setTurmaSelecionada(turma);

    const recursosAcessiveis = turma.recursos.filter(recurso => recurso.is_acessivel);
    setRecursosSelecionados(recursosAcessiveis);
  };

  const getStatusTurma = (turma: Turma) => {
    const status = turma.status;
    let corStatus;
    switch (status) {
      case 'Aguardando':
        corStatus = 'text-red-dark bg-red-light';
        break;
      case 'Finalizada':
        corStatus = 'text-gray-dark bg-gray-100';
        break;
      default:
        corStatus = 'text-green-dark bg-green-light';
    }

    return {
      status: turma.status,
      cor: corStatus,
    };
  };

  const getIconeRecurso = (tipo: string) => {
    switch (tipo) {
      case 'video': return Play;
      case 'pdf': return FileText;
      case 'zip': return Archive;
      default: return FileText;
    }
  };

  const abrirRecurso = async (recurso: Recurso) => {
    if (recurso.tipo_recurso === 'video') {
      setRecursoSelecionado(recurso);
    } else {
      await handleDownloadRecurso(recurso);
    }
  };

  const fecharPlayer = () => {
    setRecursoSelecionado(null);
  };

  const handleDownloadRecurso = async (recurso: Recurso) => {
    try {
      const response = await downloadRecursoArquivo(recurso);

      if (!response) {
        setErro('Erro ao baixar o recurso');
        return;
      }

      const blob = new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${recurso.nome}.${recurso.tipo_recurso}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      setErro('Erro ao baixar o recurso');
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-base mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus treinamentos...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <p className="text-red-600 mb-4">{erro}</p>
          <Button onClick={carregarTreinamentos} variant="primary">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/background.jpg)' }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 w-full'>
          <div className="w-full sm:flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 text-orange-light text-center sm:text-left">
              Seus Cursos estão aqui!
            </h1>
            <p className="text-white text-center sm:text-left text-base sm:text-lg lg:text-xl xl:text-2xl">
              Acesse seus treinamentos abaixo
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {usuario && (
              <div className='bg-orange-50 p-2 sm:p-4 rounded-lg'>
                <p className='text-black text-sm sm:text-base truncate max-w-[150px] sm:max-w-none'>Bem vindo {usuario.nome}</p>
              </div>
            )}
            <Button
              icon="exit"
              key="exit"
              type="button"
              variant="secondary"
              size="md"
              className="min-w-[80px] sm:w-auto"
              onClick={handleExit}
            >
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Lista de Treinamentos */}
          <div className="lg:col-span-1 ">
            <div className={`bg-gradient-to-br from-orange-semi to-orange-dark rounded-3xl p-4 sm:p-6 text-white`}            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 ">Treinamentos</h2>
              {treinamentos.length === 0 ? (
                <p className="text-white text-center py-8">
                  Você não está matriculado em nenhum treinamento
                </p>
              ) : (
                <div className={`space-y-4 `}>
                  {treinamentos.map((treinamento) => (
                    <div key={treinamento.id} className="border border-orange-light rounded-lg p-3 sm:p-4">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 break-words">
                        {treinamento.nome}
                      </h3>
                      <p className="text-sm sm:text-base mb-3 break-words">
                        {treinamento.descricao}
                      </p>
                      <div className="space-y-2">
                        {treinamento.turmas.map((turma) => {
                          const { status, cor } = getStatusTurma(turma);
                          return (
                            <div key={turma.id}>
                              <div
                                onClick={() => selecionarTurma(turma)}
                                className={` group w-full text-left p-3 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer ${turmaSelecionada?.id === turma.id
                                  ? 'border-orange-base bg-orange-light hover:bg-orange-mid hover:text-orange-dark'
                                  : 'border-orange-light hover:border-orange-base hover:bg-orange-light'
                                  }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`font-medium text-sm ${turmaSelecionada?.id === turma.id
                                    ? 'group-hover:text-orange-light text-orange-dark '
                                    : ''}`}>
                                    {turma.nome}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${cor}`}>
                                    {status}
                                  </span>
                                </div>
                                <div className={`flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm lg:text-base ${turmaSelecionada?.id === turma.id
                                  ? 'text-orange-dark group-hover:text-orange-light'
                                  : ''}`}>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 flex-shrink-0" />
                                    <span className="break-words">{formatarData(turma.data_inicio, 'tudo')}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3 flex-shrink-0" />
                                    <span>{turma.recursos.length} recursos</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recursos da Turma Selecionada */}
          <div className="lg:col-span-2">
            {turmaSelecionada ? (
              <div className="space-y-6 text-blue-base">
                {/* Info da Turma */}
                <div className="bg-orange-light rounded-3xl shadow-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold break-words">{turmaSelecionada.nome}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm flex-shrink-0 ${getStatusTurma(turmaSelecionada).cor}`}>
                      {getStatusTurma(turmaSelecionada).status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Início: {formatarData(turmaSelecionada.data_inicio, 'tudo')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Fim: {formatarData(turmaSelecionada.data_conclusao, 'tudo')}</span>
                    </div>
                  </div>

                  {turmaSelecionada.link_acesso && (
                    <div className="mt-4">
                      <Button
                        onClick={() => window.open(turmaSelecionada.link_acesso, '_blank')}
                        variant="secondary"
                        className={`w-full text-blue-base hover:text-blue-dark transition-all duration-500 hover:scale-105`}
                      >
                        Acessar Turma Online
                      </Button>
                    </div>
                  )}
                </div>

                {/* Lista de Recursos */}
                <div className="bg-orange-semi rounded-3xl shadow-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">Recursos Disponíveis</h3>

                  {recursosSelecionados.length === 0 ? (
                    <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
                      Nenhum recurso disponível no momento
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {recursosSelecionados.map((recurso) => {
                        const Icone = getIconeRecurso(recurso.tipo_recurso);
                        return (
                          <div
                            key={recurso.id}
                            className={`bg-black rounded-lg p-3 sm:p-4 hover:border-orange-base transition-all  ${recurso.tipo_recurso === 'video' ? 'duration-300 hover:scale-105 cursor-pointer' : ''}`}
                            onClick={() => abrirRecurso(recurso)}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div className="p-2 bg-blue-light rounded-full flex-shrink-0">
                                <Icone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-dark" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white mb-1 text-sm sm:text-base break-words">
                                  {recurso.nome}
                                </h4>
                                <p className="text-xs sm:text-sm text-white mb-2 line-clamp-2 break-words">
                                  {recurso.descricao}
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs capitalize text-white">
                                    {recurso.tipo_recurso}
                                  </span>
                                  {recurso.acesso_previo && (
                                    <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                                      Acesso Prévio
                                    </span>
                                  )}
                                </div>
                              </div>
                              {recurso.tipo_recurso === 'video' && (
                                <div className="text-xs p-1 px-2 bg-orange-mid border-none rounded-lg text-white flex-shrink-0 whitespace-nowrap">
                                  Clique para assistir
                                </div>
                              )}
                              {recurso.tipo_recurso !== 'video' && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="min-h-[44px] p-2 sm:p-2 flex-shrink-0"
                                  onClick={() => {
                                    handleDownloadRecurso(recurso);
                                  }}
                                >
                                  <span className="hidden sm:inline">Download</span>
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecione uma Turma
                </h3>
                <p className="text-gray-600">
                  Escolha uma turma para visualizar os recursos disponíveis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal do Player de Vídeo */}
      {recursoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{recursoSelecionado.nome}</h3>
              <Button
                onClick={fecharPlayer}
                variant="secondary"
                size="sm"
                className="p-2"
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <VideoPlayer
                recurso={recursoSelecionado}
                className="w-full h-96"
              />
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {recursoSelecionado.descricao}
                </p>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 capitalize">
                      {recursoSelecionado.tipo_recurso}
                    </span>
                    {recursoSelecionado.acesso_previo && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Acesso Prévio
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => handleDownloadRecurso(recursoSelecionado)}
                    variant="secondary"
                    size="sm"
                    className="min-h-[44px]"
                    icon="download"
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
