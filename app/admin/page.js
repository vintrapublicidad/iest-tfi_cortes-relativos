'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ESTADO_COLORS = {
  confirmado: { bg: '#d4edda', text: '#155724', border: '#c3e6cb', label: 'Confirmado' },
  pendiente: { bg: '#fff3cd', text: '#856404', border: '#ffeeba', label: 'Pendiente' },
  cancelado: { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb', label: 'Cancelado' },
  liberado: { bg: '#e2e3e5', text: '#383d41', border: '#d6d8db', label: 'Liberado' },
};

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('turnos');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [statusMsg, setStatusMsg] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [barbers, setBarbers] = useState([]);

  const [companyWhatsApp, setCompanyWhatsApp] = useState('');
  const [newBarber, setNewBarber] = useState({ nombre: '', especialidad: '', whatsapp: '' });
  const [editBarberId, setEditBarberId] = useState(null);
  const [editBarberData, setEditBarberData] = useState({ nombre: '', especialidad: '', whatsapp: '' });

  // Fetch company WhatsApp number
  async function fetchCompanyNumber(authToken) {
    try {
      const res = await fetch('/api/company', { headers: { Authorization: `Bearer ${authToken}` } });
      const data = await res.json();
      if (res.ok && data.success) {
        setCompanyWhatsApp(data.number);
      }
    } catch { }
  }



  // Handlers for barber CRUD
  async function handleAddBarber() {
    if (!newBarber.nombre || !newBarber.whatsapp) return alert('Nombre y WhatsApp son obligatorios');
    try {
      const res = await fetch('/api/barbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newBarber),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBarbers(prev => [...prev, data.barber]);
        setNewBarber({ nombre: '', especialidad: '', whatsapp: '' });
        setStatusMsg('Barbero agregado');
      } else {
        alert(data.error || 'Error al crear barbero');
      }
    } catch { alert('Error de red'); }
  }

  async function handleEditBarber(id) {
    const barber = barbers.find(b => b.id === id);
    if (barber) {
      setEditBarberId(id);
      setEditBarberData({ nombre: barber.nombre, especialidad: barber.especialidad, whatsapp: barber.whatsapp });
    }
  }

  async function submitEditBarber() {
    try {
      const res = await fetch('/api/barbers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: editBarberId, ...editBarberData }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBarbers(prev => prev.map(b => (b.id === editBarberId ? data.barber : b)));
        setEditBarberId(null);
        setStatusMsg('Barbero actualizado');
      } else {
        alert(data.error || 'Error al actualizar');
      }
    } catch { alert('Error de red'); }
  }

  async function handleDeleteBarber(id) {
    if (!confirm('¿Eliminar este barbero?')) return;
    try {
      const res = await fetch('/api/barbers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBarbers(prev => prev.filter(b => b.id !== id));
        setStatusMsg('Barbero eliminado');
      } else {
        alert(data.error || 'Error al eliminar');
      }
    } catch { alert('Error de red'); }
  }

  async function handleCompanySave() {
    if (!companyWhatsApp) return alert('Número es obligatorio');
    try {
      const res = await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ number: companyWhatsApp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg('Número de empresa actualizado');
      } else {
        alert(data.error || 'Error al guardar');
      }
    } catch { alert('Error de red'); }
  }

  

  // Check saved token on mount
  useEffect(() => {
    const saved = localStorage.getItem('cortes_admin_token');
    if (saved) {
      setToken(saved);
      fetchAdminData(saved);
    }
  }, []);

  async function fetchAdminData(authToken) {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAppointments(data.appointments || []);
        setWaitlist(data.waitlist || []);
        setMetrics(data.metrics || null);
        localStorage.setItem('cortes_admin_token', authToken);
        fetchBarbers(authToken);
        fetchCompanyNumber(authToken);
      } else {
        setIsAuthenticated(false);
        setAuthError(data.error || 'Clave de acceso incorrecta.');
      }
    } catch {
      setIsAuthenticated(false);
      setAuthError('Error de conexión al cargar panel.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setToken(passwordInput.trim());
    fetchAdminData(passwordInput.trim());
  }

  function handleLogout() {
    localStorage.removeItem('cortes_admin_token');
    setIsAuthenticated(false);
    setToken('');
    setPasswordInput('');
  }
  async function fetchBarbers(authToken) {
    try {
      const res = await fetch('/api/barbers', { headers: { Authorization: `Bearer ${authToken}` } });
      const data = await res.json();
      if (res.ok && data.success) {
        setBarbers(data.barbers || []);
      }
    } catch {
      // ignore errors
    }
  }

  async function handleStatusChange(id, nuevoEstado) {
    setUpdatingId(id);
    setStatusMsg('');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'update_status', id, estado: nuevoEstado }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === id ? { ...apt, estado: nuevoEstado, confirmado: nuevoEstado === 'confirmado' } : apt))
        );
        setStatusMsg(`Turno #${id} actualizado a "${nuevoEstado}".`);
        // Actualizar métricas
        const mRes = await fetch('/api/admin', { headers: { Authorization: `Bearer ${token}` } });
        const mData = await mRes.json();
        if (mData.success) setMetrics(mData.metrics);
      } else {
        alert(data.error || 'No se pudo actualizar el estado.');
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setUpdatingId(null);
    }
  }

  // Filtrado de turnos
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'todos' || apt.estado === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      apt.cliente_nombre?.toLowerCase().includes(term) ||
      apt.cliente_telefono?.includes(term) ||
      apt.servicio_nombre?.toLowerCase().includes(term) ||
      String(apt.id).includes(term);
    return matchesStatus && matchesSearch;
  });

  // Pantalla de Login si no está autenticado
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        <div
          className="tarjeta-turno"
          style={{
            maxWidth: '380px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(44, 62, 80, 0.12)',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
          }}
        >
          <Image
            src="/img/logo.svg"
            alt="Logo Cortes Relativos"
            width={70}
            height={70}
            style={{ width: '64px', height: 'auto', margin: '0 auto 1rem' }}
          />
          <h1 style={{ fontSize: '1.6rem', color: 'var(--color-principal)', marginBottom: '0.25rem' }}>
            Panel de Peluquería
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#576574', marginBottom: '1.5rem' }}>
            Acceso administrativo para gestión de turnos y reportes.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {authError && (
              <div className="error-msg" style={{ margin: 0, textAlign: 'left' }}>
                ⚠️ {authError}
              </div>
            )}
            <div style={{ textAlign: 'left' }}>
              <label htmlFor="adminKey" className="campo-label">
                Clave de acceso
              </label>
              <input
                id="adminKey"
                type="password"
                className="campo-input"
                placeholder="Ingresá la clave de barbero..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoComplete="current-password"
                required
              />
              <span style={{ fontSize: '0.72rem', color: '#8395a7', display: 'block', marginTop: '0.3rem' }}>
                * Clave por defecto: <code>einstein123</code> (o configurable en .env)
              </span>
            </div>

            <button
              type="submit"
              className="btn-primario"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? 'Verificando...' : 'Entrar al Panel 🔑'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #edf2f7', paddingTop: '1rem' }}>
            <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--color-principal)', fontWeight: '600' }}>
              ← Volver al sitio público
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Administrador
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Topbar ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(8px)',
          borderBottom: '2px solid var(--color-fondo-secundario)',
          padding: '0.75rem 1rem',
          boxShadow: '0 2px 10px rgba(44, 62, 80, 0.05)',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Image
              src="/img/logo.svg"
              alt="Logo"
              width={34}
              height={34}
              style={{ width: '30px', height: 'auto' }}
            />
            <div>
              <span
                style={{
                  fontFamily: 'var(--fuente-titulos)',
                  fontSize: '1.2rem',
                  color: 'var(--color-principal)',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                Cortes Relativos
              </span>
              <span style={{ fontSize: '0.68rem', color: '#e67e22', fontWeight: '700', letterSpacing: '0.5px' }}>
                ADMIN DASHBOARD
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              href="/turnos"
              target="_blank"
              style={{
                fontSize: '0.8rem',
                padding: '0.4rem 0.75rem',
                backgroundColor: 'var(--color-fondo-secundario)',
                borderRadius: 'var(--radio-borde)',
                fontWeight: '600',
              }}
            >
              🌐 Ver sitio
            </Link>
            <button
              onClick={handleLogout}
              style={{
                fontSize: '0.8rem',
                padding: '0.4rem 0.75rem',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                borderRadius: 'var(--radio-borde)',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* ── Tabs Navegación ── */}
      <nav
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.5rem 1rem',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={() => setActiveTab('turnos')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radio-borde)',
              backgroundColor: activeTab === 'turnos' ? 'var(--color-principal)' : 'transparent',
              color: activeTab === 'turnos' ? 'white' : 'var(--color-principal)',
              fontWeight: '700',
              fontSize: '0.88rem',
            }}
          >
            📋 Turnos ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('metricas')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radio-borde)',
              backgroundColor: activeTab === 'metricas' ? 'var(--color-principal)' : 'transparent',
              color: activeTab === 'metricas' ? 'white' : 'var(--color-principal)',
              fontWeight: '700',
              fontSize: '0.88rem',
            }}
          >
            📊 Métricas y Reportes
          </button>
          <button
            onClick={() => setActiveTab('espera')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radio-borde)',
              backgroundColor: activeTab === 'espera' ? 'var(--color-principal)' : 'transparent',
              color: activeTab === 'espera' ? 'white' : 'var(--color-principal)',
              fontWeight: '700',
              fontSize: '0.88rem',
            }}
          >
            ⏳ Lista de Espera ({waitlist.length})
          </button>
          <button
            onClick={() => setActiveTab('barberos')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radio-borde)',
              backgroundColor: activeTab === 'barberos' ? 'var(--color-principal)' : 'transparent',
              color: activeTab === 'barberos' ? 'white' : 'var(--color-principal)',
              fontWeight: '700',
              fontSize: '0.88rem',
            }}
          >
            💈 Barberos ({barbers.length})
          </button>
          <button onClick={() => setActiveTab('config')} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radio-borde)', backgroundColor: activeTab === 'config' ? 'var(--color-principal)' : 'transparent', color: activeTab === 'config' ? 'white' : 'var(--color-principal)', fontWeight: '700', fontSize: '0.88rem' }}>Configuración WhatsApp</button>
        </div>
      </nav>

      {/* ── Contenido Principal ── */}
      <main style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '1.25rem 1rem 3rem' }}>
        {statusMsg && (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radio-borde)',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>✅ {statusMsg}</span>
            <button
              onClick={() => setStatusMsg('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ══ TAB 1: LISTADO Y GESTIÓN DE TURNOS ══ */}
        {activeTab === 'turnos' && (
          <section>
            {/* Controles de Búsqueda y Filtros */}
            <div
              className="tarjeta-turno"
              style={{
                marginBottom: '1.25rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              <div style={{ flex: '1 1 220px' }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar cliente, teléfono o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="campo-input"
                  style={{ minHeight: '44px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ flex: '0 0 auto', display: 'flex', gap: '0.35rem', overflowX: 'auto', width: '100%' }}>
                {['todos', 'pendiente', 'confirmado', 'cancelado'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      border: '1px solid #cbd5e1',
                      backgroundColor: statusFilter === st ? 'var(--color-acento)' : 'white',
                      color: 'var(--color-principal)',
                    }}
                  >
                    {st === 'todos' ? 'Todos' : st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Turnos */}
            {filteredAppointments.length === 0 ? (
              <div
                className="tarjeta-turno"
                style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#576574' }}
              >
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>💈 No se encontraron turnos</p>
                <p style={{ fontSize: '0.85rem' }}>Prueba con otro filtro de búsqueda o estado.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {filteredAppointments.map((apt) => {
                  const estInfo = ESTADO_COLORS[apt.estado] || ESTADO_COLORS.pendiente;
                  const fechaObj = new Date(apt.fecha_hora);
                  const fechaFormatted = isNaN(fechaObj.getTime())
                    ? apt.fecha_hora
                    : fechaObj.toLocaleDateString('es-AR', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                  return (
                    <div
                      key={apt.id}
                      className="tarjeta-turno"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        borderLeft: `5px solid ${estInfo.text}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}
                    >
                      {/* Fila Superior: Cliente + Badge Estado */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '1.05rem', color: 'var(--color-principal)' }}>
                              {apt.cliente_nombre}
                            </strong>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                color: '#64748b',
                                backgroundColor: '#f1f5f9',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '4px',
                              }}
                            >
                              #{apt.id}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>
                            📞 <a href={`https://wa.me/${apt.cliente_telefono?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                              {apt.cliente_telefono}
                            </a>
                            {apt.cliente_email && ` • ✉️ ${apt.cliente_email}`}
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '12px',
                            backgroundColor: estInfo.bg,
                            color: estInfo.text,
                            border: `1px solid ${estInfo.border}`,
                          }}
                        >
                          {estInfo.label}
                        </span>
                      </div>

                      {/* Fila Detalle del Turno */}
                      <div
                        style={{
                          backgroundColor: '#f8fafc',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '6px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                          gap: '0.5rem',
                          fontSize: '0.85rem',
                        }}
                      >
                        <div>
                          <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Servicio</span>
                          <strong>✂️ {apt.servicio_nombre}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Peluquero</span>
                          <strong>💈 {apt.peluquero_nombre || 'Cualquiera'}</strong>
                          {apt.peluquero_whatsapp && (
                            <a
                              href={`https://wa.me/${apt.peluquero_whatsapp.replace(/\\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: '#25D366',
                                color: 'white',
                                padding: '0.4rem 0.75rem',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                borderRadius: 'var(--radio-borde)',
                                marginTop: '0.4rem',
                              }}
                            >
                              📞 WhatsApp
                            </a>
                          )}
                        </div>
                        <div>
                          <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Fecha y Hora</span>
                          <strong style={{ color: 'var(--color-principal)' }}>📅 {fechaFormatted}</strong>
                        </div>
                      </div>

                      {/* Botones de Acción Rápida para el Barbero */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          borderTop: '1px dashed #e2e8f0',
                          paddingTop: '0.6rem',
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', color: '#64748b', marginRight: 'auto' }}>
                          Cambiar estado:
                        </span>

                        {apt.estado !== 'confirmado' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'confirmado')}
                            disabled={updatingId === apt.id}
                            style={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              padding: '0.4rem 0.75rem',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              borderRadius: 'var(--radio-borde)',
                            }}
                          >
                            ✓ Confirmar
                          </button>
                        )}

                        {apt.estado !== 'pendiente' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'pendiente')}
                            disabled={updatingId === apt.id}
                            style={{
                              backgroundColor: '#f59e0b',
                              color: 'white',
                              padding: '0.4rem 0.75rem',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              borderRadius: 'var(--radio-borde)',
                            }}
                          >
                            ⏳ Marcar Pendiente
                          </button>
                        )}

                        {apt.estado !== 'cancelado' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'cancelado')}
                            disabled={updatingId === apt.id}
                            style={{
                              backgroundColor: '#ef4444',
                              color: 'white',
                              padding: '0.4rem 0.75rem',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              borderRadius: 'var(--radio-borde)',
                            }}
                          >
                            ✕ Cancelar
                          </button>
                        )}

                        <a
                          href={`https://wa.me/${apt.cliente_telefono?.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `¡Hola ${apt.cliente_nombre}! Te escribimos de Cortes Relativos Tinogasta sobre tu turno de ${apt.servicio_nombre} para el ${fechaFormatted}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: '#25D366',
                            color: 'white',
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            borderRadius: 'var(--radio-borde)',
                          }}
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}


        {/* Barberos tab */}
        {activeTab === 'barberos' && (
          <section>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-principal)' }}>Barberos</h2>
            {/* Add new barber form */}
            <div className="tarjeta-turno" style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Agregar Barbero</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input placeholder="Nombre" value={newBarber.nombre} onChange={e => setNewBarber({ ...newBarber, nombre: e.target.value })} className="campo-input" />
                <input placeholder="Especialidad" value={newBarber.especialidad} onChange={e => setNewBarber({ ...newBarber, especialidad: e.target.value })} className="campo-input" />
                <input placeholder="WhatsApp" value={newBarber.whatsapp} onChange={e => setNewBarber({ ...newBarber, whatsapp: e.target.value })} className="campo-input" />
                <button onClick={handleAddBarber} className="btn-primario" style={{ alignSelf: 'flex-start' }}>Agregar</button>
              </div>
            </div>
            {/* List existing barbers */}
            {barbers.map(b => (
              <div key={b.id} style={{ marginBottom: '0.75rem' }}>
                {editBarberId === b.id ? (
                  <div className="tarjeta-turno" style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '1rem' }}>
                    <h4>Editar Barbero</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input placeholder="Nombre" value={editBarberData.nombre} onChange={e => setEditBarberData({ ...editBarberData, nombre: e.target.value })} className="campo-input" />
                      <input placeholder="Especialidad" value={editBarberData.especialidad} onChange={e => setEditBarberData({ ...editBarberData, especialidad: e.target.value })} className="campo-input" />
                      <input placeholder="WhatsApp" value={editBarberData.whatsapp} onChange={e => setEditBarberData({ ...editBarberData, whatsapp: e.target.value })} className="campo-input" />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={submitEditBarber} className="btn-primario">Guardar</button>
                        <button onClick={() => setEditBarberId(null)} className="btn-secundario">Cancelar</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="tarjeta-turno" style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '1rem' }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--color-principal)' }}>💈 {b.nombre}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#475569' }}>{b.especialidad}</div>
                    {b.whatsapp && (
                      <a href={`https://wa.me/${b.whatsapp.replace(/\\D/g, '')}`} target="_blank" rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#25D366', color: 'white', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: '600', borderRadius: 'var(--radio-borde)', marginTop: '0.4rem' }}>
                        📞 WhatsApp
                      </a>
                    )}
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditBarber(b.id)} className="btn-primario" style={{ fontSize: '0.75rem' }}>Editar</button>
                      <button onClick={() => handleDeleteBarber(b.id)} className="btn-secundario" style={{ fontSize: '0.75rem' }}>Eliminar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Config tab */}
        {activeTab === 'config' && (
          <section>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-principal)' }}>Configuración de WhatsApp</h2>
            <div className="tarjeta-turno" style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem' }}>Número de WhatsApp de la empresa</label>
              <input placeholder="+549XXXXXXXXX" value={companyWhatsApp} onChange={e => setCompanyWhatsApp(e.target.value)} className="campo-input" />
              <button onClick={handleCompanySave} className="btn-primario" style={{ marginTop: '0.5rem' }}>Guardar</button>
            </div>
          </section>
        )}

        {/* ══ TAB 2: MÉTRICAS Y REPORTES ══ */}
        {activeTab === 'metricas' && metrics && (
          <section>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div className="tarjeta-turno" style={{ textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>TOTAL HISTÓRICO</span>
                <p style={{ fontSize: '2rem', fontFamily: 'var(--fuente-titulos)', color: 'var(--color-principal)', margin: '0.2rem 0' }}>
                  {metrics.totalTurnos}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Turnos registrados</span>
              </div>

              <div className="tarjeta-turno" style={{ textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>CONFIRMADOS</span>
                <p style={{ fontSize: '2rem', fontFamily: 'var(--fuente-titulos)', color: '#16a34a', margin: '0.2rem 0' }}>
                  {metrics.confirmados}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Asistencia ratificada</span>
              </div>

              <div className="tarjeta-turno" style={{ textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: '600' }}>PENDIENTES</span>
                <p style={{ fontSize: '2rem', fontFamily: 'var(--fuente-titulos)', color: '#d97706', margin: '0.2rem 0' }}>
                  {metrics.pendientes}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>A la espera de confirmación</span>
              </div>

              <div className="tarjeta-turno" style={{ textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '600' }}>EN LISTA DE ESPERA</span>
                <p style={{ fontSize: '2rem', fontFamily: 'var(--fuente-titulos)', color: '#3b82f6', margin: '0.2rem 0' }}>
                  {metrics.esperaActiva}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Clientes esperando cupo</span>
              </div>
            </div>

            {/* Servicios Más Solicitados */}
            <div className="tarjeta-turno" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-principal)', marginBottom: '1rem' }}>
                ✂️ Demanda por Servicio
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(metrics.porServicio || {}).map(([nombre, cantidad]) => {
                  const pct = Math.round((cantidad / (metrics.totalTurnos || 1)) * 100);
                  return (
                    <div key={nombre}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                        <strong>{nombre}</strong>
                        <span>{cantidad} turno(s) ({pct}%)</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            backgroundColor: 'var(--color-acento)',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ══ TAB 3: LISTA DE ESPERA ══ */}
        {activeTab === 'espera' && (
          <section>
            <div
              className="aviso"
              style={{ marginBottom: '1.25rem', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
            >
              💡 <strong>Regla de negocio:</strong> Cuando un turno se cancela o se libera por falta de confirmación, se debe contactar al primer cliente en espera para ofrecerle el cupo disponible.
            </div>

            {waitlist.length === 0 ? (
              <div className="tarjeta-turno" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                No hay clientes en lista de espera actualmente.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {waitlist.map((w) => (
                  <div
                    key={w.id}
                    className="tarjeta-turno"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--color-principal)' }}>
                        {w.cliente_nombre}
                      </strong>
                      <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>
                        📞 {w.cliente_telefono} • ✂️ {w.servicio_nombre || 'Servicio general'}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Anotado: {new Date(w.fecha_solicitud).toLocaleString('es-AR')}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/${w.cliente_telefono?.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `¡Hola ${w.cliente_nombre}! Te escribimos de Cortes Relativos Tinogasta. Se ha liberado un turno para ${w.servicio_nombre || 'tu servicio'}. ¿Te gustaría tomarlo?`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        backgroundColor: '#25D366',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radio-borde)',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      💬 Avisar por WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}



