interface HeaderProps {
    titulo: string;
    descricao: string;
    className?: string;
}

export default function Header({ titulo, descricao, className = '' }: HeaderProps) {
    return (
        <div className={`mb-6 sm:mb-8 w-full ${className}`}>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 text-orange-light text-center">
                {titulo}
            </h1>
            <p className="text-white font-bold text-center text-base sm:text-lg lg:text-2xl border-none shadow-none">
                {descricao}
            </p>
        </div>
    )
}