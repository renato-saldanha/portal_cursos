'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { Turma, Treinamento } from '@/types';
import { Calendar, Users, X } from 'lucide-react';
import { formatarData } from '@/utils/utils';
import { useAutenticacao } from '@/lib/hooks/useApi';
import { useRouter } from 'next/navigation';
import BotaoVoltar from '@/components/BotaoVoltar';
import Card from '@/components/Card';
import Header from '@/components/Header';
import { authService } from '@/lib/auth';
import Input from '@/components/Input';

export default function AdminTurmas() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [treinamentos, setTreinamentos] = useState<Treinamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mostrarModalCriar, setMostrarModalCriar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [formData, setFormData] = useState({
    treinamento: '',
    nome: '',
    data_inicio: '',
    data_conclusao: '',
    link_acesso: ''
  });
  const [enviando, setEnviando] = useState(false);
  const { getTurmas, getTreinamentos } = useAutenticacao();
  const router = useRouter();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro('');
      const [turmasData, treinamentosData] = await Promise.all([
        getTurmas(),
        getTreinamentos()
      ]);
      if (turmasData) setTurmas(turmasData);
      if (treinamentosData) setTreinamentos(treinamentosData);
    } catch (e) {
      setErro('Erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  };

  const getCorStatus = (turma: Turma) => {
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

  const handleVoltar = () => {
    router.back();
  }

  const handleAbrirModalCriar = () => {
    setFormData({
      treinamento: '',
      nome: '',
      data_inicio: '',
      data_conclusao: '',
      link_acesso: ''
    });
    setErro('');
    setMostrarModalCriar(true);
  };

  const handleFecharModalCriar = () => {
    setMostrarModalCriar(false);
    setFormData({
      treinamento: '',
      nome: '',
      data_inicio: '',
      data_conclusao: '',
      link_acesso: ''
    });
    setErro('');
  };

  const handleAbrirModalEditar = (turma: Turma) => {
    setTurmaSelecionada(turma);
    setFormData({
      treinamento: turma.treinamento.toString(),
      nome: turma.nome,
      data_inicio: turma.data_inicio.split('T')[0],
      data_conclusao: turma.data_conclusao.split('T')[0],
      link_acesso: turma.link_acesso || ''
    });
    setErro('');
    setMostrarModalEditar(true);
  };

  const handleFecharModalEditar = () => {
    setMostrarModalEditar(false);
    setTurmaSelecionada(null);
    setFormData({
      treinamento: '',
      nome: '',
      data_inicio: '',
      data_conclusao: '',
      link_acesso: ''
    });
    setErro('');
  };

  const handleAbrirModalExcluir = (turma: Turma) => {
    setTurmaSelecionada(turma);
    setMostrarModalExcluir(true);
  };

  const handleFecharModalExcluir = () => {
    setMostrarModalExcluir(false);
    setTurmaSelecionada(null);
  };

  const handleCriarTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.treinamento || !formData.nome.trim() || !formData.data_inicio || !formData.data_conclusao) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    const dataInicio = new Date(formData.data_inicio);
    const dataConclusao = new Date(formData.data_conclusao);

    if (dataInicio >= dataConclusao) {
      setErro('A data de início deve ser anterior à data de conclusão');
      return;
    }

    try {
      setEnviando(true);
      setErro('');
      await authService.criarTurma({
        treinamento: parseInt(formData.treinamento),
        nome: formData.nome,
        data_inicio: formData.data_inicio,
        data_conclusao: formData.data_conclusao,
        link_acesso: formData.link_acesso || undefined
      });
      await carregarDados();
      handleFecharModalCriar();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao criar turma');
    } finally {
      setEnviando(false);
    }
  };

  const handleEditarTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!turmaSelecionada) return;
    
    if (!formData.nome.trim() || !formData.data_inicio || !formData.data_conclusao) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    const dataInicio = new Date(formData.data_inicio);
    const dataConclusao = new Date(formData.data_conclusao);

    if (dataInicio >= dataConclusao) {
      setErro('A data de início deve ser anterior à data de conclusão');
      return;
    }

    try {
      setEnviando(true);
      setErro('');
      await authService.atualizarTurma(turmaSelecionada.id, {
        treinamento: parseInt(formData.treinamento),
        nome: formData.nome,
        data_inicio: formData.data_inicio,
        data_conclusao: formData.data_conclusao,
        link_acesso: formData.link_acesso || undefined
      });
      await carregarDados();
      handleFecharModalEditar();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao atualizar turma');
    } finally {
      setEnviando(false);
    }
  };

  const handleExcluirTurma = async () => {
    if (!turmaSelecionada) return;

    if (turmaSelecionada.recursos && turmaSelecionada.recursos.length > 0) {
      setErro('Não é possível excluir turma com recursos associados');
      return;
    }

    try {
      setEnviando(true);
      setErro('');
      await authService.excluirTurma(turmaSelecionada.id);
      await carregarDados();
      handleFecharModalExcluir();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao excluir turma');
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-base mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando turmas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-6">
      <Header
        titulo='Turmas'
        descricao='Gerencie as turmas e seus status' />
      <BotaoVoltar
        onClick={handleVoltar}
      />

      {erro && !mostrarModalCriar && !mostrarModalEditar && !mostrarModalExcluir && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-3xl mx-auto">
          <p className="text-red-600 text-center">{erro}</p>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <Button variant="primary" onClick={handleAbrirModalCriar} icon="plus">
          Nova Turma
        </Button>
      </div>

      {turmas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma turma cadastrada</h3>
          <p className="text-gray-600 mb-4">Crie uma turma para começar</p>
          <Button variant="primary" onClick={handleAbrirModalCriar} icon="plus">
            Nova Turma
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {turmas.map((turma) => (
            <Card
              key={turma.id}
              id={turma.id}
              titulo={turma.nome}>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />Início: {formatarData(turma.data_inicio, 'tudo')}</div>
                <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />Fim: {formatarData(turma.data_conclusao, 'tudo')}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getCorStatus(turma).cor}`}>{turma.status}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" />{turma.recursos?.length || 0} recursos</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button 
                  variant="secondary" 
                  className="min-h-[44px] p-2 flex-1 sm:flex-none"
                  onClick={() => handleAbrirModalEditar(turma)}
                  icon="edit"
                >
                  Editar
                </Button>
                <Button variant="secondary" className="min-h-[44px] p-2 flex-1 sm:flex-none">
                  Recursos
                </Button>
                <Button 
                  variant="secondary" 
                  className="min-h-[44px] p-2 text-red-dark hover:text-red-dark flex-1 sm:flex-none"
                  onClick={() => handleAbrirModalExcluir(turma)}
                  icon="trash"
                >
                  Excluir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Criar Turma */}
      {mostrarModalCriar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Nova Turma
                </h2>
                <button
                  onClick={handleFecharModalCriar}
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

              <form onSubmit={handleCriarTurma} className="space-y-4">
                <div>
                  <label className="label-md text-orange-base mb-2 block">
                    TREINAMENTO *
                  </label>
                  <select
                    value={formData.treinamento}
                    onChange={(e) => setFormData({ ...formData, treinamento: e.target.value })}
                    className="input-base min-h-[44px] w-full"
                    required
                  >
                    <option value="">Selecione um treinamento</option>
                    {treinamentos.map((treinamento) => (
                      <option key={treinamento.id} value={treinamento.id}>
                        {treinamento.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="NOME *"
                  type="text"
                  placeholder="Nome da turma"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-md text-orange-base mb-2 block">
                      DATA INÍCIO *
                    </label>
                    <input
                      type="date"
                      value={formData.data_inicio}
                      onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                      className="input-base min-h-[44px] w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-md text-orange-base mb-2 block">
                      DATA CONCLUSÃO *
                    </label>
                    <input
                      type="date"
                      value={formData.data_conclusao}
                      onChange={(e) => setFormData({ ...formData, data_conclusao: e.target.value })}
                      className="input-base min-h-[44px] w-full"
                      required
                    />
                  </div>
                </div>

                <Input
                  label="LINK DE ACESSO (OPCIONAL)"
                  type="text"
                  placeholder="https://..."
                  value={formData.link_acesso}
                  onChange={(e) => setFormData({ ...formData, link_acesso: e.target.value })}
                />

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleFecharModalCriar}
                    className="min-h-[44px]"
                    desabilitado={enviando}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="min-h-[44px]"
                    carregando={enviando}
                    desabilitado={enviando}
                  >
                    Criar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Turma */}
      {mostrarModalEditar && turmaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Editar Turma
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

              <form onSubmit={handleEditarTurma} className="space-y-4">
                <div>
                  <label className="label-md text-orange-base mb-2 block">
                    TREINAMENTO *
                  </label>
                  <select
                    value={formData.treinamento}
                    onChange={(e) => setFormData({ ...formData, treinamento: e.target.value })}
                    className="input-base min-h-[44px] w-full"
                    required
                  >
                    <option value="">Selecione um treinamento</option>
                    {treinamentos.map((treinamento) => (
                      <option key={treinamento.id} value={treinamento.id}>
                        {treinamento.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="NOME *"
                  type="text"
                  placeholder="Nome da turma"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-md text-orange-base mb-2 block">
                      DATA INÍCIO *
                    </label>
                    <input
                      type="date"
                      value={formData.data_inicio}
                      onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                      className="input-base min-h-[44px] w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-md text-orange-base mb-2 block">
                      DATA CONCLUSÃO *
                    </label>
                    <input
                      type="date"
                      value={formData.data_conclusao}
                      onChange={(e) => setFormData({ ...formData, data_conclusao: e.target.value })}
                      className="input-base min-h-[44px] w-full"
                      required
                    />
                  </div>
                </div>

                <Input
                  label="LINK DE ACESSO (OPCIONAL)"
                  type="text"
                  placeholder="https://..."
                  value={formData.link_acesso}
                  onChange={(e) => setFormData({ ...formData, link_acesso: e.target.value })}
                />

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleFecharModalEditar}
                    className="min-h-[44px]"
                    desabilitado={enviando}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="min-h-[44px]"
                    carregando={enviando}
                    desabilitado={enviando}
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Excluir Turma */}
      {mostrarModalExcluir && turmaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Excluir Turma
                </h2>
                <button
                  onClick={handleFecharModalExcluir}
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

              <p className="text-gray-700 mb-6">
                Tem certeza que deseja excluir a turma <strong>{turmaSelecionada.nome}</strong>?
                {turmaSelecionada.recursos && turmaSelecionada.recursos.length > 0 && (
                  <span className="block mt-2 text-red-600">
                    Atenção: Esta turma possui {turmaSelecionada.recursos.length} recurso(s) associado(s).
                  </span>
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleFecharModalExcluir}
                  className="min-h-[44px]"
                  desabilitado={enviando}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleExcluirTurma}
                  className="min-h-[44px] bg-red-600 hover:bg-red-700"
                  carregando={enviando}
                  desabilitado={enviando || (turmaSelecionada.recursos && turmaSelecionada.recursos.length > 0)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
