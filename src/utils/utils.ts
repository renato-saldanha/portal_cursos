export const validar_email = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export const formatarData = (data: string, tipo: 'data' | 'tudo') => {
  switch (tipo) {
    case 'data': {
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
    default: {
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};

export const obterExtensaoArquivo = (caminhoArquivo: string): string => {
  return caminhoArquivo.split('.').pop() || '';
};

export const getDescricaoFormatada = (descricao: string | undefined, range: number) => {
  const nomeFormatado = descricao?.substring(0, range) + '...';
  return nomeFormatado;
}

// Validações
export const validarNome = (nome: string, maxLength: number = 200): { valido: boolean; mensagem?: string } => {
  if (!nome || nome.trim().length === 0) {
    return { valido: false, mensagem: 'Nome é obrigatório' };
  }
  if (nome.length > maxLength) {
    return { valido: false, mensagem: `Nome deve ter no máximo ${maxLength} caracteres` };
  }
  return { valido: true };
};

export const validarDatas = (dataInicio: string, dataConclusao: string): { valido: boolean; mensagem?: string } => {
  const inicio = new Date(dataInicio);
  const conclusao = new Date(dataConclusao);
  
  if (inicio >= conclusao) {
    return { valido: false, mensagem: 'Data de início deve ser anterior à data de conclusão' };
  }
  
  return { valido: true };
};

export const validarDataFutura = (data: string): { valido: boolean; mensagem?: string } => {
  const dataObj = new Date(data);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  if (dataObj < hoje) {
    return { valido: false, mensagem: 'Data não pode ser no passado' };
  }
  
  return { valido: true };
};

export const formatarDataParaInput = (data: string): string => {
  const dataObj = new Date(data);
  const ano = dataObj.getFullYear();
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const dia = String(dataObj.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};