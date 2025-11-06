/**
 * Sistema centralizado de tratamento de erros
 * Fornece mensagens específicas por tipo de erro HTTP
 */

export interface ErroHttp {
  status?: number;
  mensagem?: string;
  detail?: string | string[];
  erro?: string;
}

export const tratarErro = (error: unknown): string => {
  // Erro de rede ou sem resposta
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number; data?: ErroHttp } };
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    if (status === 403) {
      return 'Você não tem permissão para esta ação';
    }

    if (status === 404) {
      return 'Recurso não encontrado';
    }

    if (status === 500) {
      return 'Erro interno do servidor. Tente novamente.';
    }

    if (status === 400) {
      // Erro de validação
      if (data?.detail) {
        const detail = data.detail;
        if (Array.isArray(detail)) {
          return detail.map((d: any) => d?.msg || d?.message || String(d)).join(', ');
        }
        return String(detail);
      }
      return data?.mensagem || data?.erro || 'Erro na requisição. Verifique os dados informados.';
    }

    if (data?.mensagem) {
      return data.mensagem;
    }

    if (data?.erro) {
      return data.erro;
    }

    if (data?.detail) {
      const detail = data.detail;
      if (Array.isArray(detail)) {
        return detail.map((d: any) => d?.msg || d?.message || String(d)).join(', ');
      }
      return String(detail);
    }

    return `Erro ${status || 'desconhecido'}. Tente novamente.`;
  }

  // Erro sem conexão ou timeout
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as { message: string }).message;
    if (errorMessage.includes('Network Error') || errorMessage.includes('timeout')) {
      return 'Falha na conexão. Verifique sua internet.';
    }
    return errorMessage;
  }

  // Erro genérico
  return 'Ocorreu um erro inesperado. Tente novamente.';
};

export const logarErro = (error: unknown, contexto?: string): void => {
  console.error(`[${contexto || 'Erro'}]`, error);
  
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number; data?: unknown } };
    console.error('Status:', axiosError.response?.status);
    console.error('Data:', axiosError.response?.data);
  }
};

