import React from 'react';

interface CardProps {
    id: number;
    titulo: string;
    descricao?: string;
    children: React.ReactNode;
}

export default function Card({id, titulo, descricao, children}: CardProps) {
    return (
        <div key={id} className="bg-white rounded-2xl shadow p-6 border border-orange-light">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{titulo}</h2>
                {descricao && <p className="text-gray-600 mb-3">{descricao}</p>}

                {children}
        </div>
    )
}