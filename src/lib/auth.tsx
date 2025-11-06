import { AuthResponse, CodigoVerificacaoResponse, EmailValidacaoResponse, LoginData, Recurso, Treinamento, TreinamentoAlunoResponse, Turma, UploadResponse, AdmResponse, UsuarioResponse } from '@/types';
import { api } from './api';
import { Dispatch, SetStateAction } from 'react';
import { AxiosResponse } from 'axios';
import { EMAIL_USUARIO_SALVO, TOKEN_ACESSO, TOKEN_ATUALIZACAO, USUARIO } from '@/utils/Const';


export const isClient = (): boolean => {
    return typeof window !== 'undefined';
};

export const authService = {
    logout() {
        if (isClient()) {
            localStorage.removeItem(TOKEN_ACESSO);
            localStorage.removeItem(TOKEN_ATUALIZACAO);
            window.location.href = '/auth/login';
        }
    },

    isAutenticado(): boolean {
        if (!isClient()) return false;
        return !!this.getToken();
    },

    getToken(): string | null {
        if (!isClient()) return null;
        return localStorage.getItem(TOKEN_ACESSO);
    },

    async isConexaoValida(): Promise<LoginData | null> {
        try {
            if (!isClient()) return null;

            const token = authService.getToken();

            if (!token) return null;


            const emailUsuarioSalvo = localStorage.getItem(EMAIL_USUARIO_SALVO);

            if (!emailUsuarioSalvo) return null;

            const response = await api.get<UsuarioResponse>(`/auth/usuario/${emailUsuarioSalvo}`);

            const usuario = response.data.usuario;

            return usuario;
        } catch {
            return null;
        }
    },

    async emailExistente(email: string): Promise<EmailValidacaoResponse> {
        try {
            const response = await api.get('/auth/validar-email/', { params: { email: email } });
            const { sucesso, mensagem } = response.data || {};
            return { status: response.status, sucesso, mensagem };
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { sucesso?: boolean; mensagem?: string }; status?: number } };
            const { sucesso, mensagem } = axiosError.response?.data || {};
            return {
                status: axiosError.response?.status || 500,
                sucesso: sucesso || false,
                mensagem: mensagem || 'Erro na validação do email'
            };
        }
    },

    async uploadArquivo(arquivo: File, dados: {
        turma_id: number;
        nome: string;
        descricao: string;
        acesso_previo: boolean;
        rascunho: boolean;
    }): Promise<UploadResponse> {
        try {
            const formData = new FormData();
            formData.append('arquivo', arquivo);
            formData.append('turma_id', dados.turma_id.toString());
            formData.append('nome', dados.nome);
            formData.append('descricao', dados.descricao);
            formData.append('acesso_previo', dados.acesso_previo.toString());
            formData.append('rascunho', dados.rascunho.toString());

            const response = await api.post('/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { sucesso, mensagem, recurso } = response.data || {};
            return { sucesso, mensagem, recurso };
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            return {
                sucesso: false,
                mensagem: axiosError.response?.data?.erro || 'Erro ao fazer upload'
            };
        }
    },

    async buscarTreinamentosAluno(): Promise<TreinamentoAlunoResponse> {
        try {
            const response = await api.get('/aluno/treinamentos/');
            const { sucesso, treinamentos } = response.data || {};
            return { sucesso, treinamentos };
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            return {
                sucesso: false,
                erro: axiosError.response?.data?.erro || 'Erro ao buscar treinamentos'
            };
        }
    },

    async verificarCodigo(email: string, codigo: string): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/verificar-codigo/', {
                email: email,
                codigo: codigo.toUpperCase()
            });

            const { access, refresh, usuario }: AuthResponse = response.data;

            if (!access || !refresh) {
                throw new Error('Resposta inválida do servidor');
            }

            if (isClient()) {
                localStorage.setItem(TOKEN_ACESSO, access);
                localStorage.setItem(TOKEN_ATUALIZACAO, refresh);
                localStorage.setItem(EMAIL_USUARIO_SALVO, usuario.email);
            }

            return { access, refresh, usuario };
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao verificar código';
            throw new Error(errorMessage);
        }
    },

    async enviarCodigoVerificacao(data: LoginData): Promise<CodigoVerificacaoResponse> {
        return api.post<CodigoVerificacaoResponse>('/auth/enviar-codigo/', data)
            .then(e => {
                const { sucesso, expira_em, mensagem } = e.data;
                return { sucesso, expira_em, mensagem };
            })
            .catch(e => {
                const msg = `Houve um erro ao enviar o codigo de verificação: ${e}`;
                console.log(msg);
                return { sucesso: false, mensagem: msg, expira_em: '' };
            });
    },

    async reenviarCodigo(data: LoginData): Promise<CodigoVerificacaoResponse> {
        try {
            const response = await api.post('/auth/reenviar-codigo/', data);
            const { sucesso, expira_em, mensagem } = response.data || {};
            return { sucesso, expira_em, mensagem };
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { mensagem?: string }; status?: number } };
            return {
                sucesso: false,
                mensagem: axiosError.response?.data?.mensagem || 'Erro ao reenviar código',
                expira_em: ''
            };
        }
    },

    async getRecursos(): Promise<SetStateAction<Recurso[]>> {
        try {
            const response = await api.get('/recursos/');

            const recursos: SetStateAction<Recurso[]> = Array.isArray(response.data)
                ? response.data
                : response.data.results;

            return recursos;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao retornar os recursos';
            throw new Error(errorMessage);
        }
    },

    async getTurmas(): Promise<SetStateAction<Turma[]>> {
        try {
            const response = await api.get('/turmas/');

            const turmas: SetStateAction<Turma[]> = Array.isArray(response.data)
                ? response.data
                : response.data.results;

            return turmas;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao retornar as turmas';
            throw new Error(errorMessage);
        }
    },

    async getTreinamentos(): Promise<SetStateAction<Treinamento[]>> {
        try {
            const response = await api.get('/treinamentos/');

            const treinamentos: SetStateAction<Treinamento[]> = Array.isArray(response.data)
                ? response.data
                : response.data.results;

            return treinamentos;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao retornar os treinamentos';
            throw new Error(errorMessage);
        }
    },

    async excluirRecurso(id: number): Promise<boolean> {
        try {
            const response = await api.delete(`/recursos/${id}/`);

            if (response.status === 200) return true;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao excluir um recurso';
            throw new Error(errorMessage);
        }

        return false;
    },

    async baixarRecursoArquivo(recurso: Recurso): Promise<Blob> {
        try {
            const response = await api.get(`/recursos/${recurso.id}/download/`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao baixar um recurso';
            throw new Error(errorMessage);
        }
    },

    async isAdministrador(email: string): Promise<AdmResponse> {
        try {
            const response = await api.get(`/auth/admin/${email}/`);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao baixar um recurso';
            throw new Error(errorMessage);
        }
    },

    async criarTreinamento(nome: string, descricao: string): Promise<Treinamento> {
        try {
            const response = await api.post('/treinamentos/', { nome, descricao });
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao criar treinamento';
            throw new Error(errorMessage);
        }
    },

    async atualizarTreinamento(id: number, dados: Partial<Treinamento>): Promise<Treinamento> {
        try {
            const response = await api.patch(`/treinamentos/${id}/`, dados);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao atualizar treinamento';
            throw new Error(errorMessage);
        }
    },

    async excluirTreinamento(id: number): Promise<boolean> {
        try {
            const response = await api.delete(`/treinamentos/${id}/`);
            return response.status === 200 || response.status === 204;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao excluir treinamento';
            throw new Error(errorMessage);
        }
    },

    async criarTurma(dados: {
        treinamento: number;
        nome: string;
        data_inicio: string;
        data_conclusao: string;
        link_acesso?: string;
    }): Promise<Turma> {
        try {
            const response = await api.post('/turmas/', dados);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao criar turma';
            throw new Error(errorMessage);
        }
    },

    async atualizarTurma(id: number, dados: Partial<Turma>): Promise<Turma> {
        try {
            const response = await api.patch(`/turmas/${id}/`, dados);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao atualizar turma';
            throw new Error(errorMessage);
        }
    },

    async excluirTurma(id: number): Promise<boolean> {
        try {
            const response = await api.delete(`/turmas/${id}/`);
            return response.status === 200 || response.status === 204;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao excluir turma';
            throw new Error(errorMessage);
        }
    },

    async atualizarRecurso(id: number, dados: Partial<Recurso>, arquivo?: File): Promise<Recurso> {
        try {
            const formData = new FormData();
            
            if (arquivo) {
                formData.append('arquivo', arquivo);
            }
            
            if (dados.turma !== undefined) {
                formData.append('turma', dados.turma.toString());
            }
            if (dados.nome) {
                formData.append('nome', dados.nome);
            }
            if (dados.descricao !== undefined) {
                formData.append('descricao', dados.descricao);
            }
            if (dados.acesso_previo !== undefined) {
                formData.append('acesso_previo', dados.acesso_previo.toString());
            }
            if (dados.rascunho !== undefined) {
                formData.append('rascunho', dados.rascunho.toString());
            }

            const response = await api.patch(`/recursos/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { erro?: string }; status?: number } };
            const errorMessage = axiosError.response?.data?.erro || 'Erro ao atualizar recurso';
            throw new Error(errorMessage);
        }
    }
}
