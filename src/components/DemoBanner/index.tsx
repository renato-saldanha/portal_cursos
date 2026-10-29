const LOGINS_DEMO = [
  'admin@demo.stratasec.example',
  'ana.souza@demo.stratasec.example',
  'bruno.lima@demo.stratasec.example',
  'carla.menezes@demo.stratasec.example',
];

const DemoBanner = () => {
  if (process.env.NEXT_PUBLIC_DEMO !== '1') return null;

  return (
    <div className="bg-orange-mid text-black text-xs sm:text-sm text-center px-3 py-2 break-words">
      <strong>Modo demonstração:</strong> dados fictícios (logins: {LOGINS_DEMO.join(', ')}). O código de verificação aparece na tela.
    </div>
  );
};

export default DemoBanner;
