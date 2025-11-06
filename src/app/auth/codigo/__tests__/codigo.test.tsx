import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaginaCodigo from '../page';
import { useAutenticacao } from '@/lib/hooks/useApi';

jest.mock('@/lib/hooks/useApi');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
jest.mock('@/components/ui/MarketingBackground', () => ({
  MarketingBackground: () => <div data-testid="marketing-bg">Marketing</div>,
}));

const mockVerificarCodigo = jest.fn();
const mockReenviarCodigo = jest.fn();
const mockIsAdm = jest.fn();

describe('Página de Código', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => 'teste@test.com'),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    (useAutenticacao as jest.Mock).mockReturnValue({
      verificarCodigo: mockVerificarCodigo,
      reenviarCodigo: mockReenviarCodigo,
      isAdm: mockIsAdm,
      limparErro: jest.fn(),
      carregandoEstado: false,
      erroEstado: null,
    });
  });

  it('deve renderizar formulário de código', async () => {
    render(<PaginaCodigo />);
    
    await waitFor(() => {
      expect(screen.getByText('Verificação em 2 Etapas')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite o código de 6 dígitos')).toBeInTheDocument();
    });
  });

  it('deve validar código de 6 dígitos', async () => {
    render(<PaginaCodigo />);
    
    await waitFor(() => {
      const inputCodigo = screen.getByPlaceholderText('Digite o código de 6 dígitos');
      fireEvent.change(inputCodigo, { target: { value: '12345' } });
      expect(inputCodigo).toHaveValue('12345');
    });
  });

  it('deve verificar código e redirecionar admin', async () => {
    mockVerificarCodigo.mockResolvedValue({ access: 'token', refresh: 'refresh', usuario: { email: 'teste@test.com' } });
    mockIsAdm.mockResolvedValue({ sucesso: true });

    render(<PaginaCodigo />);
    
    await waitFor(() => {
      const inputCodigo = screen.getByPlaceholderText('Digite o código de 6 dígitos');
      fireEvent.change(inputCodigo, { target: { value: '123456' } });
      
      const botaoVerificar = screen.getByText('Verificar Código');
      fireEvent.click(botaoVerificar);
    });

    await waitFor(() => {
      expect(mockVerificarCodigo).toHaveBeenCalledWith('teste@test.com', '123456');
    });
  });
});

