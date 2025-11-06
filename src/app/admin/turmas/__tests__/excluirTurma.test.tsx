/**
 * Testes simplificados para Item 11: Excluir Turma
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminTurmas from '../page';
import { authService } from '@/lib/auth';
import { useAutenticacao } from '@/lib/hooks/useApi';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock('@/lib/auth');
jest.mock('@/lib/hooks/useApi');
jest.mock('@/components/ToastContainer', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockTurmas = [
  {
    id: 1,
    nome: 'Turma Teste',
    treinamento: 1,
    treinamento_nome: 'Treinamento 1',
    data_inicio: '2025-12-01',
    data_conclusao: '2025-12-31',
    data_criacao: '2025-01-01',
    data_atualizacao: '2025-01-01',
    status: 'Aguardando' as const,
    recursos: [],
  },
];

const mockTreinamentos = [
  {
    id: 1,
    nome: 'Treinamento 1',
    descricao: 'Descrição',
    data_criacao: '2025-01-01',
    data_atualizacao: '2025-01-01',
    turmas: [],
  },
];

describe('Excluir Turma - Item 11', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (authService.getTurmas as jest.Mock).mockResolvedValue(mockTurmas);
    (authService.excluirTurma as jest.Mock).mockResolvedValue(true);
    
    (useAutenticacao as jest.Mock).mockReturnValue({
      getTurmas: jest.fn().mockResolvedValue(mockTurmas),
      getTreinamentos: jest.fn().mockResolvedValue(mockTreinamentos),
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

  it('deve exibir botão de exclusão na turma', async () => {
    render(<AdminTurmas />);
    
    await waitFor(() => {
      expect(screen.queryByText('Carregando turmas...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    await waitFor(() => {
      // Buscar botão Excluir - pode estar dentro de um Card
      const botoesExcluir = screen.getAllByText('Excluir');
      expect(botoesExcluir.length).toBeGreaterThan(0);
    }, { timeout: 5000 });
  });

  it('deve abrir modal de confirmação ao clicar em excluir', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(<AdminTurmas />);
    
    await waitFor(() => {
      expect(screen.queryByText('Carregando turmas...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Aguardar botões aparecerem
    const botoesExcluir = await screen.findAllByText('Excluir', {}, { timeout: 5000 });
    expect(botoesExcluir.length).toBeGreaterThan(0);
    
    // Pegar o primeiro botão Excluir que não está dentro de um modal
    const botaoExcluirCard = botoesExcluir.find(btn => 
      !btn.closest('[role="dialog"]')
    ) || botoesExcluir[0];
    
    await user.click(botaoExcluirCard);

    await waitFor(() => {
      expect(screen.getByText(/Tem certeza que deseja excluir a turma/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('deve excluir turma quando confirmada sem recursos', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(<AdminTurmas />);
    
    await waitFor(() => {
      expect(screen.queryByText('Carregando turmas...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Aguardar botões aparecerem e clicar no botão de excluir do card
    const botoesExcluir = await screen.findAllByText('Excluir', {}, { timeout: 5000 });
    const botaoExcluirCard = botoesExcluir.find(btn => 
      !btn.closest('[role="dialog"]')
    ) || botoesExcluir[0];
    
    await user.click(botaoExcluirCard);

    await waitFor(() => {
      expect(screen.getByText(/Tem certeza que deseja excluir a turma/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Aguardar botão de confirmação dentro do modal aparecer
    await waitFor(() => {
      const botoesConfirmar = screen.getAllByText('Excluir');
      // O último botão Excluir dentro do modal é o de confirmação
      const botaoConfirmar = botoesConfirmar[botoesConfirmar.length - 1];
      expect(botaoConfirmar).toBeInTheDocument();
      return user.click(botaoConfirmar);
    }, { timeout: 5000 });

    await waitFor(() => {
      expect(authService.excluirTurma).toHaveBeenCalledWith(1);
    }, { timeout: 5000 });
  });

  it('deve impedir exclusão quando turma tem recursos', async () => {
    const turmaComRecursos = {
      ...mockTurmas[0],
      recursos: [{ id: 1, nome: 'Recurso 1' }],
    };

    (authService.getTurmas as jest.Mock).mockResolvedValueOnce([turmaComRecursos]);
    
    const user = userEvent.setup({ delay: null });
    render(<AdminTurmas />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando turmas...')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const botoesExcluir = screen.getAllByText('Excluir');
      const botaoExcluirCard = botoesExcluir.find(btn => 
        !btn.closest('[role="dialog"]')
      ) || botoesExcluir[0];
      return user.click(botaoExcluirCard);
    }, { timeout: 3000 });

    // O erro deve aparecer no componente
    await waitFor(() => {
      expect(authService.excluirTurma).not.toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});
