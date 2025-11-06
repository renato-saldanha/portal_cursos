import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardAluno from '../page';
import { authService } from '@/lib/auth';
import { useAutenticacao } from '@/lib/hooks/useApi';

jest.mock('@/lib/auth');
jest.mock('@/lib/hooks/useApi');
jest.mock('@/components/VideoPlayer', () => ({
  __esModule: true,
  default: ({ recurso }: { recurso: any }) => (
    <div data-testid="video-player">{recurso.nome}</div>
  ),
}));

const mockFazerLogout = jest.fn();
const mockDownloadRecurso = jest.fn();

const mockTreinamentos = [
  {
    id: 1,
    nome: 'Treinamento Teste',
    descricao: 'Descrição teste',
    turmas: [
      {
        id: 1,
        nome: 'Turma A',
        status: 'Em Andamento',
        recursos: [
          {
            id: 1,
            nome: 'Recurso Teste',
            tipo_recurso: 'video',
            is_acessivel: true,
          },
        ],
      },
    ],
  },
];

describe('Dashboard Aluno', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (authService.buscarTreinamentosAluno as jest.Mock).mockResolvedValue({
      sucesso: true,
      treinamentos: mockTreinamentos,
    });

    (useAutenticacao as jest.Mock).mockReturnValue({
      fazerLogout: mockFazerLogout,
      downloadRecursoArquivo: mockDownloadRecurso,
      usuarioLogado: { email: 'aluno@test.com', nome: 'Aluno' },
    });
  });

  it('deve renderizar dashboard com treinamentos', async () => {
    render(<DashboardAluno />);

    await waitFor(() => {
      expect(screen.getByText('Treinamento Teste')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('deve selecionar turma e mostrar recursos', async () => {
    render(<DashboardAluno />);

    await waitFor(() => {
      expect(screen.getByText('Treinamento Teste')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Buscar elemento que contém "Turma A" e clicar no elemento pai
    await waitFor(() => {
      const elementoTurma = screen.getByText('Turma A');
      expect(elementoTurma).toBeInTheDocument();
      
      // Buscar elemento pai clicável (pode ter onClick ou ser um div com cursor-pointer)
      let elementoClicavel = elementoTurma.parentElement;
      while (elementoClicavel && !elementoClicavel.onclick && !elementoClicavel.className?.includes('cursor-pointer')) {
        elementoClicavel = elementoClicavel.parentElement;
      }
      
      // Se encontrou um elemento pai clicável, clicar nele, senão clicar no elemento turma
      if (elementoClicavel && (elementoClicavel.onclick || elementoClicavel.className?.includes('cursor-pointer'))) {
        fireEvent.click(elementoClicavel);
      } else {
        // Tentar encontrar um div que contenha a turma e tenha onClick
        const divs = screen.container.querySelectorAll('div');
        const divClicavel = Array.from(divs).find(div => 
          div.textContent?.includes('Turma A') && 
          (div.onclick || div.className?.includes('cursor-pointer') || div.className?.includes('group'))
        );
        if (divClicavel) {
          fireEvent.click(divClicavel);
        }
      }
    }, { timeout: 5000 });

    // Verificar se recursos aparecem
    await waitFor(() => {
      expect(screen.getByText('Recurso Teste')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
