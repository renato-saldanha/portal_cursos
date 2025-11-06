import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminTreinamentos from '../page';
import { authService } from '@/lib/auth';
import { useAutenticacao } from '@/lib/hooks/useApi';

jest.mock('@/lib/auth');
jest.mock('@/lib/hooks/useApi');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  })
}));

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const mockedUseAutenticacao = useAutenticacao as jest.MockedFunction<typeof useAutenticacao>;

const mockTreinamentos = [
  {
    id: 1,
    nome: 'Treinamento 1',
    descricao: 'Descrição 1',
    data_criacao: '2025-01-27T00:00:00Z',
    data_atualizacao: '2025-01-27T00:00:00Z',
    turmas: []
  },
  {
    id: 2,
    nome: 'Treinamento 2',
    descricao: 'Descrição 2',
    data_criacao: '2025-01-27T00:00:00Z',
    data_atualizacao: '2025-01-27T00:00:00Z',
    turmas: []
  }
];

describe('Item 6, 7, 8: Admin Treinamentos - CRUD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAutenticacao.mockReturnValue({
      getTreinamentos: jest.fn().mockResolvedValue(mockTreinamentos),
      getTurmas: jest.fn().mockResolvedValue([]),
      getRecursos: jest.fn().mockResolvedValue([]),
      fazerLogout: jest.fn(),
      downloadRecursoArquivo: jest.fn(),
      usuarioLogado: null,
      isClient: jest.fn().mockResolvedValue({ email: 'test@test.com', nome: 'Test' }),
      carregandoEstado: false,
      erroEstado: null,
      limparErro: jest.fn(),
      verificarAutenticacao: jest.fn().mockResolvedValue(null),
      isAutenticado: jest.fn().mockReturnValue(true),
      isConexaoValida: jest.fn().mockResolvedValue({ email: 'test@test.com', nome: 'Test' }),
      isAdm: jest.fn(),
      verificarCodigo: jest.fn(),
      reenviarCodigo: jest.fn(),
      enviarCodigoverificacao: jest.fn(),
      emailExistente: jest.fn()
    });
  });

  describe('Item 6: Criar Treinamento', () => {
    it('deve abrir modal de criação ao clicar em "Novo Treinamento"', async () => {
      render(<AdminTreinamentos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando treinamentos...')).not.toBeInTheDocument();
      });

      // Buscar botão "Novo Treinamento" (não o título do modal)
      const botoes = screen.getAllByRole('button');
      const botaoNovo = botoes.find(btn => 
        btn.textContent?.includes('Novo Treinamento') && 
        btn.type === 'button' &&
        !btn.closest('[role="dialog"]')
      );
      expect(botaoNovo).toBeInTheDocument();
      if (botaoNovo) {
        fireEvent.click(botaoNovo);
      }

      await waitFor(() => {
        // Buscar pelo heading do modal (não o botão)
        const titulos = screen.queryAllByRole('heading');
        const tituloModal = titulos.find(h => h.textContent?.includes('Novo Treinamento'));
        expect(tituloModal).toBeInTheDocument();
      });
    });

    it('deve criar treinamento com sucesso', async () => {
      mockedAuthService.criarTreinamento.mockResolvedValueOnce({
        id: 3,
        nome: 'Novo Treinamento',
        descricao: 'Nova Descrição',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        turmas: []
      });

      render(<AdminTreinamentos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando treinamentos...')).not.toBeInTheDocument();
      });

      // Buscar botão "Novo Treinamento" (não o título do modal)
      const botoes = screen.getAllByRole('button');
      const botaoNovo = botoes.find(btn => 
        btn.textContent?.includes('Novo Treinamento') && 
        btn.type === 'button' &&
        !btn.closest('[role="dialog"]')
      );
      expect(botaoNovo).toBeInTheDocument();
      if (botaoNovo) {
        fireEvent.click(botaoNovo);
      }

      await waitFor(() => {
        // Buscar pelo heading do modal (não o botão)
        const titulos = screen.queryAllByRole('heading');
        const tituloModal = titulos.find(h => h.textContent?.includes('Novo Treinamento'));
        expect(tituloModal).toBeInTheDocument();
      });

      const inputNome = screen.getByPlaceholderText('Nome do treinamento');
      fireEvent.change(inputNome, { target: { value: 'Novo Treinamento' } });

      const textareaDescricao = screen.getByPlaceholderText('Descrição do treinamento');
      fireEvent.change(textareaDescricao, { target: { value: 'Nova Descrição' } });

      const botaoCriar = screen.getByText('Criar');
      fireEvent.click(botaoCriar);

      await waitFor(() => {
        expect(mockedAuthService.criarTreinamento).toHaveBeenCalledWith(
          'Novo Treinamento',
          'Nova Descrição'
        );
      });
    });

    it('deve validar que nome é obrigatório', async () => {
      render(<AdminTreinamentos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando treinamentos...')).not.toBeInTheDocument();
      });

      // Buscar botão "Novo Treinamento" (não o título do modal)
      const botoes = screen.getAllByRole('button');
      const botaoNovo = botoes.find(btn => 
        btn.textContent?.includes('Novo Treinamento') && 
        btn.type === 'button' &&
        !btn.closest('[role="dialog"]')
      );
      expect(botaoNovo).toBeInTheDocument();
      if (botaoNovo) {
        fireEvent.click(botaoNovo);
      }

      await waitFor(() => {
        // Buscar pelo heading do modal (não o botão)
        const titulos = screen.queryAllByRole('heading');
        const tituloModal = titulos.find(h => h.textContent?.includes('Novo Treinamento'));
        expect(tituloModal).toBeInTheDocument();
      });

      const botaoCriar = screen.getByText('Criar');
      fireEvent.click(botaoCriar);

      await waitFor(() => {
        const mensagensErro = screen.queryAllByText('Nome é obrigatório');
        expect(mensagensErro.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Item 7: Editar Treinamento', () => {
    it('deve abrir modal de edição com dados pré-preenchidos', async () => {
      render(<AdminTreinamentos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando treinamentos...')).not.toBeInTheDocument();
      });

      const botoesEditar = screen.getAllByText('Editar');
      fireEvent.click(botoesEditar[0]);

      await waitFor(() => {
        expect(screen.getByText('Editar Treinamento')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Treinamento 1')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Descrição 1')).toBeInTheDocument();
      });
    });

    it('deve atualizar treinamento com sucesso', async () => {
      mockedAuthService.atualizarTreinamento.mockResolvedValueOnce({
        id: 1,
        nome: 'Treinamento Atualizado',
        descricao: 'Descrição Atualizada',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        turmas: []
      });

      render(<AdminTreinamentos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando treinamentos...')).not.toBeInTheDocument();
      });

      const botoesEditar = screen.getAllByText('Editar');
      fireEvent.click(botoesEditar[0]);

      await waitFor(() => {
        expect(screen.getByText('Editar Treinamento')).toBeInTheDocument();
      });

      const inputNome = screen.getByDisplayValue('Treinamento 1');
      fireEvent.change(inputNome, { target: { value: 'Treinamento Atualizado' } });

      const botaoSalvar = screen.getByText('Salvar');
      fireEvent.click(botaoSalvar);

      await waitFor(() => {
        expect(mockedAuthService.atualizarTreinamento).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            nome: 'Treinamento Atualizado'
          })
        );
      });
    });
  });

  describe('Item 8: Excluir Treinamento', () => {
    it('deve abrir modal de exclusão', async () => {
      render(<AdminTreinamentos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando treinamentos...')).not.toBeInTheDocument();
      });

      // Buscar botão de excluir do card (primeiro que não está em um modal)
      await waitFor(() => {
        const botoesExcluir = screen.getAllByText('Excluir');
        expect(botoesExcluir.length).toBeGreaterThan(0);
        // O primeiro botão "Excluir" é do card, não do modal
        fireEvent.click(botoesExcluir[0]);
      });

      await waitFor(() => {
        expect(screen.getByText('Excluir Treinamento')).toBeInTheDocument();
        // O texto está dividido entre elementos, então buscar por partes
        expect(screen.getByText(/Tem certeza que deseja excluir o treinamento/)).toBeInTheDocument();
        // Usar getAllByText para encontrar todos os elementos com "Treinamento 1"
        const textosTreinamento = screen.getAllByText(/Treinamento 1/i);
        expect(textosTreinamento.length).toBeGreaterThan(0);
      });
    });

    it('deve excluir treinamento sem turmas associadas', async () => {
      mockedAuthService.excluirTreinamento.mockResolvedValueOnce(true);

      render(<AdminTreinamentos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando treinamentos...')).not.toBeInTheDocument();
      });

      // Buscar botão de excluir do card
      const botoesExcluir = screen.getAllByRole('button');
      const botaoExcluirCard = botoesExcluir.find(btn => 
        btn.getAttribute('aria-label')?.includes('Excluir') ||
        (btn.textContent?.includes('Excluir') && !btn.closest('[role="dialog"]'))
      );
      expect(botaoExcluirCard).toBeInTheDocument();
      if (botaoExcluirCard) {
        fireEvent.click(botaoExcluirCard);
      }

      await waitFor(() => {
        expect(screen.getByText('Excluir Treinamento')).toBeInTheDocument();
      });

      // Buscar botão de confirmar exclusão dentro do modal (depois que o modal foi aberto)
      await waitFor(() => {
        // Após o modal abrir, buscar o botão dentro do modal
        const modal = screen.getByText('Excluir Treinamento').closest('div')?.parentElement?.parentElement;
        if (modal) {
          const botoesNoModal = Array.from(modal.querySelectorAll('button'));
          const botaoConfirmar = botoesNoModal.find(btn => 
            btn.textContent?.includes('Excluir') && 
            (btn.className?.includes('bg-red') || btn.className?.includes('red'))
          );
          expect(botaoConfirmar).toBeInTheDocument();
          if (botaoConfirmar) {
            fireEvent.click(botaoConfirmar);
          }
        } else {
          // Fallback: buscar todos os botões e pegar o último que contém "Excluir" e está habilitado
          const botoesExcluir = screen.getAllByText('Excluir');
          const botaoConfirmar = botoesExcluir.find(btn => 
            btn.className?.includes('bg-red') && !btn.disabled
          ) || botoesExcluir[botoesExcluir.length - 1];
          expect(botaoConfirmar).toBeInTheDocument();
          fireEvent.click(botaoConfirmar);
        }
      });

      await waitFor(() => {
        expect(mockedAuthService.excluirTreinamento).toHaveBeenCalledWith(1);
      });
    });

    it('deve impedir exclusão se tiver turmas associadas', async () => {
      const treinamentoComTurmas = {
        ...mockTreinamentos[0],
        turmas: [{ id: 1, nome: 'Turma A' }]
      };

      mockedUseAutenticacao.mockReturnValue({
        getTreinamentos: jest.fn().mockResolvedValue([treinamentoComTurmas]),
        getTurmas: jest.fn().mockResolvedValue([]),
        getRecursos: jest.fn().mockResolvedValue([]),
        fazerLogout: jest.fn(),
        downloadRecursoArquivo: jest.fn(),
        usuarioLogado: null,
        isClient: jest.fn().mockResolvedValue({ email: 'test@test.com', nome: 'Test' }),
        carregandoEstado: false,
        erroEstado: null,
        limparErro: jest.fn(),
        verificarAutenticacao: jest.fn().mockResolvedValue(null),
        isAutenticado: jest.fn().mockReturnValue(true),
        isConexaoValida: jest.fn().mockResolvedValue({ email: 'test@test.com', nome: 'Test' }),
        isAdm: jest.fn(),
        verificarCodigo: jest.fn(),
        reenviarCodigo: jest.fn(),
        enviarCodigoverificacao: jest.fn(),
        emailExistente: jest.fn()
      });

      render(<AdminTreinamentos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando treinamentos...')).not.toBeInTheDocument();
      });

      // Buscar botão de excluir do card
      const botoesExcluir = screen.getAllByRole('button');
      const botaoExcluirCard = botoesExcluir.find(btn => 
        btn.getAttribute('aria-label')?.includes('Excluir') ||
        (btn.textContent?.includes('Excluir') && !btn.closest('[role="dialog"]'))
      );
      expect(botaoExcluirCard).toBeInTheDocument();
      if (botaoExcluirCard) {
        fireEvent.click(botaoExcluirCard);
      }

      await waitFor(() => {
        expect(screen.getByText('Excluir Treinamento')).toBeInTheDocument();
        expect(screen.getByText(/Atenção: Este treinamento possui 1 turma/)).toBeInTheDocument();
      });

      // Buscar botão Excluir dentro do modal (deve estar desabilitado)
      await waitFor(() => {
        const modal = screen.getByText('Excluir Treinamento').closest('div')?.parentElement?.parentElement;
        if (modal) {
          const botoesNoModal = Array.from(modal.querySelectorAll('button'));
          const botaoExcluirModal = botoesNoModal.find(btn => 
            btn.textContent?.includes('Excluir') && 
            (btn.className?.includes('bg-red') || btn.className?.includes('red'))
          );
          expect(botaoExcluirModal).toBeInTheDocument();
          if (botaoExcluirModal) {
            expect(botaoExcluirModal).toBeDisabled();
          }
        } else {
          // Fallback: buscar todos os botões e encontrar o desabilitado
          const botoesExcluir = screen.getAllByText('Excluir');
          const botaoExcluirModal = botoesExcluir.find(btn => 
            btn.className?.includes('bg-red') && btn.disabled
          ) || botoesExcluir[botoesExcluir.length - 1];
          expect(botaoExcluirModal).toBeInTheDocument();
          expect(botaoExcluirModal).toBeDisabled();
        }
      });
    });
  });
});

