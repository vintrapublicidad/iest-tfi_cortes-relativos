'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Zap, Sparkles, Atom } from 'lucide-react';

const FORMULAS = [
  'E = mc²',
  'ħω = E',
  'λ = h / p',
  'G_μν = 8πT_μν',
  'Δx · Δp ≥ ℏ/2',
  'E² = (pc)² + (mc²)²',
];

export default function HeroLogoEasterEgg() {
  const [isZapped, setIsZapped] = useState(false);
  const [formulaIndex, setFormulaIndex] = useState(0);
  const [particles, setParticles] = useState([]);
  const cooldownRef = useRef(false);

  const triggerShock = () => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setIsZapped(true);
    setFormulaIndex((prev) => (prev + 1) % FORMULAS.length);

    // Generar partículas eléctricas y átomos orbitales detallados
    const newParticles = Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 2 * Math.PI) / 12;
      const distance = 85 + Math.random() * 35;
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        delay: (i * 0.04) % 0.25,
        scale: 0.75 + Math.random() * 0.6,
        isAtom: i % 3 === 0,
      };
    });
    setParticles(newParticles);

    // Vibración táctil háptica en móviles
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([25, 35, 25, 45, 60]);
      } catch {}
    }

    // Duración de la sobrecarga cuántica: 2.2 segundos
    setTimeout(() => {
      setIsZapped(false);
      setParticles([]);
      cooldownRef.current = false;
    }, 2200);
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
      {/* Contenedor circular con el halo y el rayo perimetral */}
      <div
        onClick={triggerShock}
        role="button"
        tabIndex={0}
        aria-label="Tocar a Albert Einstein para sobrecarga electrostática"
        title="⚡ ¡Tocá a Einstein para activar la sobrecarga cuántica!"
        className={`logo-lightning-wrapper ${isZapped ? 'einstein-electrified' : ''}`}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          outline: 'none',
          transition: 'transform 0.15s ease',
        }}
      >
        {/* Aura cuántica adicional de plasma cuando está electrificado */}
        {isZapped && <div className="einstein-plasma-aura" aria-hidden="true" />}

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

        {/* Chispas y partículas atómicas orbitando */}
        {isZapped &&
          particles.map((p) => (
            <div
              key={p.id}
              className="einstein-spark"
              style={{
                transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale})`,
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.isAtom ? (
                <Atom size={18} color="#FFFFFF" />
              ) : (
                <Zap size={16} color="#FFF9C4" fill="#F1C40F" />
              )}
            </div>
          ))}
      </div>

      {/* Bocadillo elegante flotante con la fórmula relativista */}
      {isZapped && (
        <div className="einstein-speech-bubble" aria-live="polite">
          <Sparkles size={14} color="#F1C40F" style={{ marginRight: '0.35rem' }} />
          <strong>{FORMULAS[formulaIndex]}</strong>
          <span className="einstein-bubble-tail" />
        </div>
      )}
    </div>
  );
}
