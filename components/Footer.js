'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bot, Sparkles, Scissors } from 'lucide-react';

export default function Footer() {
  const router = useRouter();
  const [rotation, setRotation] = useState(0); // Grados rotados
  const [isDragging, setIsDragging] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [energyProgress, setEnergyProgress] = useState(0); // 0 a 100%

  const logoRef = useRef(null);
  const lastAngleRef = useRef(null);
  const cumulativeAngleRef = useRef(0);
  const unlockedRef = useRef(false);

  // Calcula el ángulo (en grados) entre el centro del logo y la posición del dedo/mouse
  const getAngle = useCallback((clientX, clientY) => {
    if (!logoRef.current) return 0;
    const rect = logoRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radians = Math.atan2(clientY - centerY, clientX - centerX);
    let degrees = (radians * 180) / Math.PI;
    return degrees;
  }, []);

  const handlePointerDown = (e) => {
    if (unlockedRef.current) return;
    setIsDragging(true);
    const angle = getAngle(e.clientX, e.clientY);
    lastAngleRef.current = angle;
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || unlockedRef.current) return;

    const currentAngle = getAngle(e.clientX, e.clientY);
    if (lastAngleRef.current !== null) {
      let delta = currentAngle - lastAngleRef.current;

      // Normalizar cruce de -180 / 180
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      // Solo acumulamos giros en sentido horario (delta > 0)
      if (delta > 0) {
        cumulativeAngleRef.current += delta;
      } else {
        // Si gira al revés, reduce ligeramente
        cumulativeAngleRef.current = Math.max(0, cumulativeAngleRef.current + delta * 0.5);
      }

      const totalAngle = cumulativeAngleRef.current;
      setRotation(totalAngle);

      const progress = Math.min(100, Math.round((totalAngle / 360) * 100));
      setEnergyProgress(progress);

      // ¡Al completar los 360 grados (giro completo relativo)!
      if (totalAngle >= 360 && !unlockedRef.current) {
        unlockedRef.current = true;
        setIsUnlocked(true);
        setIsDragging(false);

        // Feedback táctil con vibration API si está disponible en móvil
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([40, 60, 100]);
          } catch {}
        }

        setTimeout(() => {
          router.push('/admin');
        }, 900);
      }
    }
    lastAngleRef.current = currentAngle;
  }, [isDragging, getAngle, router]);

  const handlePointerUp = useCallback(() => {
    if (unlockedRef.current) return;
    setIsDragging(false);
    lastAngleRef.current = null;
    // Si no completó el giro relativo, la energía vuelve a 0 suavemente
    cumulativeAngleRef.current = 0;
    setRotation(0);
    setEnergyProgress(0);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <footer
      style={{
        marginTop: 'auto',
        backgroundColor: 'var(--color-principal)',
        color: '#f8fafc',
        padding: '3rem 1.25rem 2.2rem',
        borderTop: '2px solid rgba(241, 196, 15, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.25rem',
        }}
      >
        {/* ── Logo Interactivo con Giro Relativo (Easter Egg de Einstein) ── */}
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: isUnlocked ? 'default' : isDragging ? 'grabbing' : 'grab',
            touchAction: 'none', // Impide scroll accidental mientras se hace el giro
          }}
        >
          <div
            ref={logoRef}
            onPointerDown={handlePointerDown}
            role="button"
            tabIndex={0}
            aria-label="Giro Relativo de Cortes Relativos"
            style={{
              position: 'relative',
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              marginBottom: '0.6rem',
              // Anillo de energía cuántica según rotación
              background: energyProgress > 0
                ? `conic-gradient(#F1C40F ${energyProgress * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`
                : 'rgba(255, 255, 255, 0.08)',
              border: isUnlocked
                ? '2px solid #FFFFFF'
                : '1px solid rgba(241, 196, 15, 0.4)',
              boxShadow: isUnlocked
                ? '0 0 30px #F1C40F, 0 0 60px rgba(241, 196, 15, 0.8)'
                : energyProgress > 0
                ? `0 0 ${12 + energyProgress * 0.2}px rgba(241, 196, 15, ${0.3 + energyProgress * 0.005})`
                : '0 4px 14px rgba(0, 0, 0, 0.25)',
              transform: isUnlocked
                ? 'scale(1.15) rotate(720deg)'
                : isDragging
                ? 'scale(1.06)'
                : 'scale(1)',
              transition: isUnlocked
                ? 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease'
                : isDragging
                ? 'none'
                : 'transform 0.35s ease, box-shadow 0.35s ease, background 0.35s ease',
            }}
          >
            {/* Núcleo interno del logo que rota físicamente */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: 'var(--color-principal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.4s ease-out',
                willChange: 'transform',
                overflow: 'hidden',
              }}
            >
              <Image
                src="/img/logo.svg"
                alt="Logo de Cortes Relativos"
                width={70}
                height={70}
                style={{
                  width: '60px',
                  height: 'auto',
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          <span
            style={{
              fontFamily: 'var(--fuente-titulos)',
              fontSize: '1.5rem',
              letterSpacing: '1.5px',
              color: '#ffffff',
              lineHeight: 1.1,
            }}
          >
            CORTES RELATIVOS
          </span>
          <span
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-acento)',
              fontStyle: 'italic',
              marginTop: '0.2rem',
              letterSpacing: '0.5px',
            }}
          >
            &quot;Tu estilo, relativamente perfecto.&quot;
          </span>
        </div>

        {/* ── Indicador Cuántico de Energía Relativa ── */}
        {(energyProgress > 0 || isUnlocked) && (
          <div
            style={{
              backgroundColor: 'rgba(44, 62, 80, 0.9)',
              border: '1px solid var(--color-acento)',
              borderRadius: '9999px',
              padding: '0.35rem 0.95rem',
              fontSize: '0.75rem',
              color: 'var(--color-acento)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 15px rgba(241, 196, 15, 0.25)',
              animation: isUnlocked ? 'none' : 'pulse 1.2s infinite',
            }}
          >
            <Sparkles size={13} color="var(--color-acento)" />
            <span>
              {isUnlocked
                ? '⚡ ¡Relatividad sincronizada! Accediendo al panel...'
                : `Giro Relativo: ${energyProgress}% (gira 360° en sentido horario)`}
            </span>
          </div>
        )}

        {/* ── Separador con detalle de tijera ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '320px',
            gap: '0.75rem',
            opacity: 0.5,
          }}
        >
          <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(241, 196, 15, 0.5)' }} />
          <Scissors size={14} color="var(--color-acento)" />
          <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(241, 196, 15, 0.5)' }} />
        </div>

        {/* ── Ubicación e Identidad local (Sin horarios) ── */}
        <div style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
          <span>Tinogasta, Catamarca • Barbería & Peluquería</span>
        </div>

        {/* ── Leyenda de Transparencia de IA y Referencia de Precios ── */}
        <div
          style={{
            fontSize: '0.74rem',
            color: '#94a3b8',
            maxWidth: '540px',
            lineHeight: 1.6,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1rem',
            marginTop: '0.25rem',
            width: '100%',
          }}
        >
          <p style={{ margin: 0 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                verticalAlign: 'middle',
              }}
            >
              <Bot size={13} /> Desarrollado y optimizado con asistencia de Inteligencia Artificial supervisada.
            </span>
          </p>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.7rem', color: '#64748b' }}>
            * Los precios indicados son provisorios ($0) según documentación oficial.
          </p>
        </div>
      </div>
    </footer>
  );
}
