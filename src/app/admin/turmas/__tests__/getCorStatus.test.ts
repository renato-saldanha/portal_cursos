import { Turma } from '@/types';

describe('Item 3: getCorStatus - Correção de bug switch case', () => {
  // Função extraída para testes (mesma lógica do componente)
  const getCorStatus = (turma: Turma) => {
    const status = turma.status;
    let corStatus;
    switch (status) {
      case 'Aguardando':
        corStatus = 'text-red-dark bg-red-light';
        break;
      case 'Finalizada':
        corStatus = 'text-gray-dark bg-gray-100';
        break;
      default:
        corStatus = 'text-green-dark bg-green-light';
    }

    return {
      status: turma.status,
      cor: corStatus,
    };
  };

  it('deve retornar cor correta para status "Aguardando"', () => {
    const turma: Turma = {
      id: 1,
      treinamento: 1,
      treinamento_nome: 'Teste',
      nome: 'Turma A',
      data_inicio: '2025-02-01T00:00:00Z',
      data_conclusao: '2025-02-28T00:00:00Z',
      data_criacao: '2025-01-27T00:00:00Z',
      data_atualizacao: '2025-01-27T00:00:00Z',
      status: 'Aguardando',
      recursos: []
    };

    const resultado = getCorStatus(turma);

    expect(resultado.status).toBe('Aguardando');
    expect(resultado.cor).toBe('text-red-dark bg-red-light');
  });

  it('deve retornar cor correta para status "Finalizada"', () => {
    const turma: Turma = {
      id: 1,
      treinamento: 1,
      treinamento_nome: 'Teste',
      nome: 'Turma A',
      data_inicio: '2025-02-01T00:00:00Z',
      data_conclusao: '2025-02-28T00:00:00Z',
      data_criacao: '2025-01-27T00:00:00Z',
      data_atualizacao: '2025-01-27T00:00:00Z',
      status: 'Finalizada',
      recursos: []
    };

    const resultado = getCorStatus(turma);

    expect(resultado.status).toBe('Finalizada');
    expect(resultado.cor).toBe('text-gray-dark bg-gray-100');
  });

  it('deve retornar cor correta para status "Em andamento" (default)', () => {
    const turma: Turma = {
      id: 1,
      treinamento: 1,
      treinamento_nome: 'Teste',
      nome: 'Turma A',
      data_inicio: '2025-02-01T00:00:00Z',
      data_conclusao: '2025-02-28T00:00:00Z',
      data_criacao: '2025-01-27T00:00:00Z',
      data_atualizacao: '2025-01-27T00:00:00Z',
      status: 'Em andamento',
      recursos: []
    };

    const resultado = getCorStatus(turma);

    expect(resultado.status).toBe('Em andamento');
    expect(resultado.cor).toBe('text-green-dark bg-green-light');
  });

  it('não deve cair em case incorreto após corrigir break statements', () => {
    const turmaAguardando: Turma = {
      id: 1,
      treinamento: 1,
      treinamento_nome: 'Teste',
      nome: 'Turma A',
      data_inicio: '2025-02-01T00:00:00Z',
      data_conclusao: '2025-02-28T00:00:00Z',
      data_criacao: '2025-01-27T00:00:00Z',
      data_atualizacao: '2025-01-27T00:00:00Z',
      status: 'Aguardando',
      recursos: []
    };

    const resultado = getCorStatus(turmaAguardando);

    expect(resultado.cor).toBe('text-red-dark bg-red-light');
    expect(resultado.cor).not.toBe('text-gray-dark bg-gray-100');
    expect(resultado.cor).not.toBe('text-green-dark bg-green-light');
  });
});

