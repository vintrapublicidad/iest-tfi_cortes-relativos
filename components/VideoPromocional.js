'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoPromocional() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, no iniciamos reproducción automática
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = motionQuery.matches;

    // IntersectionObserver para carga diferida y reproducción solo en pantalla
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Empieza a cargar el video al acercarse a la pantalla
            setShouldLoad(true);

            // Si entra en pantalla y no prefiere reduced-motion, reproduce
            if (videoRef.current && !prefersReducedMotion) {
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => setIsPlaying(true))
                  .catch(() => {
                    // El navegador puede restringir autoplay sin interacción
                    setIsPlaying(false);
                  });
              }
            }
          } else {
            // Pausa el video si sale del área visible para ahorrar batería/recursos
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      {
        rootMargin: '200px 0px', // Pre-carga 200px antes de entrar al viewport
        threshold: 0.25,
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      observer.disconnect();
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section
      ref={containerRef}
      className="video-promo-section"
      aria-label="Video promocional de Cortes Relativos"
    >
      <div className="video-promo-header">
        <span className="video-promo-tag">Experiencia Cortes Relativos</span>
        <h2 className="video-promo-title">Conocé nuestra barbería en acción</h2>
        <p className="video-promo-desc">
          Técnica clásica, estilo contemporáneo y el ambiente que merecés en Tinogasta.
        </p>
      </div>

      <div className="video-promo-card">
        <div className="video-promo-viewport">
          <video
            ref={videoRef}
            className="video-promo-element"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            preload="none"
            poster="/video/poster.png"
            onClick={togglePlay}
          >
            {shouldLoad && <source src="/video/video.mp4" type="video/mp4" />}
            Tu navegador no soporta la reproducción de video HTML5.
          </video>

          {/* Botón flotante para pausar / reanudar */}
          <button
            type="button"
            className="video-promo-control-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
            title={isPlaying ? 'Pausar video' : 'Reproducir video'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>
    </section>
  );
}
