import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from '../index';

const mockTurmas = [
  { id: 1, nome: 'Turma A', treinamento_nome: 'Treinamento 1' },
  { id: 2, nome: 'Turma B', treinamento_nome: 'Treinamento 2' },
  { id: 3, nome: 'Turma C' }
];

const mockOnUpload = jest.fn().mockResolvedValue(undefined);

describe('Item 13: FileUpload - Melhorar Seleção de Turma', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve mostrar select quando há turmas disponíveis', () => {
    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={mockTurmas}
      />
    );

    const select = screen.getByDisplayValue('Selecione uma turma');
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe('SELECT');
  });

  it('deve mostrar input numérico quando não há turmas', () => {
    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={[]}
      />
    );

    const input = screen.getByPlaceholderText('ID da turma');
    expect(input).toBeInTheDocument();
    expect(input.getAttribute('type')).toBe('number');
  });

  it('deve mostrar nome da turma no formato "Turma - Treinamento"', () => {
    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={mockTurmas}
      />
    );

    expect(screen.getByText('Turma A - Treinamento 1')).toBeInTheDocument();
    expect(screen.getByText('Turma B - Treinamento 2')).toBeInTheDocument();
  });

  it('deve mostrar apenas nome da turma quando não há treinamento_nome', () => {
    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={mockTurmas}
      />
    );

    expect(screen.getByText('Turma C')).toBeInTheDocument();
  });

  it('deve selecionar turma corretamente', async () => {
    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={mockTurmas}
      />
    );

    const select = screen.getByDisplayValue('Selecione uma turma').closest('select');
    fireEvent.change(select!, { target: { value: '2' } });

    expect(select?.value).toBe('2');
  });

  it('deve validar que turma foi selecionada antes de enviar', async () => {
    const arquivo = new File(['conteudo'], 'video.mp4', { type: 'video/mp4' });

    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={mockTurmas}
      />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', {
      value: [arquivo],
      writable: false
    });
    fireEvent.change(fileInput);

    const inputNome = screen.getByPlaceholderText('Nome do recurso');
    fireEvent.change(inputNome, { target: { value: 'Teste' } });

    // Verifica que o botão está desabilitado quando turma não é selecionada
    const botaoEnviar = screen.getByText('Enviar Arquivo');
    expect(botaoEnviar).toBeDisabled();

    expect(mockOnUpload).not.toHaveBeenCalled();
  });

  it('deve enviar com turma selecionada corretamente', async () => {
    const arquivo = new File(['conteudo'], 'video.mp4', { type: 'video/mp4' });

    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={mockTurmas}
      />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', {
      value: [arquivo],
      writable: false
    });
    fireEvent.change(fileInput);

    const select = screen.getByDisplayValue('Selecione uma turma').closest('select');
    fireEvent.change(select!, { target: { value: '1' } });

    const inputNome = screen.getByPlaceholderText('Nome do recurso');
    fireEvent.change(inputNome, { target: { value: 'Teste' } });

    const botaoEnviar = screen.getByText('Enviar Arquivo');
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(
        arquivo,
        expect.objectContaining({
          turma_id: 1,
          nome: 'Teste'
        })
      );
    });
  });

  it('deve ter touch target mínimo de 44px no select', () => {
    render(
      <FileUpload
        onUpload={mockOnUpload}
        tipoRecurso="video"
        turmas={mockTurmas}
      />
    );

    const select = screen.getByDisplayValue('Selecione uma turma').closest('select');
    expect(select).toHaveClass('min-h-[44px]');
  });
});

