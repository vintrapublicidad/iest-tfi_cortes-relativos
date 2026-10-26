'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TarjetaServicio from '@/components/TarjetaServicio.js';
import SelectorPeluquero from '@/components/SelectorPeluquero.js';
import Calendario from '@/components/Calendario.js';
import FormularioReserva from '@/components/FormularioReserva.js';
import ListaEspera from '@/components/ListaEspera.js';

const STEPS = [
  { id: 0, label: 'Servicio', emoji: '✂️' },
  { id: 1, label: 'Peluquero', emoji: '💈' },
  { id: 2, label: 'Fecha', emoji: '📅' },
  { id: 3, label: 'Datos', emoji: '📝' },
];

/** Barra de progreso del flujo de reserva */
function StepperBar({ currentStep }) {
  return (
    <nav
      aria-label="Pasos del proceso de reserva"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 0,
        padding: '0.75rem 1rem 0',
        overflowX: 'auto',
      }}
    >
      {STEPS.map((step, idx) => {
        const isDone = idx < currentStep;
        const isActive = idx === currentStep;
        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
              <div
                className={`step-circle${isDone ? ' done' : isActive ? ' active' : ''}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isDone ? '✓' : step.emoji}
              </div>
              <span
                className={`step-label${isActive ? ' active' : ''}`}
                style={{ fontSize: '0.65rem' }}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`step-connector${isDone ? ' done' : ''}`}
                style={{ marginBottom: '1rem' }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function TurnosPage() {
  const router = useRouter();
  const mainRef = useRef(null);

  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarberId, setSelectedBarberId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Carga inicial de datos
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/turnos');
        const data = await res.json();
        if (data.success) {
          setServices(data.services || []);
          setBarbers(data.barbers || []);
          setAppointments(data.appointments || []);
          if (data.services?.length > 0) {
            setSelectedService(data.services[0]);
          }
        }
      } catch (err) {
        console.error('Error cargando disponibilidad:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Al cambiar de paso, hacer scroll al inicio
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const goToStep = (step) => setCurrentStep(step);

  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((s) => s + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleBookingSubmit = async (formData) => {
    setIsSubmitting(true);
    setBookingError('');
    try {
      const res = await fetch('/api/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'No pudimos registrar tu turno.');
      }
      router.push(`/confirmar?id=${result.appointment.id}`);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBarber = barbers.find((b) => b.id === selectedBarberId) || null;

  // ¿Puede avanzar al siguiente paso?
  const canAdvance = [
    !!selectedService,              // Paso 0 → necesita servicio
    true,                           // Paso 1 → peluquero es opcional
    !!(selectedDate && selectedTime), // Paso 2 → necesita fecha y hora
    true,                           // Paso 3 → el form valida internamente
  ];

  const stepTitle = STEPS[currentStep]?.label;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Navbar ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--color-fondo)',
          borderBottom: '2px solid var(--color-fondo-secundario)',
          boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 1rem',
            maxWidth: '920px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Image
              src="/img/logo.svg"
              alt="Logo Cortes Relativos"
              width={40}
              height={40}
              style={{ width: '36px', height: 'auto' }}
            />
            <span
              style={{
                fontFamily: 'var(--fuente-titulos)',
                fontSize: '1.2rem',
                color: 'var(--color-principal)',
                lineHeight: 1,
              }}
            >
              CORTES RELATIVOS
            </span>
          </Link>
          <Link href="/" className="btn-secundario" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
            ← Volver
          </Link>
        </div>

        {/* Barra de pasos — debajo del navbar */}
        {!isLoading && <StepperBar currentStep={currentStep} />}
      </header>

      {/* ── Contenido principal ── */}
      <main
        ref={mainRef}
        style={{
          flex: 1,
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          padding: '1.25rem 1rem 6rem',
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 1rem',
              gap: '1rem',
              color: '#576574',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                border: '4px solid var(--color-fondo-secundario)',
                borderTopColor: 'var(--color-acento)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p>Cargando disponibilidad...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {/* Título del paso actual */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h1
                style={{
                  fontSize: '1.9rem',
                  color: 'var(--color-principal)',
                  marginBottom: '0.2rem',
                }}
              >
                {currentStep === 0 && '✂️ Elegí tu servicio'}
                {currentStep === 1 && '💈 Elegí un peluquero'}
                {currentStep === 2 && '📅 Elegí fecha y horario'}
                {currentStep === 3 && '📝 Completá tus datos'}
              </h1>
              <p style={{ color: '#576574', fontSize: '0.9rem' }}>
                Paso {currentStep + 1} de {STEPS.length}
              </p>
            </div>

            {/* ── PASO 0: Servicios ── */}
            {currentStep === 0 && (
              <section>
                <div className="grid-servicios">
                  {services.map((service) => (
                    <TarjetaServicio
                      key={service.id}
                      service={service}
                      isSelected={selectedService?.id === service.id}
                      onSelect={(s) => {
                        setSelectedService(s);
                        setSelectedTime('');
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── PASO 1: Peluquero ── */}
            {currentStep === 1 && (
              <section>
                <SelectorPeluquero
                  barbers={barbers}
                  selectedBarberId={selectedBarberId}
                  onSelectBarber={(id) => {
                    setSelectedBarberId(id);
                    setSelectedTime('');
                  }}
                />
              </section>
            )}

            {/* ── PASO 2: Calendario ── */}
            {currentStep === 2 && (
              <section>
                <Calendario
                  selectedDate={selectedDate}
                  onSelectDate={(d) => {
                    setSelectedDate(d);
                    setSelectedTime('');
                  }}
                  selectedTime={selectedTime}
                  onSelectTime={(t) => setSelectedTime(t)}
                  bookedAppointments={appointments}
                  selectedBarberId={selectedBarberId}
                />
              </section>
            )}

            {/* ── PASO 3: Formulario ── */}
            {currentStep === 3 && (
              <section>
                {/* Resumen compacto de selecciones */}
                <div
                  className="aviso"
                  style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}
                >
                  <p><strong>Servicio:</strong> {selectedService?.nombre}</p>
                  <p><strong>Peluquero:</strong> {selectedBarber ? selectedBarber.nombre : 'Primer disponible'}</p>
                  <p>
                    <strong>Fecha y hora:</strong>{' '}
                    {new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString('es-AR', {
                      weekday: 'long', day: 'numeric', month: 'long'
                    })}{' '}
                    a las {selectedTime} hs
                  </p>
                </div>

                <FormularioReserva
                  selectedService={selectedService}
                  selectedBarber={selectedBarber}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSubmit={handleBookingSubmit}
                  isSubmitting={isSubmitting}
                  error={bookingError}
                />
              </section>
            )}

            {/* Lista de espera — solo en paso 2 */}
            {currentStep === 2 && (
              <div style={{ marginTop: '2rem' }}>
                <ListaEspera services={services} />
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Barra de navegación fija al pie ── */}
      {!isLoading && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-fondo)',
            borderTop: '1px solid var(--color-fondo-secundario)',
            padding: '0.75rem 1rem',
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 200,
            boxShadow: '0 -4px 16px rgba(44,62,80,0.08)',
            maxWidth: '680px',
            margin: '0 auto',
            // Centrar la barra fija en pantallas anchas
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
          }}
        >
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="btn-secundario"
              style={{ flex: '0 0 auto' }}
            >
              ← Anterior
            </button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length - 1 && (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={!canAdvance[currentStep]}
              className="btn-primario"
              style={{
                flex: 1,
                maxWidth: '280px',
                opacity: canAdvance[currentStep] ? 1 : 0.45,
                cursor: canAdvance[currentStep] ? 'pointer' : 'not-allowed',
              }}
            >
              {currentStep === 2 && selectedDate && selectedTime
                ? `Continuar con ${selectedTime} hs`
                : 'Siguiente →'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
