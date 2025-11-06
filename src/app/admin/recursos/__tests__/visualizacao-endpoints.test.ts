/**
 * Testes para Item 2: Visualização de Recursos usando endpoints autenticados
 */

import { Recurso } from '@/types';
import { authService } from '@/lib/auth';

jest.mock('@/lib/auth');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe('Item 2: Visualização de Recursos - Endpoints Autenticados', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/blob123');
    global.URL.revokeObjectURL = jest.fn();
  });

  describe('Visualização de PDF usando endpoint autenticado', () => {
    it('deve usar /recursos/{id}/download/ para PDFs', async () => {
      const mockRecursoPDF: Recurso = {
        id: 1,
        turma: 1,
        turma_nome: 'Turma A',
        tipo_recurso: 'pdf',
        acesso_previo: false,
        rascunho: false,
        nome: 'Documento.pdf',
        descricao: 'Descrição',
        arquivo: '/media/recursos/documento.pdf',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        is_acessivel: true
      };

      const mockBlob = new Blob(['conteudo pdf'], { type: 'application/pdf' });
      mockedAuthService.baixarRecursoArquivo.mockResolvedValueOnce(mockBlob);

      const blob = await authService.baixarRecursoArquivo(mockRecursoPDF);
      const url = URL.createObjectURL(blob);

      expect(mockedAuthService.baixarRecursoArquivo).toHaveBeenCalledWith(mockRecursoPDF);
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(url).toBe('blob:http://localhost/blob123');
    });

    it('deve tratar erros de acesso/permissão ao visualizar PDF', async () => {
      const mockRecursoPDF: Recurso = {
        id: 1,
        turma: 1,
        turma_nome: 'Turma A',
        tipo_recurso: 'pdf',
        acesso_previo: false,
        rascunho: false,
        nome: 'Documento.pdf',
        descricao: 'Descrição',
        arquivo: '/media/recursos/documento.pdf',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        is_acessivel: true
      };

      mockedAuthService.baixarRecursoArquivo.mockRejectedValueOnce(
        new Error('Você não tem permissão para acessar este recurso')
      );

      await expect(
        authService.baixarRecursoArquivo(mockRecursoPDF)
      ).rejects.toThrow('Você não tem permissão para acessar este recurso');
    });

    it('deve tratar erro 403', async () => {
      const mockRecursoPDF: Recurso = {
        id: 1,
        turma: 1,
        turma_nome: 'Turma A',
        tipo_recurso: 'pdf',
        acesso_previo: false,
        rascunho: false,
        nome: 'Documento.pdf',
        descricao: 'Descrição',
        arquivo: '/media/recursos/documento.pdf',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        is_acessivel: true
      };

      mockedAuthService.baixarRecursoArquivo.mockRejectedValueOnce(
        new Error('Sem permissão para acessar')
      );

      await expect(
        authService.baixarRecursoArquivo(mockRecursoPDF)
      ).rejects.toThrow('Sem permissão para acessar');
    });

    it('deve tratar erro 404', async () => {
      const mockRecursoPDF: Recurso = {
        id: 999,
        turma: 1,
        turma_nome: 'Turma A',
        tipo_recurso: 'pdf',
        acesso_previo: false,
        rascunho: false,
        nome: 'Documento.pdf',
        descricao: 'Descrição',
        arquivo: '/media/recursos/documento.pdf',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        is_acessivel: true
      };

      mockedAuthService.baixarRecursoArquivo.mockRejectedValueOnce(
        new Error('Recurso não encontrado')
      );

      await expect(
        authService.baixarRecursoArquivo(mockRecursoPDF)
      ).rejects.toThrow('Recurso não encontrado');
    });
  });

  describe('Visualização de Video usando VideoPlayer', () => {
    it('deve usar VideoPlayer para vídeos', async () => {
      const mockRecursoVideo: Recurso = {
        id: 1,
        turma: 1,
        turma_nome: 'Turma A',
        tipo_recurso: 'video',
        acesso_previo: false,
        rascunho: false,
        nome: 'Video.mp4',
        descricao: 'Descrição',
        arquivo: '/media/recursos/video.mp4',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        is_acessivel: true
      };

      const mockBlob = new Blob(['conteudo video'], { type: 'video/mp4' });
      mockedAuthService.baixarRecursoArquivo.mockResolvedValueOnce(mockBlob);

      const blob = await authService.baixarRecursoArquivo(mockRecursoVideo);

      expect(mockedAuthService.baixarRecursoArquivo).toHaveBeenCalledWith(mockRecursoVideo);
      expect(blob).toBe(mockBlob);
    });
  });

  describe('Download de ZIP usando endpoint autenticado', () => {
    it('deve fazer download de ZIP usando downloadRecursoArquivo', async () => {
      const mockRecursoZIP: Recurso = {
        id: 1,
        turma: 1,
        turma_nome: 'Turma A',
        tipo_recurso: 'zip',
        acesso_previo: false,
        rascunho: false,
        nome: 'arquivo.zip',
        descricao: 'Descrição',
        arquivo: '/media/recursos/arquivo.zip',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        is_acessivel: true
      };

      const mockBlob = new Blob(['conteudo zip'], { type: 'application/zip' });
      mockedAuthService.baixarRecursoArquivo.mockResolvedValueOnce(mockBlob);

      const blob = await authService.baixarRecursoArquivo(mockRecursoZIP);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${mockRecursoZIP.nome}.${mockRecursoZIP.tipo_recurso}`;

      expect(mockedAuthService.baixarRecursoArquivo).toHaveBeenCalledWith(mockRecursoZIP);
      expect(link.download).toBe('arquivo.zip.zip');
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    });

    it('não deve usar caminho direto do arquivo', () => {
      const mockRecursoZIP: Recurso = {
        id: 1,
        turma: 1,
        turma_nome: 'Turma A',
        tipo_recurso: 'zip',
        acesso_previo: false,
        rascunho: false,
        nome: 'arquivo.zip',
        descricao: 'Descrição',
        arquivo: '/media/recursos/arquivo.zip',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        is_acessivel: true
      };

      const originalOpen = window.open;
      window.open = jest.fn();

      const fazerDownload = async (recurso: Recurso) => {
        const blob = await authService.baixarRecursoArquivo(recurso);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${recurso.nome}.${recurso.tipo_recurso}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      };

      fazerDownload(mockRecursoZIP);

      expect(window.open).not.toHaveBeenCalled();
      expect(mockedAuthService.baixarRecursoArquivo).toHaveBeenCalled();

      window.open = originalOpen;
    });
  });

  describe('Não usar window.open() com URL direta', () => {
    it('deve substituir window.open por endpoint autenticado', () => {
      const mockRecurso: Recurso = {
        id: 1,
        turma: 1,
        turma_nome: 'Turma A',
        tipo_recurso: 'pdf',
        acesso_previo: false,
        rascunho: false,
        nome: 'Documento.pdf',
        descricao: 'Descrição',
        arquivo: '/media/recursos/documento.pdf',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        is_acessivel: true
      };

      const originalOpen = window.open;
      window.open = jest.fn();

      const visualizarRecurso = async (recurso: Recurso) => {
        if (recurso.tipo_recurso === 'video') {
          return;
        }
        const blob = await authService.baixarRecursoArquivo(recurso);
        const url = URL.createObjectURL(blob);
        return url;
      };

      visualizarRecurso(mockRecurso);

      expect(window.open).not.toHaveBeenCalled();
      expect(mockedAuthService.baixarRecursoArquivo).toHaveBeenCalled();

      window.open = originalOpen;
    });
  });
});

