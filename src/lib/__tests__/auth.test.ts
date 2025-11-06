/**
 * Testes para Item 16: Métodos CRUD no authService
 */

import { authService } from '../auth';
import { api } from '../api';

// Mock do módulo api
jest.mock('../api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('AuthService - Métodos CRUD Treinamentos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criarTreinamento', () => {
    it('deve criar treinamento com sucesso', async () => {
      const mockTreinamento = {
        id: 1,
        nome: 'Treinamento Teste',
        descricao: 'Descrição teste',
        data_criacao: '2025-01-01',
        data_atualizacao: '2025-01-01',
        turmas: [],
      };

      mockedApi.post.mockResolvedValue({ data: mockTreinamento });

      const resultado = await authService.criarTreinamento('Treinamento Teste', 'Descrição teste');

      expect(mockedApi.post).toHaveBeenCalledWith('/treinamentos/', {
        nome: 'Treinamento Teste',
        descricao: 'Descrição teste',
      });
      expect(resultado).toEqual(mockTreinamento);
    });

    it('deve lançar erro quando falhar', async () => {
      mockedApi.post.mockRejectedValue({
        response: {
          data: { erro: 'Erro ao criar treinamento' },
          status: 400,
        },
      });

      await expect(
        authService.criarTreinamento('Teste', 'Desc')
      ).rejects.toThrow('Erro ao criar treinamento');
    });
  });

  describe('atualizarTreinamento', () => {
    it('deve atualizar treinamento com sucesso', async () => {
      const mockTreinamento = {
        id: 1,
        nome: 'Treinamento Atualizado',
        descricao: 'Descrição atualizada',
        data_criacao: '2025-01-01',
        data_atualizacao: '2025-01-02',
        turmas: [],
      };

      mockedApi.patch.mockResolvedValue({ data: mockTreinamento });

      const resultado = await authService.atualizarTreinamento(1, {
        nome: 'Treinamento Atualizado',
      });

      expect(mockedApi.patch).toHaveBeenCalledWith('/treinamentos/1/', {
        nome: 'Treinamento Atualizado',
      });
      expect(resultado).toEqual(mockTreinamento);
    });
  });

  describe('excluirTreinamento', () => {
    it('deve excluir treinamento com sucesso', async () => {
      mockedApi.delete.mockResolvedValue({ status: 200 });

      const resultado = await authService.excluirTreinamento(1);

      expect(mockedApi.delete).toHaveBeenCalledWith('/treinamentos/1/');
      expect(resultado).toBe(true);
    });

    it('deve retornar true para status 204', async () => {
      mockedApi.delete.mockResolvedValue({ status: 204 });

      const resultado = await authService.excluirTreinamento(1);
      expect(resultado).toBe(true);
    });
  });
});

describe('AuthService - Métodos CRUD Turmas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criarTurma', () => {
    it('deve criar turma com sucesso', async () => {
      const mockTurma = {
        id: 1,
        treinamento: 1,
        treinamento_nome: 'Treinamento 1',
        nome: 'Turma Teste',
        data_inicio: '2025-12-01',
        data_conclusao: '2025-12-31',
        link_acesso: 'https://example.com',
        data_criacao: '2025-01-01',
        data_atualizacao: '2025-01-01',
        status: 'Aguardando' as const,
        recursos: [],
      };

      mockedApi.post.mockResolvedValue({ data: mockTurma });

      const resultado = await authService.criarTurma({
        treinamento: 1,
        nome: 'Turma Teste',
        data_inicio: '2025-12-01',
        data_conclusao: '2025-12-31',
        link_acesso: 'https://example.com',
      });

      expect(mockedApi.post).toHaveBeenCalledWith('/turmas/', {
        treinamento: 1,
        nome: 'Turma Teste',
        data_inicio: '2025-12-01',
        data_conclusao: '2025-12-31',
        link_acesso: 'https://example.com',
      });
      expect(resultado).toEqual(mockTurma);
    });
  });

  describe('atualizarTurma', () => {
    it('deve atualizar turma com sucesso', async () => {
      const mockTurma = {
        id: 1,
        treinamento: 1,
        treinamento_nome: 'Treinamento 1',
        nome: 'Turma Atualizada',
        data_inicio: '2025-12-01',
        data_conclusao: '2025-12-31',
        data_criacao: '2025-01-01',
        data_atualizacao: '2025-01-02',
        status: 'Em andamento' as const,
        recursos: [],
      };

      mockedApi.patch.mockResolvedValue({ data: mockTurma });

      const resultado = await authService.atualizarTurma(1, {
        nome: 'Turma Atualizada',
      });

      expect(mockedApi.patch).toHaveBeenCalledWith('/turmas/1/', {
        nome: 'Turma Atualizada',
      });
      expect(resultado).toEqual(mockTurma);
    });
  });

  describe('excluirTurma', () => {
    it('deve excluir turma com sucesso', async () => {
      mockedApi.delete.mockResolvedValue({ status: 200 });

      const resultado = await authService.excluirTurma(1);

      expect(mockedApi.delete).toHaveBeenCalledWith('/turmas/1/');
      expect(resultado).toBe(true);
    });
  });
});

describe('AuthService - atualizarRecurso', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve atualizar recurso sem arquivo', async () => {
    const mockRecurso = {
      id: 1,
      turma: 1,
      turma_nome: 'Turma 1',
      tipo_recurso: 'pdf' as const,
      acesso_previo: false,
      rascunho: false,
      nome: 'Recurso Atualizado',
      descricao: 'Descrição',
      arquivo: '/media/arquivo.pdf',
      data_criacao: '2025-01-01',
      data_atualizacao: '2025-01-02',
      is_acessivel: true,
    };

    mockedApi.patch.mockResolvedValue({ data: mockRecurso });

    const resultado = await authService.atualizarRecurso(1, {
      nome: 'Recurso Atualizado',
    });

    // Verificar que foi chamado com FormData
    expect(mockedApi.patch).toHaveBeenCalledWith(
      '/recursos/1/',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    // Verificar que o FormData contém o nome
    const callArgs = mockedApi.patch.mock.calls[0];
    const formData = callArgs[1] as FormData;
    expect(formData.get('nome')).toBe('Recurso Atualizado');
    expect(formData.get('arquivo')).toBeNull(); // Não deve ter arquivo
    
    expect(resultado).toEqual(mockRecurso);
  });

  it('deve atualizar recurso com arquivo usando FormData', async () => {
    const mockArquivo = new File(['conteudo'], 'teste.pdf', { type: 'application/pdf' });
    const mockRecurso = {
      id: 1,
      turma: 1,
      turma_nome: 'Turma 1',
      tipo_recurso: 'pdf' as const,
      acesso_previo: false,
      rascunho: false,
      nome: 'Recurso Atualizado',
      descricao: 'Descrição',
      arquivo: '/media/arquivo.pdf',
      data_criacao: '2025-01-01',
      data_atualizacao: '2025-01-02',
      is_acessivel: true,
    };

    mockedApi.patch.mockResolvedValue({ data: mockRecurso });

    const resultado = await authService.atualizarRecurso(1, {
      nome: 'Recurso Atualizado',
    }, mockArquivo);

    expect(mockedApi.patch).toHaveBeenCalledWith(
      '/recursos/1/',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    expect(resultado).toEqual(mockRecurso);
  });
});
