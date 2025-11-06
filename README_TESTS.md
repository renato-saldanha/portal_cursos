# Guia de Testes - StrataSec

Este documento descreve como executar e manter os testes do projeto.

## Instalação de Dependências

Antes de executar os testes, instale as dependências de desenvolvimento:

```bash
npm install
```

## Executando os Testes

### Todos os Testes
```bash
npm test
```

### Testes em Modo Watch
```bash
npm run test:watch
```

### Testes com Coverage
```bash
npm run test:coverage
```

## Estrutura de Testes

Os testes estão organizados seguindo a estrutura do projeto:

```
src/
├── app/
│   ├── admin/
│   │   ├── turmas/
│   │   │   └── __tests__/
│   │   │       └── excluirTurma.test.tsx
│   │   ├── recursos/
│   │   │   └── __tests__/
│   │   │       └── filtrosEBusca.test.tsx
│   │   └── treinamentos/
│   │       └── __tests__/
│   │           └── gerenciarTurmas.test.tsx
├── components/
│   ├── Toast/
│   │   └── __tests__/
│   │       └── Toast.test.tsx
│   ├── ModalConfirmacao/
│   │   └── __tests__/
│   │       └── ModalConfirmacao.test.tsx
│   ├── FileUpload/
│   │   └── __tests__/
│   │       └── FileUpload.test.tsx
│   └── ToastContainer/
│       └── __tests__/
│           └── ToastContainer.test.tsx
├── lib/
│   └── __tests__/
│       └── auth.test.ts
└── utils/
    └── __tests__/
        ├── utils.test.ts
        └── tratamentoErros.test.ts
```

## Cobertura de Testes

### Itens Testados

#### ✅ Item 11: Excluir Turma
- Botão de exclusão
- Modal de confirmação
- Validação (turma com recursos)
- Sucesso na exclusão
- Cancelamento

#### ✅ Item 12: Filtros e Busca - Recursos
- Busca por nome/descrição
- Filtro por tipo
- Filtro por turma
- Filtro por acesso prévio
- Filtro por rascunho
- Limpar filtros
- Contador de recursos filtrados

#### ✅ Item 13: FileUpload com Seleção de Turma
- Dropdown quando há turmas
- Input numérico quando não há turmas
- Exibição de nome e treinamento
- Seleção de turma
- Validação obrigatória

#### ✅ Item 14: Toast e ModalConfirmacao
- Renderização de diferentes tipos de toast
- Auto-fechamento de toast
- Fechamento manual
- Modal de confirmação
- Botões de ação
- Estado de carregamento

#### ✅ Item 15: Tratamento de Erros
- Erros HTTP (403, 404, 500)
- Erros de validação (400)
- Erros de rede
- Logging de erros

#### ✅ Item 16: Métodos CRUD no authService
- Criar treinamento
- Atualizar treinamento
- Excluir treinamento
- Criar turma
- Atualizar turma
- Excluir turma
- Atualizar recurso

#### ✅ Item 17: Validações Frontend
- Validação de nome (obrigatório, tamanho máximo)
- Validação de email
- Formatação de data

#### ✅ Item 19: Gerenciar Turmas do Treinamento
- Botão Gerenciar Turmas
- Redirecionamento com filtro
- ID correto do treinamento

#### ✅ Item 20: Validação de Datas
- Validação data_inicio < data_conclusao
- Validação de data futura
- Formatação de data para input

## Escrevendo Novos Testes

### Estrutura Básica

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MeuComponente from '../index';

describe('MeuComponente', () => {
  it('deve renderizar corretamente', () => {
    render(<MeuComponente />);
    expect(screen.getByText('Texto esperado')).toBeInTheDocument();
  });

  it('deve executar ação ao clicar', async () => {
    const user = userEvent.setup({ delay: null });
    const mockAction = jest.fn();
    
    render(<MeuComponente onClick={mockAction} />);
    
    const botao = screen.getByRole('button');
    await user.click(botao);
    
    expect(mockAction).toHaveBeenCalled();
  });
});
```

### Boas Práticas

1. **Organize testes por funcionalidade**: Cada arquivo de teste deve focar em uma funcionalidade específica
2. **Use descrições claras**: Nomes de testes devem descrever o comportamento esperado
3. **Mock dependências externas**: Mock APIs, hooks do Next.js, etc.
4. **Limpe mocks**: Use `beforeEach` para limpar mocks entre testes
5. **Teste casos de erro**: Não apenas os casos de sucesso
6. **Teste acessibilidade**: Use `getByLabelText`, `getByRole`, etc.

## Troubleshooting

### Erros Comuns

1. **Module not found**: Verifique se o caminho do import está correto
2. **Mock não funcionando**: Certifique-se de que o mock está configurado antes do import
3. **Teste falhando no CI**: Alguns testes podem precisar de ajustes para ambiente CI/CD

### Debugging

Para debugar um teste específico:

```bash
npm test -- --testNamePattern="nome do teste"
```

Para ver logs detalhados:

```bash
npm test -- --verbose
```

## Contribuindo

Ao adicionar novas funcionalidades, certifique-se de:

1. Escrever testes para a nova funcionalidade
2. Manter a cobertura de testes acima de 80%
3. Atualizar este README se necessário
4. Executar todos os testes antes de fazer commit

