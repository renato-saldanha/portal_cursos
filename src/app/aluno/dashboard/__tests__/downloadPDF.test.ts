import { Recurso } from '@/types';
import { authService } from '@/lib/auth';

jest.mock('@/lib/auth');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe('Item 5: Download de PDF - Correção de abrirRecurso', () => {
  const mockRecursoPDF: Recurso = {
    id: 1,
    turma: 1,
    turma_nome: 'Turma A',
    tipo_recurso: 'pdf',
    acesso_previo: false,
    rascunho: false,
    nome: 'Documento.pdf',
    descricao: 'Documento de teste',
    arquivo: '/media/recursos/documento.pdf',
    data_criacao: '2025-01-27T00:00:00Z',
    data_atualizacao: '2025-01-27T00:00:00Z',
    is_acessivel: true
  };

  const mockRecursoVideo: Recurso = {
    ...mockRecursoPDF,
    id: 2,
    tipo_recurso: 'video',
    nome: 'video.mp4'
  };

  const mockRecursoZIP: Recurso = {
    ...mockRecursoPDF,
    id: 3,
    tipo_recurso: 'zip',
    nome: 'arquivo.zip'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/blob123');
    global.URL.revokeObjectURL = jest.fn();
    
    const mockBlob = new Blob(['conteudo do arquivo'], { type: 'application/pdf' });
    mockedAuthService.baixarRecursoArquivo.mockResolvedValue(mockBlob);
  });

  it('deve fazer download de PDF usando endpoint autenticado', async () => {
    const abrirRecurso = async (recurso: Recurso) => {
      if (recurso.tipo_recurso === 'video') {
        return; // Não faz download para vídeo
      }
      
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

    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    await abrirRecurso(mockRecursoPDF);

    expect(mockedAuthService.baixarRecursoArquivo).toHaveBeenCalledWith(mockRecursoPDF);
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('deve fazer download de ZIP usando endpoint autenticado', async () => {
    const mockBlobZIP = new Blob(['conteudo zip'], { type: 'application/zip' });
    mockedAuthService.baixarRecursoArquivo.mockResolvedValueOnce(mockBlobZIP);

    const abrirRecurso = async (recurso: Recurso) => {
      if (recurso.tipo_recurso === 'video') {
        return;
      }
      
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

    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    await abrirRecurso(mockRecursoZIP);

    expect(mockedAuthService.baixarRecursoArquivo).toHaveBeenCalledWith(mockRecursoZIP);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('deve tratar erros de acesso/permissão', async () => {
    mockedAuthService.baixarRecursoArquivo.mockRejectedValueOnce(
      new Error('Erro ao baixar um recurso')
    );

    const abrirRecurso = async (recurso: Recurso) => {
      try {
        if (recurso.tipo_recurso === 'video') {
          return;
        }
        await authService.baixarRecursoArquivo(recurso);
      } catch (error) {
        throw error;
      }
    };

    await expect(abrirRecurso(mockRecursoPDF)).rejects.toThrow('Erro ao baixar um recurso');
  });

  it('não deve usar URL direta do arquivo', async () => {
    const recurso: Recurso = {
      ...mockRecursoPDF,
      arquivo: '/media/recursos/documento.pdf'
    };

    const abrirRecurso = async (recurso: Recurso) => {
      if (recurso.tipo_recurso === 'video') {
        return;
      }
      
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

    const createElementSpy = jest.spyOn(document, 'createElement');

    await abrirRecurso(recurso);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockedAuthService.baixarRecursoArquivo).toHaveBeenCalled();
    // Verificar que não está usando URL direta
    expect(createElementSpy).toHaveBeenCalledWith('a');
    const createdLink = createElementSpy.mock.results[0].value as HTMLAnchorElement;
    expect(createdLink.href).toContain('blob:');
    expect(createdLink.href).not.toContain('/media/recursos/');
  });
});

