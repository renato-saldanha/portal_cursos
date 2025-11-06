/**
 * Testes para Item 14: Modal de Confirmação
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalConfirmacao from '../index';

const mockOnConfirmar = jest.fn();
const mockOnCancelar = jest.fn();

const modalProps = {
  aberto: true,
  titulo: 'Título do Modal',
  mensagem: 'Mensagem de confirmação',
  textoConfirmar: 'Confirmar',
  textoCancelar: 'Cancelar',
  tipo: 'danger' as const,
  onConfirmar: mockOnConfirmar,
  onCancelar: mockOnCancelar,
  carregando: false,
};

describe('ModalConfirmacao Component', () => {
  beforeEach(() => {
    mockOnConfirmar.mockClear();
    mockOnCancelar.mockClear();
  });

  it('não deve renderizar quando aberto é false', () => {
    render(<ModalConfirmacao {...modalProps} aberto={false} />);
    expect(screen.queryByText('Título do Modal')).not.toBeInTheDocument();
  });

  it('deve renderizar título e mensagem', () => {
    render(<ModalConfirmacao {...modalProps} />);
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
    expect(screen.getByText('Mensagem de confirmação')).toBeInTheDocument();
  });

  it('deve renderizar botões com textos customizados', () => {
    render(<ModalConfirmacao {...modalProps} />);
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('deve chamar onConfirmar ao clicar em confirmar', async () => {
    const user = userEvent.setup({ delay: null });
    render(<ModalConfirmacao {...modalProps} />);
    
    const botaoConfirmar = screen.getByText('Confirmar');
    await user.click(botaoConfirmar);
    
    expect(mockOnConfirmar).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onCancelar ao clicar em cancelar', async () => {
    const user = userEvent.setup({ delay: null });
    render(<ModalConfirmacao {...modalProps} />);
    
    const botaoCancelar = screen.getByText('Cancelar');
    await user.click(botaoCancelar);
    
    expect(mockOnCancelar).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onCancelar ao clicar no X', async () => {
    const user = userEvent.setup({ delay: null });
    render(<ModalConfirmacao {...modalProps} />);
    
    const botaoFechar = screen.getByLabelText('Fechar');
    await user.click(botaoFechar);
    
    expect(mockOnCancelar).toHaveBeenCalledTimes(1);
  });

  it('deve desabilitar botões quando carregando', () => {
    render(<ModalConfirmacao {...modalProps} carregando={true} />);
    
    const botaoConfirmar = screen.getByText('Confirmar');
    const botaoCancelar = screen.getByText('Cancelar');
    
    expect(botaoConfirmar).toBeDisabled();
    expect(botaoCancelar).toBeDisabled();
  });

  it('deve renderizar tipo danger', () => {
    render(<ModalConfirmacao {...modalProps} tipo="danger" />);
    const modal = screen.getByText('Título do Modal').closest('div');
    expect(modal).toBeInTheDocument();
  });

  it('deve renderizar tipo warning', () => {
    render(<ModalConfirmacao {...modalProps} tipo="warning" />);
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
  });

  it('deve renderizar tipo info', () => {
    render(<ModalConfirmacao {...modalProps} tipo="info" />);
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
  });
});

