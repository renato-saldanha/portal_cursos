import { useState, useCallback, useEffect } from 'react';
import { CodigoVerificacaoResponse, LoginData, Recurso } from '@/types';
import { authService } from '../auth';
import { EMAIL_USUARIO_SALVO, USUARIO } from '@/utils/Const';


export function useEstadoApi() {
  const [carregandoEstado, setCarregandoEstado] = useState(false);
  const [erroEstado, setErroEstado] = useState<string | null>(null);

  const executarComEstado = useCallback(async <T>(
    operacao: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setCarregandoEstado(true);
      setErroEstado(null);

      const resultado = await operacao();

      return resultado;
    } catch (error: unknown) {
      let mensagem = 'Erro desconhecido';

      // Tratar diferentes tipos de erro
      if (error instanceof Error) {
        mensagem = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        // Erro do Axios com resposta
        const axiosError = error as { response: { data: unknown } };
        const data = axiosError.response.data;
        if (typeof data === 'string') {
          mensagem = data;
        } else if (data && typeof data === 'object' && 'detail' in data) {
          const detailData = data as { detail: unknown };
          if (Array.isArray(detailData.detail)) {
            mensagem = detailData.detail.map((d: { msg?: string; message?: string }) => d.msg || d.message || String(d)).join(', ');
          } else {
            mensagem = String(detailData.detail);
          }
        } else if (data && typeof data === 'object' && 'message' in data) {
          const messageData = data as { message: string };
          mensagem = messageData.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const errorWithMessage = error as { message: string };
        mensagem = errorWithMessage.message;
      }

      setErroEstado(mensagem);
      console.error('Erro na operação:', mensagem, error);
      return null;
    } finally {
      setCarregandoEstado(false);
    }
  }, []);

  const limparErro = useCallback(() => {
    setErroEstado(null);
  }, []);

  return {
    carregandoEstado,
    erroEstado,
    executarComEstado,
    limparErro,
  };
}

export function useAutenticacao() {
  const { carregandoEstado, erroEstado, executarComEstado, limparErro } = useEstadoApi();
  const [usuario, setUsuario] = useState<LoginData | null>(null);

  const fazerLogout = useCallback(() => {
    authService.logout();
    setUsuario(null);
  }, []);

  const verificarAutenticacao = useCallback(async (): Promise<LoginData | null> => {
    if (!authService.isAutenticado()) {
      return null;
    }

    const usuario = await executarComEstado(() =>
      authService.isConexaoValida()
    );

    return usuario || null;
  }, [executarComEstado]);

  const enviarCodigoverificacao = useCallback(async (usuario: LoginData) => {
    let resultado: CodigoVerificacaoResponse | null = { sucesso: false, mensagem: 'Favor Preencher o email', expira_em: '' };

    if (!usuario.email) {
      resultado = { sucesso: false, mensagem: 'Favor Preencher o email', expira_em: '' };
    }

    resultado = await executarComEstado(() =>
      authService.enviarCodigoVerificacao(usuario)
    );

    if (!resultado) {
      resultado = { sucesso: false, mensagem: 'Usuário inválido, favor verificar', expira_em: '' }
    };

    return resultado || 'Erro ao enviar código de verificação';
  }, [executarComEstado]);

  const reenviarCodigoCallback = useCallback(async (usuario: LoginData) => {
    const resultado = await executarComEstado(() =>
      authService.reenviarCodigo(usuario)
    );
    return resultado;
  }, [executarComEstado]);

  const emailExiste = useCallback(async (email: string) => {
    const resultado = await executarComEstado(() =>
      authService.emailExistente(email)
    );
    return resultado;
  }, [executarComEstado]);

  const verificarCodigoCallback = useCallback(async (email: string, codigo: string) => {
    const resultado = await executarComEstado(() =>
      authService.verificarCodigo(email, codigo)
    );
    if (resultado) setUsuario(resultado?.usuario);
    return resultado;
  }, [executarComEstado]);

  const downloadRecursoArquivo = useCallback(async (recurso: Recurso) => {
    const resultado = await executarComEstado(() =>
      authService.baixarRecursoArquivo(recurso)
    );
    return resultado;
  }, [executarComEstado])

  const isAdm = useCallback(async (email: string) => {
    const resultado = await executarComEstado(() =>
      authService.isAdministrador(email)
    );
    return resultado;
  }, [executarComEstado]);

  const getTurmas = useCallback(async () => {
    const resultado = await executarComEstado(() =>
      authService.getTurmas()
    );
    return resultado;
  }, [executarComEstado]);

  const getTreinamentos = useCallback(async () => {
    const resultado = await executarComEstado(() =>
      authService.getTreinamentos()
    );
    return resultado;
  }, [executarComEstado]);

  const getRecursos = useCallback(async () => {
    const resultado = await executarComEstado(() =>
      authService.getRecursos()
    );
    return resultado;
  }, [executarComEstado]);

  useEffect(() => {
    const carregarUsuario = async () => {
      if (authService.isAutenticado() && !usuario) {
        const usuarioCarregado = await verificarAutenticacao();
        if (usuarioCarregado) {
          setUsuario(usuarioCarregado);
        }
      }
    };

    carregarUsuario();
  }, [verificarAutenticacao, usuario]);

  return {
    usuarioLogado: usuario,
    carregandoEstado,
    erroEstado,
    fazerLogout,
    verificarAutenticacao,
    limparErro,
    isAutenticado: () => authService.isAutenticado(),
    enviarCodigoverificacao,
    emailExistente: emailExiste,
    verificarCodigo: verificarCodigoCallback,
    reenviarCodigo: reenviarCodigoCallback,
    isConexaoValida: authService.isConexaoValida,
    downloadRecursoArquivo,
    isAdm,
    getTurmas,
    getRecursos,
    getTreinamentos,
    isClient: authService.isConexaoValida,
  };
}

