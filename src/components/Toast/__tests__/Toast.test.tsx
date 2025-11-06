/**
 * Testes para Item 14: Componente Toast
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast, { ToastType } from '../index';

const mockOnClose = jest.fn();

const toastProps = {
  id: 'test-toast',
  mensagem: 'Mensagem de teste',
  tipo: 'success' as ToastType,
  duracao: 5000,
  onClose: mockOnClose,
};

describe('Toast Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockOnClose.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('deve renderizar toast com mensagem', () => {
    render(<Toast {...toastProps} />);
    expect(screen.getByText('Mensagem de teste')).toBeInTheDocument();
  });

  it('deve renderizar toast de sucesso', () => {
    render(<Toast {...toastProps} tipo="success" />);
    expect(screen.getByText('Mensagem de teste')).toBeInTheDocument();
    expect(screen.getByText('Mensagem de teste').closest('div')).toHaveClass('bg-green-50');
  });

  it('deve renderizar toast de erro', () => {
    render(<Toast {...toastProps} tipo="error" />);
    expect(screen.getByText('Mensagem de teste').closest('div')).toHaveClass('bg-red-50');
  });

  it('deve renderizar toast de informação', () => {
    render(<Toast {...toastProps} tipo="info" />);
    expect(screen.getByText('Mensagem de teste').closest('div')).toHaveClass('bg-blue-50');
  });

  it('deve renderizar toast de aviso', () => {
    render(<Toast {...toastProps} tipo="warning" />);
    expect(screen.getByText('Mensagem de teste').closest('div')).toHaveClass('bg-yellow-50');
  });

  it('deve fechar toast após duração', async () => {
    render(<Toast {...toastProps} duracao={1000} />);
    
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledWith('test-toast');
    });
  });

  it('deve fechar toast ao clicar no botão de fechar', async () => {
    const user = userEvent.setup({ delay: null });
    render(<Toast {...toastProps} />);
    
    const botaoFechar = screen.getByLabelText('Fechar');
    await user.click(botaoFechar);
    
    expect(mockOnClose).toHaveBeenCalledWith('test-toast');
  });

  it('não deve fechar automaticamente quando duração é 0', () => {
    render(<Toast {...toastProps} duracao={0} />);
    
    jest.advanceTimersByTime(5000);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});

