'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { VideoIcon } from "lucide-react";

import { useAutenticacao } from "@/lib/hooks/useApi";

interface ProtecaoRotaProps {
    children: React.ReactNode;
}

export const ProtecaoRota = ({ children }: ProtecaoRotaProps) => {
    const [verificando, setVerificando] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { isAutenticado, isConexaoValida, isAdm } = useAutenticacao();

    const rotasPublicas = ['/auth/login', '/auth/codigo'];
    const isRotaPublica = rotasPublicas.includes(pathname);

    useEffect(() => {
        if (isRotaPublica) {
            setVerificando(false);
            return;
        }

        const verificarAutenticacao = async () => {
            try {
                if (!isAutenticado()) {
                    router.push('/auth/login');
                    return;
                };

                const usuario = await isConexaoValida();

                if (!usuario) {
                    router.push('/auth/login');
                    return;
                };

                const isAdministrador = await isAdm(usuario.email);

                if (!isAdministrador?.sucesso) {
                    router.push('/aluno/dashboard');
                    return;
                }

                router.push('/admin');
            } catch {
                router.push('/auth/login/');
            } finally {
                setVerificando(false);
            }
        };

        verificarAutenticacao();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, isRotaPublica]);

    if (isRotaPublica) {
        return <>{children}</>;
    }

    if (verificando) {
        return (
            <div
                className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
                role="status"
                aria-live="polite"
                aria-label="Verificando autenticação"
            >
                <div className="text-center">
                    <div
                        className="flex items-center justify-center mb-4"
                        aria-hidden="true"
                    >
                        <VideoIcon
                            className="h-16 w-16 text-indigo-600"
                            aria-hidden="true"
                        />
                    </div>
                    <h1
                        className="text-2xl font-bold text-gray-900 mb-2"
                        id="loading-title"
                    >
                        Verificando autenticação...
                    </h1>
                    <div
                        className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"
                        role="progressbar"
                        aria-labelledby="loading-title"
                        aria-valuetext="Carregando"
                        aria-busy="true"
                    ></div>
                </div>
            </div>
        );
    }

    if (!isAutenticado()) {
        return null;
    }
    return <>{children}</>;
}

