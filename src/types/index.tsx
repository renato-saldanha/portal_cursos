export interface Treinamento {
    id: number;
    nome: string;
    descricao: string;
    data_criacao: string;
    data_atualizacao: string;
    turmas: Turma[];
}

export interface Turma {
    id: number;
    treinamento: number
    treinamento_nome: string;
    nome: string;
    data_inicio: string;
    data_conclusao: string;
    link_acesso?: string;
    data_criacao: string;
    data_atualizacao: string;
    status: 'Aguardando' | 'Finalizada' | 'Em andamento';
    recursos: Recurso[];
}

export interface Aluno {
    id: number;
    usuario: number;
    nome: string;
    email: string;
    telefone: string;
    data_criacao: string;
    data_atualizacao: string;
}

export interface Matricula {
    id: number;
    turma: number;
    aluno: number;
    aluno_nome: string;
    turma_nome: string;
    data_matricula: string;
    status: 'ativa' | 'inativa';
}

export interface Recurso {
    id: number;
    turma: number;
    turma_nome: string;
    tipo_recurso: 'video' | 'pdf' | 'zip';
    acesso_previo: boolean;
    rascunho: boolean;
    nome: string;
    descricao: string
    arquivo: string;
    data_criacao: string;
    data_atualizacao: string;
    is_acessivel: boolean;
}

export interface LoginData {
    email: string;
    nome?: string;
}

export interface UsuarioResponse {
    sucesso: boolean;
    mensagem: string;
    usuario: LoginData;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    usuario: LoginData;
}

export interface CodigoVerificacaoResponse {
    sucesso: boolean;
    mensagem: string;
    expira_em: string;
    codigo_demo?: string;
}

export interface EmailValidacaoResponse {
    sucesso: boolean;
    mensagem: string;
    status?: number;
}

export interface TreinamentoAlunoResponse {
    sucesso: boolean;
    treinamentos?: Treinamento[];
    erro?: string
}

export interface UploadResponse {
    sucesso: boolean;
    mensagem: string;
    recurso?: unknown;
}

export interface AdmResponse {
    sucesso: boolean;
    mensagem: string;
    status?: number;
}

export interface TipoArquivoSuportado {
    arquivos : 'video' | 'pdf'| 'zip';
}