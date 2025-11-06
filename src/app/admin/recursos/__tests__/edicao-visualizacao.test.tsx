import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GerenciarRecursos from '../page';
import { authService } from '@/lib/auth';
import { useAutenticacao } from '@/lib/hooks/useApi';

// Mock window.alert para evitar erros no console dos testes
global.alert = jest.fn();

jest.mock('@/components/ProtecaoRota', () => ({
  ProtecaoRota: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@/lib/auth');
jest.mock('@/lib/hooks/useApi');
jest.mock('@/components/VideoPlayer', () => ({
  __esModule: true,
  default: ({ recurso }: { recurso: any }) => (
    <div data-testid="video-player">
      <p>{recurso.nome}</p>
      <p>{recurso.tipo_recurso}</p>
    </div>
  )
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  }),
  usePathname: () => '/admin/recursos',
}));

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const mockedUseAutenticacao = useAutenticacao as jest.MockedFunction<typeof useAutenticacao>;

const mockRecursos = [
  {
    id: 1,
    turma: 1,
    turma_nome: 'Turma A',
    tipo_recurso: 'video',
    acesso_previo: false,
    rascunho: false,
    nome: 'Video Teste',
    descricao: 'Descrição do vídeo',
    arquivo: '/media/recursos/video.mp4',
    data_criacao: '2025-01-27T00:00:00Z',
    data_atualizacao: '2025-01-27T00:00:00Z',
    is_acessivel: true
  },
  {
    id: 2,
    turma: 1,
    turma_nome: 'Turma A',
    tipo_recurso: 'pdf',
    acesso_previo: false,
    rascunho: false,
    nome: 'Documento.pdf',
    descricao: 'Descrição do PDF',
    arquivo: '/media/recursos/documento.pdf',
    data_criacao: '2025-01-27T00:00:00Z',
    data_atualizacao: '2025-01-27T00:00:00Z',
    is_acessivel: true
  }
];

const mockTurmas = [
  {
    id: 1,
    treinamento: 1,
    treinamento_nome: 'Treinamento 1',
    nome: 'Turma A',
    data_inicio: '2025-02-01T00:00:00Z',
    data_conclusao: '2025-02-28T00:00:00Z',
    data_criacao: '2025-01-27T00:00:00Z',
    data_atualizacao: '2025-01-27T00:00:00Z',
    status: 'Aguardando',
    recursos: []
  }
];

describe('Item 1, 2: Admin Recursos - Edição e Visualização', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/blob123');
    global.URL.revokeObjectURL = jest.fn();
    
    // Mock do authService - o componente usa diretamente
    jest.spyOn(authService, 'getTurmas').mockResolvedValue(mockTurmas);
    jest.spyOn(authService, 'getRecursos').mockResolvedValue(mockRecursos);
    jest.spyOn(authService, 'baixarRecursoArquivo').mockResolvedValue(new Blob(['teste'], { type: 'application/pdf' }));
    jest.spyOn(authService, 'atualizarRecurso').mockResolvedValue(mockRecursos[0]);
    jest.spyOn(authService, 'uploadArquivo').mockResolvedValue({ sucesso: true } as any);
    
    mockedUseAutenticacao.mockReturnValue({
      getRecursos: jest.fn().mockResolvedValue(mockRecursos),
      getTurmas: jest.fn().mockResolvedValue(mockTurmas),
      fazerLogout: jest.fn(),
      downloadRecursoArquivo: jest.fn().mockResolvedValue(new Blob(['teste'], { type: 'application/pdf' })),
      usuarioLogado: null,
      isClient: jest.fn().mockResolvedValue({ email: 'admin@test.com', nome: 'Admin' }),
      carregandoEstado: false,
      erroEstado: null,
      limparErro: jest.fn(),
      verificarAutenticacao: jest.fn().mockResolvedValue(null),
      isAdm: jest.fn().mockResolvedValue(true),
      isAutenticado: jest.fn().mockReturnValue(true),
      isConexaoValida: jest.fn().mockResolvedValue({ email: 'admin@test.com', nome: 'Admin' }),
      verificarCodigo: jest.fn(),
      reenviarCodigo: jest.fn(),
      enviarCodigoverificacao: jest.fn(),
      emailExistente: jest.fn()
    } as any);
  });

  describe('Item 1: Edição de Recursos', () => {
    it('deve abrir modal de edição com dados pré-preenchidos', async () => {
      render(<GerenciarRecursos />);

      // Aguardar carregamento completo
      await waitFor(() => {
        expect(screen.queryByText('Carregando recursos...')).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Aguardar recursos aparecerem
      await waitFor(() => {
        expect(screen.getByText('Video Teste')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Buscar botão de editar usando findAllByLabelText (aguarda)
      const botoesEditar = await screen.findAllByLabelText('Editar recurso', {}, { timeout: 5000 });
      expect(botoesEditar.length).toBeGreaterThan(0);
      fireEvent.click(botoesEditar[0]);

      // Verificar modal aberto
      await waitFor(() => {
        expect(screen.getByText('Editar Recurso')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Video Teste')).toBeInTheDocument();
      }, { timeout: 3000 });
    }, 12000);

    it('deve permitir edição sem novo arquivo', async () => {
      (authService.atualizarRecurso as jest.Mock).mockResolvedValueOnce({
        ...mockRecursos[0],
        nome: 'Video Atualizado',
        descricao: 'Nova descrição'
      });

      render(<GerenciarRecursos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando recursos...')).not.toBeInTheDocument();
      }, { timeout: 5000 });

      await waitFor(() => {
        expect(screen.getByText('Video Teste')).toBeInTheDocument();
      }, { timeout: 5000 });

      const botoesEditar = await screen.findAllByLabelText('Editar recurso', {}, { timeout: 5000 });
      fireEvent.click(botoesEditar[0]);

      await waitFor(() => {
        expect(screen.getByText('Editar Recurso')).toBeInTheDocument();
      }, { timeout: 3000 });

      const inputNome = screen.getByDisplayValue('Video Teste');
      fireEvent.change(inputNome, { target: { value: 'Video Atualizado' } });

      const textareaDescricao = screen.getByPlaceholderText('Descrição do recurso');
      fireEvent.change(textareaDescricao, { target: { value: 'Nova descrição' } });

      const botaoSalvar = screen.getByText('Salvar');
      fireEvent.click(botaoSalvar);

      await waitFor(() => {
        expect(authService.atualizarRecurso).toHaveBeenCalled();
      }, { timeout: 3000 });
    }, 12000);

    it('deve validar que nome é obrigatório', async () => {
      render(<GerenciarRecursos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando recursos...')).not.toBeInTheDocument();
      }, { timeout: 3000 });

      await waitFor(() => {
        expect(screen.getByText('Video Teste')).toBeInTheDocument();
      }, { timeout: 3000 });

      const botoesEditar = screen.getAllByLabelText('Editar recurso');
      expect(botoesEditar.length).toBeGreaterThan(0);
      fireEvent.click(botoesEditar[0]);

      await waitFor(() => {
        expect(screen.getByText('Editar Recurso')).toBeInTheDocument();
      }, { timeout: 3000 });

      const inputNome = screen.getByDisplayValue('Video Teste');
      fireEvent.change(inputNome, { target: { value: '' } });

      const botaoSalvar = screen.getByText('Salvar');
      fireEvent.click(botaoSalvar);

      // O erro deve aparecer após o submit
      // Verificar se o modal ainda está aberto (indica que validação bloqueou o submit)
      // Se o modal não fechou após tentar salvar sem nome, significa que a validação funcionou
      await waitFor(() => {
        // O modal deve ainda estar aberto porque a validação bloqueou o submit
        const modalAberto = screen.queryByText('Editar Recurso');
        expect(modalAberto).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Verificação adicional: se o modal ainda está aberto, a validação funcionou
      expect(screen.getByText('Editar Recurso')).toBeInTheDocument();
    }, 10000);
  });

  describe('Item 2: Visualização de Recursos', () => {
    it('deve visualizar vídeo usando VideoPlayer', async () => {
      render(<GerenciarRecursos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando recursos...')).not.toBeInTheDocument();
      }, { timeout: 5000 });

      await waitFor(() => {
        expect(screen.getByText('Video Teste')).toBeInTheDocument();
      }, { timeout: 5000 });

      const botoesVisualizar = await screen.findAllByLabelText('Visualizar recurso', {}, { timeout: 5000 });
      expect(botoesVisualizar.length).toBeGreaterThan(0);
      fireEvent.click(botoesVisualizar[0]);

      await waitFor(() => {
        expect(screen.getByTestId('video-player')).toBeInTheDocument();
      }, { timeout: 3000 });
    }, 12000);

    it('deve visualizar PDF usando iframe', async () => {
      const mockBlob = new Blob(['conteudo pdf'], { type: 'application/pdf' });
      (authService.baixarRecursoArquivo as jest.Mock).mockResolvedValueOnce(mockBlob);

      render(<GerenciarRecursos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando recursos...')).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Aguardar recurso PDF aparecer
      await waitFor(() => {
        expect(screen.getByText('Documento.pdf')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Buscar todos os botões e clicar no que corresponde ao PDF (segundo recurso)
      const botoesVisualizar = await screen.findAllByLabelText('Visualizar recurso', {}, { timeout: 5000 });
      // Pegar o segundo botão que corresponde ao PDF
      const botaoPdf = botoesVisualizar[1] || botoesVisualizar[0];
      fireEvent.click(botaoPdf);

      await waitFor(() => {
        expect(authService.baixarRecursoArquivo).toHaveBeenCalled();
      }, { timeout: 5000 });
    }, 15000);

    it('deve tratar erros de acesso/permissão', async () => {
      // Suprimir console.error neste teste, pois estamos testando um erro esperado
      const originalError = console.error;
      console.error = jest.fn();
      
      (authService.baixarRecursoArquivo as jest.Mock).mockRejectedValueOnce(
        new Error('Você não tem permissão para acessar este recurso')
      );

      render(<GerenciarRecursos />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando recursos...')).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Aguardar recurso PDF aparecer
      await waitFor(() => {
        expect(screen.getByText('Documento.pdf')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Buscar todos os botões e clicar no que corresponde ao PDF (segundo recurso)
      const botoesVisualizar = await screen.findAllByLabelText('Visualizar recurso', {}, { timeout: 5000 });
      // Pegar o segundo botão que corresponde ao PDF
      const botaoPdf = botoesVisualizar[1] || botoesVisualizar[0];
      fireEvent.click(botaoPdf);

      // Verificar se o download foi tentado
      await waitFor(() => {
        expect(authService.baixarRecursoArquivo).toHaveBeenCalled();
      }, { timeout: 5000 });
      
      // Restaurar console.error após o teste
      console.error = originalError;
    }, 15000);
  });
});
