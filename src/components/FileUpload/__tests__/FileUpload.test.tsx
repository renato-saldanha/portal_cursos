/**
 * Testes para Item 13: FileUpload com seleção de turma melhorada
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from '../index';

const mockOnUpload = jest.fn();

const turmasMock = [
  { id: 1, nome: 'Turma A', treinamento_nome: 'Treinamento 1' },
  { id: 2, nome: 'Turma B', treinamento_nome: 'Treinamento 2' },
];

describe('FileUpload Component - Seleção de Turma', () => {
  beforeEach(() => {
    mockOnUpload.mockClear();
  });

  it('deve renderizar dropdown quando há turmas disponíveis', () => {
    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={turmasMock}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe('SELECT');
  });

  it('deve renderizar input numérico quando não há turmas', () => {
    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={[]}
      />
    );

    const input = screen.getByPlaceholderText('ID da turma');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
  });

  it('deve exibir opções de turmas no dropdown', () => {
    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={turmasMock}
      />
    );

    expect(screen.getByText('Selecione uma turma')).toBeInTheDocument();
    expect(screen.getByText('Turma A - Treinamento 1')).toBeInTheDocument();
    expect(screen.getByText('Turma B - Treinamento 2')).toBeInTheDocument();
  });

  it('deve exibir apenas nome da turma quando não há treinamento_nome', () => {
    const turmasSemTreinamento = [
      { id: 1, nome: 'Turma A' },
    ];

    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={turmasSemTreinamento}
      />
    );

    expect(screen.getByText('Turma A')).toBeInTheDocument();
  });

  it('deve atualizar turma_id ao selecionar turma', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={turmasMock}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '1');

    expect(select).toHaveValue('1');
  });

  it('deve validar que turma é obrigatória', () => {
    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={turmasMock}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeRequired();
  });
});

