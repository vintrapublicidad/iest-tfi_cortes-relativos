-- ==========================================================
-- Datos de prueba para Cortes Relativos
-- IMPORTANTE: Los precios son provisorios ($0) y los nombres
-- de peluqueros y clientes son datos de demostración según AGENTS.md.
-- ==========================================================

-- 1. Inserción de Servicios Oficiales Provisorios
INSERT INTO servicios (id, nombre, precio, duracion_minutos, categoria) VALUES
    (1, 'Corte de caballero', 0.00, 30, 'Corte'),
    (2, 'Corte de dama', 0.00, 45, 'Corte'),
    (3, 'Corte de niño', 0.00, 30, 'Corte'),
    (4, 'Color completo', 0.00, 120, 'Color'),
    (5, 'Brushing / peinado', 0.00, 45, 'Peinado'),
    (6, 'Corte y barba', 0.00, 60, 'Barba')
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    precio = EXCLUDED.precio,
    duracion_minutos = EXCLUDED.duracion_minutos,
    categoria = EXCLUDED.categoria;

SELECT setval('servicios_id_seq', (SELECT MAX(id) FROM servicios));

-- 2. Inserción de Peluqueros de Demostración
INSERT INTO peluqueros (id, nombre, especialidad, horario_inicio, horario_fin, dias_trabajo) VALUES
    (1, 'Peluquero de ejemplo 1', 'Cortes clásicos y modernos', '09:00:00', '20:00:00', 'Lunes a Sábado'),
    (2, 'Peluquero de ejemplo 2', 'Color y peinados', '09:00:00', '20:00:00', 'Lunes a Sábado')
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    especialidad = EXCLUDED.especialidad,
    horario_inicio = EXCLUDED.horario_inicio,
    horario_fin = EXCLUDED.horario_fin,
    dias_trabajo = EXCLUDED.dias_trabajo;

SELECT setval('peluqueros_id_seq', (SELECT MAX(id) FROM peluqueros));

-- 3. Inserción de Clientes de Ejemplo
INSERT INTO clientes (id, nombre, telefono, email) VALUES
    (1, 'Ana Pérez', '+5493837420000', 'ejemplo@correo.com'),
    (2, 'Carlos Gómez (Ejemplo)', '+5493837420001', 'carlos.ejemplo@correo.com')
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    telefono = EXCLUDED.telefono,
    email = EXCLUDED.email;

SELECT setval('clientes_id_seq', (SELECT MAX(id) FROM clientes));

-- 4. Inserción de Turnos de Ejemplo
-- Se respetan más de 10 horas de anticipación a partir de la fecha actual
INSERT INTO turnos (id, cliente_id, servicio_id, peluquero_id, fecha_hora, estado, confirmado, recordatorio_enviado) VALUES
    (1, 1, 2, 1, CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '4 hours', 'pendiente', false, false),
    (2, 2, 1, 2, CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '6 hours', 'confirmado', true, true)
ON CONFLICT (id) DO UPDATE SET
    cliente_id = EXCLUDED.cliente_id,
    servicio_id = EXCLUDED.servicio_id,
    peluquero_id = EXCLUDED.peluquero_id,
    fecha_hora = EXCLUDED.fecha_hora,
    estado = EXCLUDED.estado,
    confirmado = EXCLUDED.confirmado,
    recordatorio_enviado = EXCLUDED.recordatorio_enviado;

SELECT setval('turnos_id_seq', (SELECT MAX(id) FROM turnos));

-- 5. Inserción de Registro en Lista de Espera de Ejemplo
INSERT INTO lista_espera (id, cliente_id, servicio_id, fecha_solicitud, estado) VALUES
    (1, 2, 4, CURRENT_TIMESTAMP, 'activa')
ON CONFLICT (id) DO UPDATE SET
    cliente_id = EXCLUDED.cliente_id,
    servicio_id = EXCLUDED.servicio_id,
    fecha_solicitud = EXCLUDED.fecha_solicitud,
    estado = EXCLUDED.estado;

SELECT setval('lista_espera_id_seq', (SELECT MAX(id) FROM lista_espera));
