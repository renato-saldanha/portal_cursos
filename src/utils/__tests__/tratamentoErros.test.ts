/**
 * Testes para Item 15: Melhorar Tratamento de Erros
 */

import { tratarErro, logarErro } from '../tratamentoErros';

// Mock do console.error
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Tratar Erro', () => {
  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });

  it('deve retornar mensagem para erro 403', () => {
    const error = {
      response: {
        status: 403,
      },
    };
    const mensagem = tratarErro(error);
    expect(mensagem).toBe('Você não tem permissão para esta ação');
  });

  it('deve retornar mensagem para erro 404', () => {
    const error = {
      response: {
        status: 404,
      },
    };
    const mensagem = tratarErro(error);
    expect(mensagem).toBe('Recurso não encontrado');
  });

  it('deve retornar mensagem para erro 500', () => {
    const error = {
      response: {
        status: 500,
      },
    };
    const mensagem = tratarErro(error);
    expect(mensagem).toBe('Erro interno do servidor. Tente novamente.');
  });

  it('deve tratar erro 400 com detail array', () => {
    const error = {
      response: {
        status: 400,
        data: {
          detail: [
            { msg: 'Campo obrigatório' },
            { message: 'Outro erro' },
          ],
        },
      },
    };
    const mensagem = tratarErro(error);
    expect(mensagem).toBe('Campo obrigatório, Outro erro');
  });

  it('deve tratar erro 400 com detail string', () => {
    const error = {
      response: {
        status: 400,
        data: {
          detail: 'Erro de validação',
        },
      },
    };
    const mensagem = tratarErro(error);
    expect(mensagem).toBe('Erro de validação');
  });

  it('deve tratar erro com mensagem', () => {
    const error = {
      response: {
        status: 400,
        data: {
          mensagem: 'Mensagem de erro específica',
        },
      },
    };
    const mensagem = tratarErro(error);
    expect(mensagem).toBe('Mensagem de erro específica');
  });

  it('deve tratar erro com campo erro', () => {
    const error = {
      response: {
        status: 400,
        data: {
          erro: 'Erro genérico',
        },
      },
    };
    const mensagem = tratarErro(error);
    expect(mensagem).toBe('Erro genérico');
  });

  it('deve tratar erro de rede', () => {
    const error = {
      message: 'Network Error',
    };
    const mensagem = tratarErro(error);
    expect(mensagem).toBe('Falha na conexão. Verifique sua internet.');
  });

  it('deve tratar erro de timeout', () => {
    const error = {
      message: 'timeout of 5000ms exceeded',
    };
    const mensagem = tratarErro(error);
    expect(mensagem).toBe('Falha na conexão. Verifique sua internet.');
  });

  it('deve tratar erro genérico', () => {
    const error = {};
    const mensagem = tratarErro(error);
    expect(mensagem).toBe('Ocorreu um erro inesperado. Tente novamente.');
  });

  it('deve tratar erro desconhecido com status', () => {
    const error = {
      response: {
        status: 418,
      },
    };
    const mensagem = tratarErro(error);
    expect(mensagem).toBe('Erro 418. Tente novamente.');
  });
});

describe('Logar Erro', () => {
  it('deve logar erro com contexto', () => {
    const error = {
      response: {
        status: 400,
        data: { erro: 'Teste' },
      },
    };
    logarErro(error, 'TesteContexto');
    expect(consoleErrorSpy).toHaveBeenCalledWith('[TesteContexto]', error);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Status:', 400);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Data:', { erro: 'Teste' });
  });

  it('deve logar erro sem contexto', () => {
    const error = new Error('Erro de teste');
    logarErro(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith('[Erro]', error);
  });
});

