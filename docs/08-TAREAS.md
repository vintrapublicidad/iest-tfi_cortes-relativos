# Plan de Tareas del Proyecto (08-TAREAS.md)

## Etapa 1: Preparación y Arnés
- [x] Definir la versión final del logo.
- [x] Crear los recursos de marca en la carpeta `marca/`.
- [x] Crear la estructura de carpetas y documentación base (`docs/01` al `10`).
- [x] Configurar el proyecto Next.js 16 con App Router.
- [x] Configurar el repositorio Git en GitHub (`iest-tfi_cortes-relativos`).
- [x] Configurar la base de datos PostgreSQL y modelo relacional.
- [x] Redactar la Constitución del Proyecto (`CONSTITUCION.md`).
- [x] Configurar la memoria del proyecto (`memory.md`) y arnés de instrucciones (`AGENTS.md`).
- [x] Elaborar la matriz de herramientas de IA (Anexo I en `docs/ANEXO-I-MATRIZ-IA.md`).

## Etapa 2: Modelo de Datos y Especificaciones
- [x] Crear la tabla de clientes con validación telefónica internacional.
- [x] Crear la tabla de servicios y duraciones.
- [x] Crear la tabla de peluqueros con soporte de WhatsApp.
- [x] Crear la tabla de turnos con estados y confirmación.
- [x] Crear la tabla de lista de espera activa.
- [x] Definir las relaciones entre tablas (FKs) y scripts de inicialización (`scripts/schema.sql`).
- [x] Redactar especificaciones formales bajo notación EARS (`docs/02-ESPECIFICACIONES-EARS.md`).
- [x] Crear datos de prueba y fallback en memoria para desarrollo sin BD.

## Etapa 3: Interfaz de Usuario y Experiencia Móvil
- [x] Maquetar la página de inicio (`app/page.js`) con enfoque Mobile-First.
- [x] Incorporar el logo y la paleta de colores oficial (Azul Pizarra y Amarillo Einstein).
- [x] Implementar microinteracciones táctiles y botón kinético (Bexa Design Skill).
- [x] Crear las tarjetas interactivas de servicios (`components/TarjetaServicio.js`).
- [x] Crear el selector de peluquero con sincronización de estado (`components/SelectorPeluquero.js`).
- [x] Crear el calendario de disponibilidad con scroll horizontal (`components/Calendario.js`).
- [x] Crear el formulario de reserva con validaciones de campos (`components/FormularioReserva.js`).
- [x] Crear la pantalla de confirmación por cliente (`app/confirmar/page.js`).
- [x] Crear el componente de lista de espera rápida (`components/ListaEspera.js`).
- [x] Implementar animación de rayo perimetral en el logo (`.logo-lightning-wrapper`).

## Etapa 4: Lógica de Turnos y Reglas de Negocio
- [x] Implementar la consulta dinámica de disponibilidad por día y barbero.
- [x] Validar la anticipación mínima estricta de 10 horas (`lib/validaciones.js`).
- [x] Configurar horarios de atención: Martes a Sábados (09 a 13 y 15 a 23 hs).
- [x] Implementar ventana de amortiguación obligatoria de 15 minutos entre turnos consecutivos.
- [x] Evitar reservas duplicadas y solapamientos en cliente y servidor.
- [x] Crear y actualizar los estados de turno (`pendiente`, `confirmado`, `cancelado`).
- [x] Implementar cálculo de métricas operativas (KPIs) para la administración.

## Etapa 5: WhatsApp y Comunicaciones
- [x] Crear módulo de mensajería y enlace WhatsApp (`lib/whatsapp.js`).
- [x] Implementar endpoint `/api/company` para configurar WhatsApp institucional del negocio.
- [x] Implementar endpoint `/api/barbers` para gestionar números de WhatsApp de cada barbero.
- [x] Disparar notificación automática al barbero al generarse una nueva cita.
- [x] Disparar mensaje con enlace directo de confirmación hacia el cliente.
- [x] Notificar confirmación de asistencia en tiempo real al cambiar el estado del turno.

## Etapa 6: Calidad, Accesibilidad y Testing
- [x] Validar los datos exhaustivamente en el servidor (`lib/validaciones.js`).
- [x] Crear suite de pruebas automatizadas con Node.js Test Runner (`test/turnos.test.js`).
- [x] Verificar respeto estricto a accesibilidad (`prefers-reduced-motion`).
- [x] Revisar la seguridad de endpoints y protección contra inyección de SQL.
- [x] Registrar la bitácora de prompts y los 3 errores de IA corregidos (`docs/PROMPTS.md`).

## Etapa 7: Publicación y Despliegue
- [x] Configurar títulos y metadatos SEO en español (`docs/09-SEO.md`).
- [x] Compilar versión de producción sin errores (`next build` Turbopack).
- [x] Sincronizar repositorio remoto con GitHub (`git push origin main`).
- [ ] Vincular repositorio con plataforma Vercel para URL pública.
- [ ] Ejecutar auditoría Lighthouse para verificar puntaje ≥ 80 en las cuatro categorías.
