import axios from "axios";
import { TOKEN_ACESSO, TOKEN_ATUALIZACAO } from "../utils/Const";

// Mesma origem: o Next encaminha /api para o backend (ver next.config.ts)
const API_BASE_URL = '/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Adicionar Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_ACESSO)
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

// Renovar Token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const originalRequest = error.config;

        // só 401 deve tentar refresh
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem(TOKEN_ATUALIZACAO);
            if (refreshToken) {
                const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
                localStorage.setItem(TOKEN_ACESSO, data.access);
                originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
                return api.request(originalRequest);
            }
        }

        // para 400 do upload, apenas repasse o erro
        return Promise.reject(error);
    }
)
