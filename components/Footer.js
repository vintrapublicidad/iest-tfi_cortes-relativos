'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bot, Lock, Scissors } from 'lucide-react';

export default function Footer() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const clickTimerRef = useRef(null);

  // Mecanismo de acceso secreto al panel de administración:
  // Requiere 5 toques consecutivos rápidos (menos de 1.8 segundos entre toques) en el isotipo del footer
  const handleSecretClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (nextCount >= 5) {
      setShowHint(true);
      setTimeout(() => {
        router.push('/admin');
      }, 400);
      setClickCount(0);
      return;
    }

    if (nextCount >= 3) {
      setShowHint(true);
    }

    // Si pasan 1.8s sin tocar, se reinicia el contador
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
      setShowHint(false);
    }, 1800);
  };

  return (
    <footer
      style={{
        marginTop: 'auto',
        backgroundColor: 'var(--color-principal)',
        color: '#f8fafc',
        padding: '3rem 1.25rem 2rem',
        borderTop: '2px solid rgba(241, 196, 15, 0.4)',
        position: 'relative',
        overflow: 'hidden',
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
        {/* ── Logo y Marca ── */}
        <div
          onClick={handleSecretClick}
          role="button"
          tabIndex={0}
          aria-label="Cortes Relativos"
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            outline: 'none',
            transition: 'transform 0.15s ease',
          }}
          title={showHint ? `Acceso admin (${5 - clickCount} toques restantes)` : 'Cortes Relativos'}
        >
          <div
            style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: showHint ? '1px dashed var(--color-acento)' : '1px solid rgba(241, 196, 15, 0.35)',
              marginBottom: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              transform: clickCount > 0 ? `scale(${1 + clickCount * 0.03})` : 'scale(1)',
              transition: 'transform 0.12s ease',
            }}
          >
            <Image
              src="/img/logo.svg"
              alt="Logo de Cortes Relativos"
              width={72}
              height={72}
              style={{
                width: '64px',
                height: 'auto',
                display: 'block',
              }}
            />
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

        {/* ── Feedback sutil del toque secreto (aparece tras 3 toques) ── */}
        {showHint && (
          <div
            style={{
              backgroundColor: 'rgba(241, 196, 15, 0.15)',
              border: '1px solid var(--color-acento)',
              borderRadius: '9999px',
              padding: '0.35rem 0.9rem',
              fontSize: '0.75rem',
              color: 'var(--color-acento)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              animation: 'pulse 1s infinite alternate',
            }}
          >
            <Lock size={12} />
            <span>Desbloqueando acceso administrativo ({5 - clickCount})...</span>
          </div>
        )}

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
