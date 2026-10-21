-- ==========================================================
-- Base de Datos: Cortes Relativos
-- Esquema DDL para PostgreSQL
-- ==========================================================

-- Tabla: Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Servicios
-- Precios provisorios en $0 según documentación hasta contar con valores oficiales
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    duracion_minutos INTEGER NOT NULL,
    categoria VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Peluqueros
CREATE TABLE IF NOT EXISTS peluqueros (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    horario_inicio TIME NOT NULL DEFAULT '09:00:00',
    horario_fin TIME NOT NULL DEFAULT '20:00:00',
    dias_trabajo VARCHAR(100) NOT NULL DEFAULT 'Lunes a Sábado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Turnos
-- Estados permitidos: 'pendiente', 'confirmado', 'cancelado', 'liberado', 'completado'
CREATE TABLE IF NOT EXISTS turnos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    servicio_id INTEGER NOT NULL REFERENCES servicios(id) ON DELETE RESTRICT,
    peluquero_id INTEGER REFERENCES peluqueros(id) ON DELETE SET NULL,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente' 
        CHECK (estado IN ('pendiente', 'confirmado', 'cancelado', 'liberado', 'completado')),
    confirmado BOOLEAN NOT NULL DEFAULT FALSE,
    recordatorio_enviado BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Lista de espera
-- Estados permitidos: 'activa', 'notificada', 'cancelada', 'atendida'
CREATE TABLE IF NOT EXISTS lista_espera (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    servicio_id INTEGER NOT NULL REFERENCES servicios(id) ON DELETE RESTRICT,
    fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(30) NOT NULL DEFAULT 'activa'
        CHECK (estado IN ('activa', 'notificada', 'cancelada', 'atendida')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- Índices para optimización de consultas y reglas de negocio
-- ==========================================================

-- Evitar que un peluquero tenga dos turnos activos en el mismo horario
CREATE UNIQUE INDEX IF NOT EXISTS idx_turnos_peluquero_fecha_hora 
    ON turnos (peluquero_id, fecha_hora) 
    WHERE estado NOT IN ('cancelado', 'liberado');

-- Búsquedas rápidas por fecha y estado de turno
CREATE INDEX IF NOT EXISTS idx_turnos_fecha_hora ON turnos (fecha_hora);
CREATE INDEX IF NOT EXISTS idx_turnos_estado ON turnos (estado);
CREATE INDEX IF NOT EXISTS idx_turnos_cliente_id ON turnos (cliente_id);
CREATE INDEX IF NOT EXISTS idx_lista_espera_estado ON lista_espera (estado);
