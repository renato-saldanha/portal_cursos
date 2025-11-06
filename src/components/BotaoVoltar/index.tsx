import Button from "../Button";

interface BotaoVoltarProps {
    onClick: () => void;
}

export default function BotaoVoltar({ onClick }: BotaoVoltarProps) {
    return (
        <div className='pb-5'>
            <Button
                icon='arrow-left'
                onClick={onClick}>
                Voltar
            </Button>
        </div>
    )
}