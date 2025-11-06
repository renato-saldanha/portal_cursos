'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/auth';
// import DashboardTab from './DashboardTab';
// import ProductsTab from './ProdutosTab';
// import PageHeader from './PageHeader';

export default function DashboardLayout() {
    const [abaAtiva] = useState<'dashboard' | 'produtos'>('dashboard');
    const { logout } = authService;
    const router = useRouter();



    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 to-blue-50">
            {/* <PageHeader /> */}

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* {abaAtiva === 'dashboard' && <DashboardTab />}
                {abaAtiva === 'produtos' && <ProductsTab />} */}
            </main>
        </div>
    );
}
