import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProtecaoRota } from '../index';
import { useAutenticacao } from '@/lib/hooks/useApi';

const mockPush = jest.fn();
const mockPathname = jest.fn();

jest.mock('@/lib/hooks/useApi');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname(),
}));

const mockIsAutenticado = jest.fn();
const mockIsConexaoValida = jest.fn();
const mockIsAdm = jest.fn();

describe('ProtecaoRota', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname.mockReturnValue('/admin');
    (useAutenticacao as jest.Mock).mockReturnValue({
      isAutenticado: mockIsAutenticado,
      isConexaoValida: mockIsConexaoValida,
      isAdm: mockIsAdm,
    });
  });

  it('deve renderizar children em rotas públicas', () => {
    mockPathname.mockReturnValue('/auth/login');
    
    render(
      <ProtecaoRota>
        <div>Conteúdo público</div>
      </ProtecaoRota>
    );

    expect(screen.getByText('Conteúdo público')).toBeInTheDocument();
  });

  it('deve mostrar loading ao verificar autenticação', () => {
    mockIsAutenticado.mockReturnValue(true);
    mockIsConexaoValida.mockResolvedValue({ email: 'test@test.com' });
    mockIsAdm.mockResolvedValue({ sucesso: true });

    render(
      <ProtecaoRota>
        <div>Conteúdo protegido</div>
      </ProtecaoRota>
    );

    expect(screen.getByText('Verificando autenticação...')).toBeInTheDocument();
  });

  it('deve redirecionar quando não autenticado', async () => {
    mockIsAutenticado.mockReturnValue(false);

    render(
      <ProtecaoRota>
        <div>Conteúdo protegido</div>
      </ProtecaoRota>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    }, { timeout: 3000 });
  });
});
