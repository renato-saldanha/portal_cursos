/**
 * Testes simplificados para Filtros e Busca - Item 12
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GerenciarRecursos from '../page';
import { authService } from '@/lib/auth';

jest.mock('@/components/ProtecaoRota', () => ({
  ProtecaoRota: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@/components/VideoPlayer', () => ({
  __esModule: true,
  default: () => <div data-testid="video-player">Video Player</div>,
}));
jest.mock('@/lib/auth');
jest.mock('@/lib/hooks/useApi', () => ({
  useAutenticacao: jest.fn(() => ({
    fazerLogout: jest.fn(),
    downloadRecursoArquivo: jest.fn(),
    usuarioLogado: null,
    isClient: jest.fn().mockResolvedValue({ email: 'admin@test.com', nome: 'Admin' }),
    verificarAutenticacao: jest.fn().mockResolvedValue(null),
    carregandoEstado: false,
    erroEstado: null,
    limparErro: jest.fn(),
    isAdm: jest.fn().mockResolvedValue(true),
    isAutenticado: jest.fn().mockReturnValue(true),
    isConexaoValida: jest.fn().mockResolvedValue({ email: 'admin@test.com', nome: 'Admin' }),
    verificarCodigo: jest.fn(),
    reenviarCodigo: jest.fn(),
    enviarCodigoverificacao: jest.fn(),
    emailExistente: jest.fn(),
  })),
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
  }),
  usePathname: () => '/admin/recursos',
}));

const mockRecursos = [
  {
    id: 1,
    nome: 'Video Teste',
    descricao: 'Descrição do vídeo',
    tipo_recurso: 'video' as const,
    turma: 1,
    turma_nome: 'Turma A',
    acesso_previo: true,
    rascunho: false,
    arquivo: '/media/video1.mp4',
    data_criacao: '2025-01-01',
    data_atualizacao: '2025-01-01',
    is_acessivel: true,
  },
  {
    id: 2,
    nome: 'Documento.pdf',
    descricao: 'PDF importante',
    tipo_recurso: 'pdf' as const,
    turma: 2,
    turma_nome: 'Turma B',
    acesso_previo: false,
    rascunho: true,
    arquivo: '/media/pdf1.pdf',
    data_criacao: '2025-01-01',
    data_atualizacao: '2025-01-01',
    is_acessivel: true,
  },
];

const mockTurmas = [
  { id: 1, nome: 'Turma A', treinamento_nome: 'Treinamento 1' },
  { id: 2, nome: 'Turma B', treinamento_nome: 'Treinamento 2' },
];

describe('Filtros e Busca - Item 12', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (authService.getRecursos as jest.Mock).mockResolvedValue(mockRecursos);
    (authService.getTurmas as jest.Mock).mockResolvedValue(mockTurmas);
  });

  it('deve renderizar campo de busca', async () => {
    render(<GerenciarRecursos />);
    
    // Aguardar que o componente termine de carregar (verificar se não está mais carregando)
    await waitFor(() => {
      expect(screen.queryByText('Carregando recursos...')).not.toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Verificar se o campo de busca existe
    await waitFor(() => {
      const inputBusca = screen.queryByPlaceholderText('Buscar por nome ou descrição...');
      expect(inputBusca).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('deve filtrar recursos por nome na busca', async () => {
    const user = userEvent.setup({ delay: null });
    render(<GerenciarRecursos />);

    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.queryByText('Carregando recursos...')).not.toBeInTheDocument();
    });

    // Aguardar campo de busca
    const inputBusca = await screen.findByPlaceholderText('Buscar por nome ou descrição...', {}, { timeout: 5000 });
    
    // Digitar na busca
    await user.type(inputBusca, 'Video');

    // Verificar que apenas o recurso com "Video" está visível
    await waitFor(() => {
      expect(screen.getByText('Video Teste')).toBeInTheDocument();
      expect(screen.queryByText('Documento.pdf')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('deve mostrar contador de recursos', async () => {
    render(<GerenciarRecursos />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando recursos...')).not.toBeInTheDocument();
    });

    // Verificar que o contador mostra recursos
    await waitFor(() => {
      expect(screen.getByText(/Recursos \(\d+ de \d+\)/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
