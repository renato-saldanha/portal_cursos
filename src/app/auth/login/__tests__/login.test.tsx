import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaginaLogin from '../page';
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

const mockEnviarCodigo = jest.fn();
const mockEmailExistente = jest.fn();
const mockLimparErro = jest.fn();

describe('Página de Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAutenticacao as jest.Mock).mockReturnValue({
      enviarCodigoverificacao: mockEnviarCodigo,
      emailExistente: mockEmailExistente,
      limparErro: mockLimparErro,
      carregandoEstado: false,
    });
  });

  it('deve renderizar o formulário de login', () => {
    render(<PaginaLogin />);
    expect(screen.getByText('Acesse sua conta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Seu email cadastrado')).toBeInTheDocument();
  });

  it('deve validar email obrigatório', async () => {
    render(<PaginaLogin />);
    
    const botaoAcessar = screen.getByText('Acessar');
    fireEvent.click(botaoAcessar);

    await waitFor(() => {
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
    });
  });

  it('deve validar formato de email', async () => {
    render(<PaginaLogin />);
    
    const inputEmail = screen.getByPlaceholderText('Seu email cadastrado');
    fireEvent.change(inputEmail, { target: { value: 'email-invalido' } });
    
    const botaoAcessar = screen.getByText('Acessar');
    fireEvent.click(botaoAcessar);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });
  });

  it('deve enviar código quando email é válido', async () => {
    mockEmailExistente.mockResolvedValue({ sucesso: true });
    mockEnviarCodigo.mockResolvedValue({ sucesso: true, expira_em: '2025-01-27' });

    render(<PaginaLogin />);
    
    const inputEmail = screen.getByPlaceholderText('Seu email cadastrado');
    fireEvent.change(inputEmail, { target: { value: 'teste@test.com' } });
    
    const botaoAcessar = screen.getByText('Acessar');
    fireEvent.click(botaoAcessar);

    await waitFor(() => {
      expect(mockEmailExistente).toHaveBeenCalledWith('teste@test.com');
    });
  });
});

