import Link from "next/link";
import Button from "../Button";

interface CardAdminProps {
    href: string;
    titulo: string;
    texto: string;
}

export default function CardAdmin({ href, titulo, texto }: CardAdminProps) {
    return (
        <Link href={href} className="group">
            <div className="bg-gradient-to-br from-orange-semi to-orange-dark rounded-3xl p-6 text-white border border-orange-light transition-all duration-300 group-hover:scale-[1.02]">
                <h2 className="text-2xl font-semibold mb-2">{titulo}</h2>
                <p className="text-white/90 mb-4">{texto}</p>
                <Button variant="secondary" className="group-hover:translate-x-1 transition-transform">
                    Acessar
                </Button>
            </div>
        </Link>
    )
}