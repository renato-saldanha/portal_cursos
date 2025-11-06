'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { VideoIcon } from 'lucide-react';
import { MarketingBackground } from '@/components/ui/MarketingBackground';
import { validar_email } from '@/utils/utils';
import { useAutenticacao } from '@/lib/hooks/useApi';
import { CodigoVerificacaoResponse, LoginData } from '@/types';
import { TEMP_EMAIL } from '@/utils/Const';

export default function PaginaLogin() {
  const [verificando, setVerificando] = useState(false);
  const [dadosLogin, setDadosLogin] = useState<LoginData>({ email: '' });
  const [erros, setErros] = useState<Record<string, string>>({ email: '' });
  const router = useRouter();
  const { enviarCodigoverificacao, limparErro, emailExistente, carregandoEstado } = useAutenticacao();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      limparErro();
      setVerificando(true);
      setErros({});
      const novosErros: Record<string, string> = {};

      if (!dadosLogin.email) {
        novosErros.email = 'Email é obrigatório';
      } else if (!validar_email(dadosLogin.email)) {
        novosErros.email = 'Email inválido';
      } else {
        const emailValidacao = await emailExistente(dadosLogin.email)
        
        if (!emailValidacao || !emailValidacao.sucesso) {
          novosErros.email = emailValidacao?.mensagem || 'Email inválido';
        }
      }

      setErros(novosErros);

      if (Object.keys(novosErros).length > 0) {
        setVerificando(false);
        return;
      }

      const resultado: CodigoVerificacaoResponse = await enviarCodigoverificacao(dadosLogin);
      
      if (!resultado.sucesso) {
        setErros({ geral: resultado.mensagem });
        setVerificando(false);
      } else {
        sessionStorage.setItem(TEMP_EMAIL, dadosLogin.email);
        router.push('/auth/codigo');        
      }
    } catch (error) {
      console.error('💥 Erro no handleSubmit:', error);
      setErros({ geral: 'Erro ao processar solicitação. Tente novamente.' });
      setVerificando(false);
    }
  };

  const handleMudanca = (campo: string, valor: string) => {
    setDadosLogin(prev => ({
      ...prev,
      [campo]: valor
    }));

    if (erros[campo] || erros.geral) {
      setErros(prev => ({
        ...prev,
        [campo]: '',
        geral: ''
      }));
    }
  };

  return (
    <div className="login-container bg-gradient-to-br from-orange-50 to-blue-50 px-2 sm:px-4 lg:ml-2">
      {/* Lado Esquerdo - Visual/Ilustrativo */}
      <MarketingBackground />

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-8 mx-2 sm:mx-3 my-4 sm:my-6 rounded-lg border border-white bg-white">
        <div className="w-full max-w-md">
          <div className="flex text-center mb-6 sm:mb-8 justify-center">
            <VideoIcon className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24" />
          </div>

          <div>
            <h1 className="title-md text-gray-500 mb-2">
              Acesse sua conta
            </h1>
            <p className="body-md text-gray-200 mb-8">
              Informe seu email para entrar
            </p>

            <form onSubmit={handleSubmit} className="space-y-6" >
              <Input
                label="EMAIL"
                type="text"
                icon="mail"
                placeholder="Seu email cadastrado"
                value={dadosLogin.email}
                onChange={(e) => handleMudanca('email', e.target.value)}
                error={erros.email}
                required
              />

              {erros.geral && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                  <div className="w-4 h-4 bg-danger rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span className="body-sm text-danger">{erros.geral}</span>
                </div>
              )}

              <Button
                type="submit"
                variant={verificando ? "secondary" : "primary"}
                size="lg"
                icon="arrow-right"
                className="w-full"
                desabilitado={verificando}
                carregando={carregandoEstado}
              >
                Acessar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}