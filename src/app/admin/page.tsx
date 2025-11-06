'use client';

import Link from 'next/link';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { useAutenticacao } from '@/lib/hooks/useApi';

export default function AdminHome() {
  const { fazerLogout } = useAutenticacao();

  const handleExit = () => {
    fazerLogout();
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="flex m-auto justify-end mb-4 sm:mb-6">
        <Button
          icon="exit"
          key="exit"
          type="button"
          variant="secondary"
          size="md"
          className="min-w-[80px] sm:w-auto"
          onClick={handleExit}
        >
          Sair
        </Button>
      </div>

      <Header
        titulo='Painel do Administrador'
        descricao='Gerencie treinamentos, turmas e recursos' />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" role="navigation" aria-label="Navegação do painel administrativo">
        <Link
          href="/admin/recursos"
          className="group"
          aria-label="Acessar página de gerenciamento de recursos"
        >
          <div className="bg-gradient-to-br from-orange-semi to-orange-dark rounded-3xl p-4 sm:p-6 text-white border border-orange-light transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Recursos</h2>
            <p className="text-white/90 mb-4 text-sm sm:text-base">Vídeos, PDFs e ZIPs das turmas</p>
            <Button
              variant="secondary"
              className="group-hover:translate-x-1 transition-transform min-h-[44px]"
              aria-hidden="true"
            >
              Acessar
            </Button>
          </div>
        </Link>

        <Link
          href="/admin/treinamentos"
          className="group"
          aria-label="Acessar página de gerenciamento de treinamentos"
        >
          <div className="bg-gradient-to-br from-orange-semi to-orange-dark rounded-3xl p-4 sm:p-6 text-white border border-orange-light transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Treinamentos</h2>
            <p className="text-white/90 mb-4 text-sm sm:text-base">Crie e organize trilhas de estudo</p>
            <Button
              variant="secondary"
              className="group-hover:translate-x-1 transition-transform min-h-[44px]"
              aria-hidden="true"
            >
              Acessar
            </Button>
          </div>
        </Link>

        <Link
          href="/admin/turmas"
          className="group"
          aria-label="Acessar página de gerenciamento de turmas"
        >
          <div className="bg-gradient-to-br from-orange-semi to-orange-dark rounded-3xl p-4 sm:p-6 text-white border border-orange-light transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Turmas</h2>
            <p className="text-white/90 mb-4 text-sm sm:text-base">Gerencie turmas e status</p>
            <Button
              variant="secondary"
              className="group-hover:translate-x-1 transition-transform min-h-[44px]"
              aria-hidden="true"
            >
              Acessar
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}


