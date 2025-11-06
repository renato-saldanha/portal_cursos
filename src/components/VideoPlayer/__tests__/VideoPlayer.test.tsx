import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import VideoPlayer from '../index';
import { useAutenticacao } from '@/lib/hooks/useApi';

jest.mock('@/lib/hooks/useApi');

const mockDownloadRecurso = jest.fn();

const mockRecurso = {
  id: 1,
  nome: 'Video Teste',
  tipo_recurso: 'video',
  arquivo: '/media/video.mp4',
};

describe('VideoPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/blob123');
    global.URL.revokeObjectURL = jest.fn();

    (useAutenticacao as jest.Mock).mockReturnValue({
      downloadRecursoArquivo: mockDownloadRecurso,
    });
  });

  it('deve renderizar o player de vídeo', async () => {
    const mockBlob = new Blob(['video'], { type: 'video/mp4' });
    mockDownloadRecurso.mockResolvedValue(mockBlob);

    render(<VideoPlayer recurso={mockRecurso} />);

    await waitFor(() => {
      expect(screen.getByText('Video Teste')).toBeInTheDocument();
    });
  });

  it('deve carregar vídeo do recurso', async () => {
    const mockBlob = new Blob(['video'], { type: 'video/mp4' });
    mockDownloadRecurso.mockResolvedValue(mockBlob);

    render(<VideoPlayer recurso={mockRecurso} />);

    await waitFor(() => {
      expect(mockDownloadRecurso).toHaveBeenCalledWith(mockRecurso);
    });
  });
});

