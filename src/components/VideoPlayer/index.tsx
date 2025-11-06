'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Maximize, RotateCcw } from 'lucide-react';
import Button from '../Button';
import { Recurso } from '@/types';
import { useAutenticacao } from '@/lib/hooks/useApi';
import { obterExtensaoArquivo } from '@/utils/utils';

interface VideoPlayerProps {
  recurso: Recurso;
  className?: string;
}

const VideoPlayer = ({ recurso, className = '' }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isTocando, setIsTocando] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMutado, setIsMutado] = useState(false);
  const [mostrarControles, setMostrarControles] = useState(true);
  const [videoCarregado, setVideoCarregado] = useState('');
  const [carregando, setCarregando] = useState(true);
  const { downloadRecursoArquivo } = useAutenticacao();

  useEffect(() => {
    const carregarVideo = async () => {
      try {
        setCarregando(true);
        const download = await downloadRecursoArquivo(recurso);
        if (download) {
          const url = URL.createObjectURL(download);
          setVideoCarregado(url);
        } 
      } catch (e) {
        console.error('Erro ao carregar o vídeo:', e);        
      } finally {
        setCarregando(false);
      }
    }
    carregarVideo();

    return () => {
      if (videoCarregado) {
        URL.revokeObjectURL(videoCarregado);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoCarregado) return;

    const atualizaTempo = () => setTempoAtual(video.currentTime);
    const atualizarDuracao = () => setDuracao(video.duration);
    const handleTocar = () => setIsTocando(true);
    const handleParar = () => setIsTocando(false);
    const handleFinalizado = () => setIsTocando(false);

    video.addEventListener('timeupdate', atualizaTempo);
    video.addEventListener('loadedmetadata', atualizarDuracao);
    video.addEventListener('play', handleTocar);
    video.addEventListener('pause', handleParar);
    video.addEventListener('ended', handleFinalizado);

    return () => {
      video.removeEventListener('timeupdate', atualizaTempo);
      video.removeEventListener('loadedmetadata', atualizarDuracao);
      video.removeEventListener('play', handleTocar);
      video.removeEventListener('pause', handleParar);
      video.removeEventListener('ended', handleFinalizado);
    };
  }, [videoCarregado]);

  const handlePlayStop = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isTocando) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleProcurar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const novoTime = parseFloat(e.target.value);
    video.currentTime = novoTime;
    setTempoAtual(novoTime);
  };

  const handleAlterarVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const novoVolume = parseFloat(e.target.value);
    video.volume = novoVolume;
    setVolume(novoVolume);
    setIsMutado(novoVolume === 0);
  };

  const mutarSom = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMutado) {
      video.volume = volume;
      setIsMutado(false);
    } else {
      video.volume = 0;
      setIsMutado(true);
    }
  };

  const tornarTelaCheia = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const resetar = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setTempoAtual(0);
  };

  const formatarTempo = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    document.querySelector("a")?.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    if (recurso.arquivo) {
      const response = await downloadRecursoArquivo(recurso);

      const blob = new Blob([response!]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${recurso.nome}.${obterExtensaoArquivo(recurso.arquivo)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseEnter={() => setMostrarControles(true)}
      onMouseLeave={() => setMostrarControles(false)}
    >
      {/* Vídeo */}
      {carregando ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Carregando vídeo...</p>
          </div>
        </div>
      ) : videoCarregado ? (
        <video
          ref={videoRef}
          src={videoCarregado}
          className="w-full h-full"
          preload="metadata"
          onClick={handlePlayStop}
        />
      ) : null}

      {/* Overlay de controles */}
      {mostrarControles && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end">
          {/* Controles principais */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-mono min-w-[40px]">
                {formatarTempo(tempoAtual)}
              </span>
              <input
                type="range"
                min="0"
                max={duracao || 0}
                value={tempoAtual}
                onChange={handleProcurar}
                className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #F24D0D 0%, #F24D0D ${(tempoAtual / duracao) * 100}%, #4B5563 ${(tempoAtual / duracao) * 100}%, #4B5563 100%)`
                }}
              />
              <span className="text-white text-sm font-mono min-w-[40px]">
                {formatarTempo(duracao)}
              </span>
            </div>

            {/* Botões de controle */}
            <div className="flex flex-col items-center justify-between gap-2 sm:gap-4 sm:flex-row  sm:items-end">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <Button
                  onClick={handlePlayStop}
                  className="p-2 bg-orange-base hover:bg-orange-600 text-white rounded-full"
                >
                  {isTocando ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>

                {/* Restart */}
                <Button
                  onClick={resetar}
                  className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={mutarSom}
                    className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full"
                  >
                    {isMutado ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMutado ? 0 : volume}
                    onChange={handleAlterarVolume}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Download */}
                {recurso.arquivo && (
                  <Button
                    onClick={handleDownload}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
                  >
                    {"Download"}
                    <Download className="w-4 h-4" />
                  </Button>
                )}

                {/* Fullscreen */}
                <Button
                  onClick={tornarTelaCheia}
                  className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Título do vídeo */}
      <div className="absolute top-4 left-4 right-4">
        <h3 className="text-white font-semibold text-lg drop-shadow-lg">
          {recurso.nome}
        </h3>
      </div>

      {/* Estilos para o slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #F24D0D;
          cursor: pointer;
          border: 2px solid white;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #F24D0D;
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
