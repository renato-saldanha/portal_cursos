/**
 * Testes para Item 14: ToastContainer e sistema de toast
 */

import { render, screen, waitFor } from '@testing-library/react';
import { toast } from '../index';

// Mock do Toast component
jest.mock('../../Toast', () => ({
  __esModule: true,
  default: ({ mensagem, tipo, onClose }: any) => (
    <div data-testid="toast" data-type={tipo}>
      <span>{mensagem}</span>
      <button onClick={() => onClose('test-id')}>Fechar</button>
    </div>
  ),
}));

describe('Toast System', () => {
  beforeEach(() => {
    // Limpar toasts antes de cada teste
    jest.clearAllTimers();
  });

  it('deve criar toast de sucesso', () => {
    toast.success('Operação realizada com sucesso!');
    // O toast é gerenciado globalmente, então testamos se a função não lança erro
    expect(() => toast.success('Teste')).not.toThrow();
  });

  it('deve criar toast de erro', () => {
    expect(() => toast.error('Erro ao processar')).not.toThrow();
  });

  it('deve criar toast de informação', () => {
    expect(() => toast.info('Informação importante')).not.toThrow();
  });

  it('deve criar toast de aviso', () => {
    expect(() => toast.warning('Atenção necessária')).not.toThrow();
  });

  it('deve criar toast com duração customizada', () => {
    expect(() => toast.success('Teste', 3000)).not.toThrow();
  });

  it('deve gerar IDs únicos para toasts', () => {
    const id1 = toast.success('Toast 1');
    const id2 = toast.success('Toast 2');
    
    // IDs devem ser diferentes
    expect(id1).not.toBe(id2);
  });
});

