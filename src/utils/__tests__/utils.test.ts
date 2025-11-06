/**
 * Testes para Item 17: Validações Frontend Melhoradas
 * e Item 20: Validação de Datas
 */

import { validarNome, validarDatas, validarDataFutura, formatarDataParaInput, validar_email, formatarData } from '../utils';

describe('Validar Nome', () => {
  it('deve retornar erro quando nome está vazio', () => {
    const resultado = validarNome('');
    expect(resultado.valido).toBe(false);
    expect(resultado.mensagem).toBe('Nome é obrigatório');
  });

  it('deve retornar erro quando nome contém apenas espaços', () => {
    const resultado = validarNome('   ');
    expect(resultado.valido).toBe(false);
    expect(resultado.mensagem).toBe('Nome é obrigatório');
  });

  it('deve retornar erro quando nome excede tamanho máximo', () => {
    const nomeGrande = 'a'.repeat(201);
    const resultado = validarNome(nomeGrande, 200);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensagem).toBe('Nome deve ter no máximo 200 caracteres');
  });

  it('deve validar nome correto', () => {
    const resultado = validarNome('Treinamento de Teste');
    expect(resultado.valido).toBe(true);
    expect(resultado.mensagem).toBeUndefined();
  });

  it('deve validar nome no limite máximo', () => {
    const nomeLimite = 'a'.repeat(200);
    const resultado = validarNome(nomeLimite, 200);
    expect(resultado.valido).toBe(true);
  });
});

describe('Validar Datas', () => {
  it('deve retornar erro quando data início é igual à data conclusão', () => {
    const data = '2025-12-31';
    const resultado = validarDatas(data, data);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensagem).toBe('Data de início deve ser anterior à data de conclusão');
  });

  it('deve retornar erro quando data início é posterior à data conclusão', () => {
    const resultado = validarDatas('2025-12-31', '2025-12-30');
    expect(resultado.valido).toBe(false);
    expect(resultado.mensagem).toBe('Data de início deve ser anterior à data de conclusão');
  });

  it('deve validar datas corretas', () => {
    const resultado = validarDatas('2025-12-01', '2025-12-31');
    expect(resultado.valido).toBe(true);
    expect(resultado.mensagem).toBeUndefined();
  });
});

describe('Validar Data Futura', () => {
  it('deve retornar erro quando data é no passado', () => {
    const dataPassado = '2020-01-01';
    const resultado = validarDataFutura(dataPassado);
    expect(resultado.valido).toBe(false);
    expect(resultado.mensagem).toBe('Data não pode ser no passado');
  });

  it('deve validar data de hoje', () => {
    const hoje = new Date().toISOString().split('T')[0];
    const resultado = validarDataFutura(hoje);
    expect(resultado.valido).toBe(true);
  });

  it('deve validar data futura', () => {
    const dataFutura = '2030-12-31';
    const resultado = validarDataFutura(dataFutura);
    expect(resultado.valido).toBe(true);
  });
});

describe('Formatar Data Para Input', () => {
  it('deve formatar data corretamente para input', () => {
    const data = '2025-12-25T10:30:00';
    const formatada = formatarDataParaInput(data);
    expect(formatada).toBe('2025-12-25');
  });

  it('deve formatar data com zero à esquerda', () => {
    const data = '2025-01-05T00:00:00';
    const formatada = formatarDataParaInput(data);
    expect(formatada).toBe('2025-01-05');
  });
});

describe('Validar Email', () => {
  it('deve validar email correto', () => {
    expect(validar_email('teste@example.com')).toBe(true);
  });

  it('deve rejeitar email sem @', () => {
    expect(validar_email('testeexample.com')).toBe(false);
  });

  it('deve rejeitar email sem domínio', () => {
    expect(validar_email('teste@')).toBe(false);
  });
});

describe('Formatar Data', () => {
  it('deve formatar data apenas data', () => {
    const data = '2025-12-25T10:30:00';
    const formatada = formatarData(data, 'data');
    expect(formatada).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('deve formatar data com hora', () => {
    const data = '2025-12-25T10:30:00';
    const formatada = formatarData(data, 'tudo');
    expect(formatada).toContain('/2025');
  });
});

