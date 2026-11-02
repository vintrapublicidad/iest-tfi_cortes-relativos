'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Zap, Sparkles } from 'lucide-react';

const FORMULAS = ['E = mc²', 'ħω', 'λ = h/p', 'G_μν = 8πT_μν', 'Δx·Δp ≥ ℏ/2', 'E² = (pc)² + (mc²)²'];

export default function HeroLogoEasterEgg() {
  const [isZapped, setIsZapped] = useState(false);
  const [formulaIndex, setFormulaIndex] = useState(0);
  const [sparks, setSparks] = useState([]);
  const cooldownRef = useRef(false);

  const triggerShock = () => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setIsZapped(true);
    setFormulaIndex((prev) => (prev + 1) % FORMULAS.length);

    // Generar chispas eléctricas aleatorias alrededor de la cabeza
    const newSparks = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.cos((i * Math.PI) / 4) * (70 + Math.random() * 25),
      y: Math.sin((i * Math.PI) / 4) * (70 + Math.random() * 25),
      delay: Math.random() * 0.2,
      scale: 0.8 + Math.random() * 0.6,
    }));
    setSparks(newSparks);

    // Feedback háptico en móviles
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([20, 30, 20, 40]);
      } catch {}
    }

    // Duración de la animación electrostática: 2.4s
    setTimeout(() => {
      setIsZapped(false);
      setSparks([]);
      cooldownRef.current = false;
    }, 2400);
  };

  return (
    <div
      className="hero-einstein-easteregg"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem',
      }}
    >
      {/* Contenedor principal del logo con el rayo orbital existente */}
      <div
        onClick={triggerShock}
        role="button"
        tabIndex={0}
        aria-label="Tocar a Albert Einstein para descarga electrostática"
        title="⚡ ¡Tocá a Einstein para una descarga relativa!"
        className={`logo-lightning-wrapper ${isZapped ? 'einstein-electrified' : ''}`}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          outline: 'none',
          transition: 'transform 0.15s ease',
        }}
      >
        <Image
          src="/img/logo.svg"
          alt="Logo de Cortes Relativos con ilustración inspirada en Einstein y elementos de peluquería"
          width={200}
          height={200}
          priority
          style={{
            width: '160px',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none',
          }}
          className={isZapped ? 'einstein-shock-img' : ''}
        />

        {/* Lengua clásica traviesa de Einstein que sale durante el shock */}
        {isZapped && (
          <div className="einstein-tongue" aria-hidden="true">
            <div className="einstein-tongue-shape" />
          </div>
        )}

        {/* Chispas de estática orbitando */}
        {isZapped &&
          sparks.map((spark) => (
            <div
              key={spark.id}
              className="einstein-spark"
              style={{
                transform: `translate(${spark.x}px, ${spark.y}px) scale(${spark.scale})`,
                animationDelay: `${spark.delay}s`,
              }}
            >
              <Zap size={16} color="#FFF9C4" fill="#F1C40F" />
            </div>
          ))}
      </div>

      {/* Bocadillo / Nube con la fórmula de Einstein */}
      {isZapped && (
        <div className="einstein-speech-bubble" aria-live="polite">
          <Sparkles size={13} color="#F1C40F" style={{ marginRight: '0.25rem' }} />
          <strong>{FORMULAS[formulaIndex]}</strong>
          <span className="einstein-bubble-tail" />
        </div>
      )}
    </div>
  );
}
