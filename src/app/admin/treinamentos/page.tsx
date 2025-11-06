'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Button from '@/components/Button';
import { Treinamento } from '@/types';
import { Calendar, Users, X } from 'lucide-react';
import { formatarData } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { useAutenticacao } from '@/lib/hooks/useApi';
import BotaoVoltar from '@/components/BotaoVoltar';
import Card from '@/components/Card';
import Header from '@/components/Header';
import { authService } from '@/lib/auth';
import Input from '@/components/Input';

export default function AdminTreinamentos() {
  const [treinamentos, setTreinamentos] = useState<Treinamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mostrarModalCriar, setMostrarModalCriar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [treinamentoSelecionado, setTreinamentoSelecionado] = useState<Treinamento | null>(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();
  const { getTreinamentos } = useAutenticacao();

  useEffect(() => {
    carregarTreinamentos();
  }, []);

  const carregarTreinamentos = async () => {
    try {
      setCarregando(true);
      setErro('');
      const resultado = await getTreinamentos();

      if (resultado) setTreinamentos(resultado);
    } catch {
      setErro('Erro ao carregar treinamentos');
    } finally {
      setCarregando(false);
    }
  };

  const handleVoltar = () => {
    router.back();
  }

  const handleAbrirModalCriar = () => {
    setFormData({ nome: '', descricao: '' });
    setErro('');
    setMostrarModalCriar(true);
  };

  const handleFecharModalCriar = () => {
    setMostrarModalCriar(false);
    setFormData({ nome: '', descricao: '' });
    setErro('');
  };

  const handleAbrirModalEditar = (treinamento: Treinamento) => {
    setTreinamentoSelecionado(treinamento);
    setFormData({ nome: treinamento.nome, descricao: treinamento.descricao });
    setErro('');
    setMostrarModalEditar(true);
  };

  const handleFecharModalEditar = () => {
    setMostrarModalEditar(false);
    setTreinamentoSelecionado(null);
    setFormData({ nome: '', descricao: '' });
    setErro('');
  };

  const handleAbrirModalExcluir = (treinamento: Treinamento) => {
    setTreinamentoSelecionado(treinamento);
    setMostrarModalExcluir(true);
  };

  const handleFecharModalExcluir = () => {
    setMostrarModalExcluir(false);
    setTreinamentoSelecionado(null);
  };

  const handleCriarTreinamento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      setErro('Nome é obrigatório');
      return;
    }

    try {
      setEnviando(true);
      setErro('');
      await authService.criarTreinamento(formData.nome, formData.descricao);
      await carregarTreinamentos();
      handleFecharModalCriar();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao criar treinamento');
    } finally {
      setEnviando(false);
    }
  };

  const handleEditarTreinamento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!treinamentoSelecionado) return;
    
    if (!formData.nome.trim()) {
      setErro('Nome é obrigatório');
      return;
    }

    try {
      setEnviando(true);
      setErro('');
      await authService.atualizarTreinamento(treinamentoSelecionado.id, {
        nome: formData.nome,
        descricao: formData.descricao
      });
      await carregarTreinamentos();
      handleFecharModalEditar();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao atualizar treinamento');
    } finally {
      setEnviando(false);
    }
  };

  const handleExcluirTreinamento = async () => {
    if (!treinamentoSelecionado) return;

    if (treinamentoSelecionado.turmas && treinamentoSelecionado.turmas.length > 0) {
      setErro('Não é possível excluir treinamento com turmas associadas');
      return;
    }

    try {
      setEnviando(true);
      setErro('');
      await authService.excluirTreinamento(treinamentoSelecionado.id);
      await carregarTreinamentos();
      handleFecharModalExcluir();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao excluir treinamento');
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-base mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando treinamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-6">
      <Header
        titulo='Treinamentos'
        descricao='Gerencie os treinamentos disponíveis' />
      <BotaoVoltar
        onClick={handleVoltar}
      />

      {erro && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-3xl mx-auto">
          <p className="text-red-600 text-center">{erro}</p>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <Button variant="primary" onClick={handleAbrirModalCriar} icon="plus">
          Novo Treinamento
        </Button>
      </div>

      {!Array.isArray(treinamentos) || treinamentos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum treinamento cadastrado</h3>
          <p className="text-gray-600 mb-4">Crie um treinamento para começar</p>
          <Button variant="primary" onClick={handleAbrirModalCriar} icon="plus">
            Novo Treinamento
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {treinamentos.map((treinamento) => (
            <Card
              key={treinamento.id}
              id={treinamento.id}
              titulo={treinamento.nome}
              descricao={treinamento.descricao}>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />{formatarData(treinamento.data_criacao, 'tudo')}
                </div>
                <span>Turmas: {treinamento.turmas?.length || 0}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="secondary" 
                  className="min-h-[44px] p-2 flex-1 sm:flex-none"
                  onClick={() => handleAbrirModalEditar(treinamento)}
                  icon="edit"
                >
                  Editar
                </Button>
                <Button 
                  variant="secondary" 
                  className="min-h-[44px] p-2 flex-1 sm:flex-none"
                  onClick={() => handleAbrirModalExcluir(treinamento)}
                  icon="trash"
                >
                  Excluir
                </Button>
                <Button 
                  variant="secondary" 
                  className="min-h-[44px] p-2 flex-1 sm:flex-none"
                  onClick={() => router.push(`/admin/turmas?treinamento=${treinamento.id}`)}
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  Gerenciar Turmas
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Criar Treinamento */}
      {mostrarModalCriar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Novo Treinamento
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

              <form onSubmit={handleCriarTreinamento} className="space-y-4">
                <Input
                  label="NOME *"
                  type="text"
                  placeholder="Nome do treinamento"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />

                <div>
                  <label className="label-md text-orange-base mb-2 block">
                    DESCRIÇÃO
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição do treinamento"
                    className="input-base min-h-[100px] resize-none w-full"
                    rows={4}
                  />
                </div>

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

      {/* Modal Editar Treinamento */}
      {mostrarModalEditar && treinamentoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Editar Treinamento
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

              <form onSubmit={handleEditarTreinamento} className="space-y-4">
                <Input
                  label="NOME *"
                  type="text"
                  placeholder="Nome do treinamento"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />

                <div>
                  <label className="label-md text-orange-base mb-2 block">
                    DESCRIÇÃO
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição do treinamento"
                    className="input-base min-h-[100px] resize-none w-full"
                    rows={4}
                  />
                </div>

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

      {/* Modal Excluir Treinamento */}
      {mostrarModalExcluir && treinamentoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Excluir Treinamento
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
                Tem certeza que deseja excluir o treinamento <strong>{treinamentoSelecionado.nome}</strong>?
                {treinamentoSelecionado.turmas && treinamentoSelecionado.turmas.length > 0 && (
                  <span className="block mt-2 text-red-600">
                    Atenção: Este treinamento possui {treinamentoSelecionado.turmas.length} turma(s) associada(s).
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
                  onClick={handleExcluirTreinamento}
                  className="min-h-[44px] bg-red-600 hover:bg-red-700"
                  carregando={enviando}
                  desabilitado={enviando || (treinamentoSelecionado.turmas && treinamentoSelecionado.turmas.length > 0)}
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


