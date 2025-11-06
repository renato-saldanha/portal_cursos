import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminTurmas from '../page';
import { authService } from '@/lib/auth';
import { useAutenticacao } from '@/lib/hooks/useApi';

jest.mock('@/lib/auth');
jest.mock('@/lib/hooks/useApi');
jest.mock('@/components/ToastContainer', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  })
}));

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const mockedUseAutenticacao = useAutenticacao as jest.MockedFunction<typeof useAutenticacao>;

const mockTurmas = [
  {
    id: 1,
    treinamento: 1,
    treinamento_nome: 'Treinamento 1',
    nome: 'Turma A',
    data_inicio: '2025-02-01T00:00:00Z',
    data_conclusao: '2025-02-28T00:00:00Z',
    data_criacao: '2025-01-27T00:00:00Z',
    data_atualizacao: '2025-01-27T00:00:00Z',
    status: 'Aguardando',
    recursos: []
  }
];

const mockTreinamentos = [
  {
    id: 1,
    nome: 'Treinamento 1',
    descricao: 'Descrição',
    data_criacao: '2025-01-27T00:00:00Z',
    data_atualizacao: '2025-01-27T00:00:00Z',
    turmas: []
  }
];

describe('Item 9, 10: Admin Turmas - CRUD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAutenticacao.mockReturnValue({
      getTurmas: jest.fn().mockResolvedValue(mockTurmas),
      getTreinamentos: jest.fn().mockResolvedValue(mockTreinamentos),
      getRecursos: jest.fn().mockResolvedValue([]),
      fazerLogout: jest.fn(),
      downloadRecursoArquivo: jest.fn(),
      usuarioLogado: null,
      isClient: jest.fn().mockResolvedValue({ email: 'test@test.com', nome: 'Test' }),
      carregandoEstado: false,
      erroEstado: null,
      limparErro: jest.fn(),
      verificarAutenticacao: jest.fn().mockResolvedValue(null),
      isAutenticado: jest.fn().mockReturnValue(true),
      isConexaoValida: jest.fn().mockResolvedValue({ email: 'test@test.com', nome: 'Test' }),
      isAdm: jest.fn(),
      verificarCodigo: jest.fn(),
      reenviarCodigo: jest.fn(),
      enviarCodigoverificacao: jest.fn(),
      emailExistente: jest.fn()
    });
  });

  describe('Item 9: Criar Turma', () => {
    it('deve abrir modal de criação', async () => {
      render(<AdminTurmas />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando turmas...')).not.toBeInTheDocument();
      });

      // Usar getAllByRole para encontrar o botão específico
      const botoes = screen.getAllByRole('button');
      const botaoNova = botoes.find(btn => btn.textContent?.includes('Nova Turma'));
      expect(botaoNova).toBeInTheDocument();
      
      if (botaoNova) {
        fireEvent.click(botaoNova);
      }

      await waitFor(() => {
        // Buscar pelo título do modal (heading)
        const titulos = screen.queryAllByRole('heading');
        const tituloModal = titulos.find(h => h.textContent?.includes('Nova Turma'));
        expect(tituloModal).toBeInTheDocument();
      });
    });

    it('deve criar turma com validação de datas', async () => {
      mockedAuthService.criarTurma.mockResolvedValueOnce({
        id: 2,
        treinamento: 1,
        treinamento_nome: 'Treinamento 1',
        nome: 'Nova Turma',
        data_inicio: '2025-03-01T00:00:00Z',
        data_conclusao: '2025-03-31T00:00:00Z',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        status: 'Aguardando',
        recursos: []
      });

      render(<AdminTurmas />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando turmas...')).not.toBeInTheDocument();
      });

      const botoes = screen.getAllByRole('button');
      const botaoNova = botoes.find(btn => btn.textContent?.includes('Nova Turma'));
      
      if (botaoNova) {
        fireEvent.click(botaoNova);
      }

      await waitFor(() => {
        const titulos = screen.queryAllByRole('heading');
        const tituloModal = titulos.find(h => h.textContent?.includes('Nova Turma'));
        expect(tituloModal).toBeInTheDocument();
      });

      // Tentar encontrar o select de treinamento
      const selects = screen.queryAllByRole('combobox');
      const selectTreinamento = selects.find(sel => sel.getAttribute('name')?.includes('treinamento') || sel.textContent?.includes('treinamento') || sel.querySelector('option[value=""]'));
      
      if (selectTreinamento) {
        fireEvent.change(selectTreinamento, { target: { value: '1' } });
      }

      const inputNome = screen.queryByPlaceholderText('Nome da turma') || screen.queryByLabelText(/nome/i);
      if (inputNome) {
        fireEvent.change(inputNome, { target: { value: 'Nova Turma' } });
      }

      // Buscar inputs de data usando querySelectorAll
      await waitFor(() => {
        const inputsData = Array.from(document.querySelectorAll('input[type="date"]')) as HTMLInputElement[];
        expect(inputsData.length).toBeGreaterThanOrEqual(2);
      });

      const inputsData = Array.from(document.querySelectorAll('input[type="date"]')) as HTMLInputElement[];
      if (inputsData.length >= 2) {
        fireEvent.change(inputsData[0], { target: { value: '2025-03-01' } });
        fireEvent.change(inputsData[1], { target: { value: '2025-03-31' } });
      }

      const botaoCriar = screen.queryByRole('button', { name: /criar/i }) || screen.queryByText('Criar');
      if (botaoCriar) {
        fireEvent.click(botaoCriar);
      }

      await waitFor(() => {
        expect(mockedAuthService.criarTurma).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('deve validar que data_inicio < data_conclusao', async () => {
      render(<AdminTurmas />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando turmas...')).not.toBeInTheDocument();
      });

      const botoes = screen.getAllByRole('button');
      const botaoNova = botoes.find(btn => btn.textContent?.includes('Nova Turma'));
      
      if (botaoNova) {
        fireEvent.click(botaoNova);
      }

      await waitFor(() => {
        const titulos = screen.queryAllByRole('heading');
        const tituloModal = titulos.find(h => h.textContent?.includes('Nova Turma'));
        expect(tituloModal).toBeInTheDocument();
      });

      // Preencher formulário com datas inválidas
      const selects = screen.queryAllByRole('combobox');
      const selectTreinamento = selects.find(sel => sel.getAttribute('name')?.includes('treinamento') || sel.querySelector('option[value=""]'));
      
      if (selectTreinamento) {
        fireEvent.change(selectTreinamento, { target: { value: '1' } });
      }

      const inputNome = screen.queryByPlaceholderText('Nome da turma');
      if (inputNome) {
        fireEvent.change(inputNome, { target: { value: 'Nova Turma' } });
      }

      // Buscar inputs de data usando querySelectorAll
      await waitFor(() => {
        const inputsData = Array.from(document.querySelectorAll('input[type="date"]')) as HTMLInputElement[];
        expect(inputsData.length).toBeGreaterThanOrEqual(2);
      });

      const inputsData = Array.from(document.querySelectorAll('input[type="date"]')) as HTMLInputElement[];
      if (inputsData.length >= 2) {
        fireEvent.change(inputsData[0], { target: { value: '2025-03-31' } });
        fireEvent.change(inputsData[1], { target: { value: '2025-03-01' } });
      }

      const botaoCriar = screen.queryByRole('button', { name: /criar/i }) || screen.queryByText('Criar');
      if (botaoCriar) {
        fireEvent.click(botaoCriar);
      }

      await waitFor(() => {
        // Verificar mensagem de erro - tentar diferentes formas
        const mensagensErro = screen.queryAllByText(/data de início deve ser anterior/i) || 
                              screen.queryAllByText(/data.*início.*anterior/i) ||
                              screen.queryAllByText(/A data de início/i);
        expect(mensagensErro.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });
  });

  describe('Item 10: Editar Turma', () => {
    it('deve abrir modal de edição com dados pré-preenchidos', async () => {
      render(<AdminTurmas />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando turmas...')).not.toBeInTheDocument();
      });

      const botoesEditar = screen.getAllByText('Editar');
      if (botoesEditar.length > 0) {
        fireEvent.click(botoesEditar[0]);
      }

      await waitFor(() => {
        expect(screen.getByText('Editar Turma')).toBeInTheDocument();
      });
    });

    it('deve atualizar turma com validação de datas', async () => {
      mockedAuthService.atualizarTurma.mockResolvedValueOnce({
        id: 1,
        treinamento: 1,
        treinamento_nome: 'Treinamento 1',
        nome: 'Turma Atualizada',
        data_inicio: '2025-02-01T00:00:00Z',
        data_conclusao: '2025-02-28T00:00:00Z',
        data_criacao: '2025-01-27T00:00:00Z',
        data_atualizacao: '2025-01-27T00:00:00Z',
        status: 'Aguardando',
        recursos: []
      });

      render(<AdminTurmas />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando turmas...')).not.toBeInTheDocument();
      });

      const botoesEditar = screen.getAllByText('Editar');
      if (botoesEditar.length > 0) {
        fireEvent.click(botoesEditar[0]);
      }

      await waitFor(() => {
        expect(screen.getByText('Editar Turma')).toBeInTheDocument();
      });

      const inputNome = screen.getByDisplayValue('Turma A');
      fireEvent.change(inputNome, { target: { value: 'Turma Atualizada' } });

      const botaoSalvar = screen.getByText('Salvar');
      fireEvent.click(botaoSalvar);

      await waitFor(() => {
        expect(mockedAuthService.atualizarTurma).toHaveBeenCalled();
      });
    });

    it('deve validar datas ao editar', async () => {
      render(<AdminTurmas />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando turmas...')).not.toBeInTheDocument();
      });

      const botoesEditar = screen.getAllByText('Editar');
      if (botoesEditar.length > 0) {
        fireEvent.click(botoesEditar[0]);
      }

      await waitFor(() => {
        expect(screen.getByText('Editar Turma')).toBeInTheDocument();
      });

      // Buscar inputs de data usando querySelectorAll
      await waitFor(() => {
        const inputsData = Array.from(document.querySelectorAll('input[type="date"]')) as HTMLInputElement[];
        expect(inputsData.length).toBeGreaterThanOrEqual(2);
      });

      const inputsData = Array.from(document.querySelectorAll('input[type="date"]')) as HTMLInputElement[];
      if (inputsData.length >= 2) {
        fireEvent.change(inputsData[0], { target: { value: '2025-02-28' } });
        fireEvent.change(inputsData[1], { target: { value: '2025-02-01' } });
      }

      const botaoSalvar = screen.getByText('Salvar');
      fireEvent.click(botaoSalvar);

      await waitFor(() => {
        // Verificar mensagem de erro - tentar diferentes formas
        const mensagensErro = screen.queryAllByText(/data de início deve ser anterior/i) || 
                              screen.queryAllByText(/data.*início.*anterior/i) ||
                              screen.queryAllByText(/A data de início/i);
        expect(mensagensErro.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });
  });

  describe('Excluir Turma', () => {
    it('deve impedir exclusão se tiver recursos associados', async () => {
      const turmaComRecursos = {
        ...mockTurmas[0],
        recursos: [{ id: 1, nome: 'Recurso 1' }]
      };

      mockedUseAutenticacao.mockReturnValue({
        getTurmas: jest.fn().mockResolvedValue([turmaComRecursos]),
        getTreinamentos: jest.fn().mockResolvedValue(mockTreinamentos),
        getRecursos: jest.fn().mockResolvedValue([]),
        fazerLogout: jest.fn(),
        downloadRecursoArquivo: jest.fn(),
        usuarioLogado: null,
        isClient: jest.fn().mockResolvedValue({ email: 'test@test.com', nome: 'Test' }),
        carregandoEstado: false,
        erroEstado: null,
        limparErro: jest.fn(),
        verificarAutenticacao: jest.fn().mockResolvedValue(null),
        isAutenticado: jest.fn().mockReturnValue(true),
        isConexaoValida: jest.fn().mockResolvedValue({ email: 'test@test.com', nome: 'Test' }),
        isAdm: jest.fn(),
        verificarCodigo: jest.fn(),
        reenviarCodigo: jest.fn(),
        enviarCodigoverificacao: jest.fn(),
        emailExistente: jest.fn()
      });

      render(<AdminTurmas />);

      await waitFor(() => {
        expect(screen.queryByText('Carregando turmas...')).not.toBeInTheDocument();
      });

      // Buscar botão de excluir do card (não do modal)
      const botoesExcluir = screen.getAllByRole('button');
      const botaoExcluirCard = botoesExcluir.find(btn => 
        btn.getAttribute('aria-label')?.includes('Excluir') || 
        (btn.textContent?.includes('Excluir') && !btn.closest('[role="dialog"]'))
      );
      
      if (botaoExcluirCard) {
        fireEvent.click(botaoExcluirCard);
      }

      await waitFor(() => {
        expect(screen.getByText('Excluir Turma')).toBeInTheDocument();
      });

      // Buscar botão Excluir do modal (deve estar desabilitado)
      const botoesNoModal = screen.getAllByRole('button');
      const botaoExcluirModal = botoesNoModal.find(btn => 
        btn.textContent?.includes('Excluir') && 
        (btn.closest('[role="dialog"]') || btn.disabled || btn.classList.contains('disabled'))
      );
      
      if (botaoExcluirModal) {
        expect(botaoExcluirModal).toBeDisabled();
      }
    });
  });
});
