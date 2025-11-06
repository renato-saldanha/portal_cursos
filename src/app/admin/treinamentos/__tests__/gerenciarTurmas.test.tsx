/**
 * Testes simplificados para Item 19: Gerenciar Turmas do Treinamento
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminTreinamentos from '../page';
import { useAutenticacao } from '@/lib/hooks/useApi';

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => mockRouter),
}));
jest.mock('@/lib/auth');
jest.mock('@/lib/hooks/useApi');

const mockTreinamentos = [
  {
    id: 1,
    nome: 'Treinamento Teste',
    descricao: 'Descrição teste',
    data_criacao: '2025-01-01',
    data_atualizacao: '2025-01-01',
    turmas: [
      {
        id: 1,
        nome: 'Turma A',
        treinamento: 1,
        treinamento_nome: 'Treinamento Teste',
        data_inicio: '2025-12-01',
        data_conclusao: '2025-12-31',
        data_criacao: '2025-01-01',
        data_atualizacao: '2025-01-01',
        status: 'Aguardando' as const,
        recursos: [],
      },
    ],
  },
];

describe('Gerenciar Turmas do Treinamento - Item 19', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir botão Gerenciar Turmas no card do treinamento', async () => {
    const mockGetTreinamentos = jest.fn().mockResolvedValue(mockTreinamentos);
    
    (useAutenticacao as jest.Mock).mockReturnValue({
      getTreinamentos: mockGetTreinamentos,
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
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(screen.getByText('Gerenciar Turmas')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('deve redirecionar para página de turmas com filtro', async () => {
    const user = userEvent.setup({ delay: null });
    const mockGetTreinamentos = jest.fn().mockResolvedValue(mockTreinamentos);
    
    (useAutenticacao as jest.Mock).mockReturnValue({
      getTreinamentos: mockGetTreinamentos,
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
      expect(screen.getByText('Gerenciar Turmas')).toBeInTheDocument();
    }, { timeout: 3000 });

    const botaoGerenciar = screen.getByText('Gerenciar Turmas');
    await user.click(botaoGerenciar);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/turmas?treinamento=1');
    }, { timeout: 3000 });
  });
});
