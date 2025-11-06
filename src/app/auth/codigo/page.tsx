'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { ArrowLeft, VideoIcon } from 'lucide-react';
import { MarketingBackground } from '@/components/ui/MarketingBackground';
import { useAutenticacao } from '@/lib/hooks/useApi';
import { TEMP_EMAIL } from '@/utils/Const';
import { AdmResponse, LoginData } from '@/types';

export default function PaginaCodigo() {
  const [codigo, setCodigo] = useState('');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [estadoReenviando, setEstadoReenviando] = useState(false);
  const [estadoVerificando, setEstadoVerificando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [emailCarregado, setEmailCarregado] = useState(false);

  const router = useRouter();
  const { verificarCodigo, reenviarCodigo, carregandoEstado, erroEstado, limparErro, isAdm } = useAutenticacao();

  useEffect(() => {
    if (emailCarregado) return;

    const emailSalvo = sessionStorage.getItem(TEMP_EMAIL);
    if (emailSalvo) {
      Promise.resolve().then(() => {
        setEmail(emailSalvo);
        setEmailCarregado(true);
      });
    } else {
      router.push('/auth/login');
    }
  }, [emailCarregado, router]);

  useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setTimeout(() => setTempoRestante(tempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [tempoRestante]);

  const handleVoltarLogin = () => {
    sessionStorage.removeItem(TEMP_EMAIL);
    router.push('/auth/login');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    limparErro();
    setEstadoVerificando(true);

    try {
      const resultado = await verificarCodigo(email, codigo);

      if (resultado) {
        sessionStorage.removeItem(TEMP_EMAIL);

        const response = await isAdm(email);

        if (response && response.sucesso) {
          router.push('/admin');
        } else {
          router.push('/aluno/dashboard');
        }
      } else {
        setErro('Código inválido');
        setEstadoVerificando(false);
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao verificar código');
      setEstadoVerificando(false);
    }
  };

  const handleReenviar = async () => {
    setEstadoReenviando(true);
    setErro('');
    limparErro();

    try {
      const loginData: LoginData = { email };
      const resultado = await reenviarCodigo(loginData);

      if (resultado && resultado.sucesso) {
        setTempoRestante(60);
        setErro('');
      } else {
        setErro(resultado?.mensagem || 'Erro ao reenviar código');
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao reenviar código');
    }
    setEstadoReenviando(false);
  };

  const handleMudanca = (valor: string) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 6);
    setCodigo(numeros);
  };

  if (!emailCarregado) {
    return (
      <div className="login-container bg-gradient-to-br from-orange-50 to-blue-50 px-2 sm:px-4">
        <MarketingBackground />
        <div className="w-full lg:w-2/5 items-center justify-center p-4 sm:p-6 lg:p-8 mx-2 sm:mx-3 my-4 sm:my-6 rounded-lg border border-white bg-white flex">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-base mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm sm:text-base">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container bg-gradient-to-br from-orange-50 to-blue-50 px-2 sm:px-4">
      <MarketingBackground />

      <div className="w-full lg:w-2/5 items-center justify-center p-4 sm:p-6 lg:p-8 mx-2 sm:mx-3 my-4 sm:my-6 rounded-lg border border-white bg-white flex">
        <div className="w-full max-w-md">
          <div className="flex text-center mb-6 sm:mb-8 justify-center">
            <VideoIcon className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24" />
          </div>
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="title-md text-gray-500 mb-2 text-lg sm:text-xl lg:text-2xl">
              Verificação em 2 Etapas
            </h1>
            <p className="body-md text-gray-200 text-sm sm:text-base">
              Digite o código enviado para<br className="hidden sm:block" />
              <strong className="text-orange-base break-all">{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label-md text-orange-base mb-2 block">
                CÓDIGO DE VERIFICAÇÃO
              </label>
              <Input
                type="text"
                value={codigo}
                onChange={(e) => handleMudanca(e.target.value)}
                placeholder="Digite o código de 6 dígitos"
                className="input-base text-center text-lg font-mono tracking-widest"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            {(erro || erroEstado) && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <div className="w-4 h-4 bg-danger rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <span className="body-sm text-danger">{erro || erroEstado}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon="arrow-right"
              className="w-full"
              carregando={estadoVerificando}
              desabilitado={codigo.length !== 6}
            >
              {estadoVerificando ? 'Verificando...' : 'Verificar Código'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="body-sm text-gray-300 mb-3">
              Não recebeu o código?
            </p>
            <Button
              variant="secondary"
              size="md"
              icon="refresh"
              onClick={handleReenviar}
              carregando={estadoReenviando}
              desabilitado={tempoRestante > 0}
              className="w-full"
            >
              {tempoRestante > 0
                ? `Reenviar em ${tempoRestante}s`
                : estadoReenviando
                  ? 'Reenviando...'
                  : 'Reenviar Código'
              }
            </Button>
          </div>

          <div className="mt-6 text-start">
            <Button
              onClick={handleVoltarLogin}
              className="flex items-center gap-2 text-gray-400 hover:text-orange-base transition-colors px-0 py-0 bg-transparent hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="body-sm">Voltar ao login</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
