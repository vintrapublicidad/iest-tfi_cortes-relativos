# ESPECIFICACIONES FORMALES BAJO NOTACIÓN EARS

En el marco del Desarrollo Guiado por Especificaciones (SDD), este documento formaliza los requerimientos de las tres funcionalidades clave de la plataforma **Cortes Relativos** utilizando la sintaxis estandarizada **EARS (Easy Approach to Requirements Syntax)**.

Los patrones sintácticos utilizados son:
* **Ubiquitous**: *El sistema DEBE [acción/comportamiento].*
* **Event-driven**: *CUANDO [evento gatillador], el sistema DEBE [acción].*
* **State-driven**: *MIENTRAS [estado del sistema], el sistema DEBE [acción].*
* **Unwanted behavior**: *SI [condición no deseada/error], ENTONCES el sistema DEBE [acción mitigadora].*
* **Optional feature**: *DONDE [característica opcional habilitada], el sistema DEBE [acción].*

---

## 📌 Funcionalidad 1: Gestión de Turnos y Disponibilidad con Ventana de Amortiguación

### EARS-F1-01 (Ubiquitous - Días de atención)
El sistema DEBE limitar los días de reserva exclusivamente a los días de atención oficial: de Martes a Sábados inclusive.

### EARS-F1-02 (State-driven - Días no laborables)
MIENTRAS el cliente visualice el selector de fechas y seleccione un Domingo o Lunes, el sistema DEBE deshabilitar la selección de turnos e informar que el establecimiento se encuentra cerrado.

### EARS-F1-03 (Ubiquitous - Rango de horarios)
El sistema DEBE ofrecer bloques de turnos divididos en dos franjas diarias: Turno Mañana (de 09:00 a 13:00 hs, con último turno a las 12:30 hs) y Turno Tarde/Noche (de 15:00 a 23:00 hs, con último turno a las 22:30 hs).

### EARS-F1-04 (Event-driven - Ventana de amortiguación de 15 minutos)
CUANDO un cliente solicita la reserva de un servicio, el sistema DEBE calcular el bloqueo del barbero asignado según la fórmula:  
$$\text{Fin del Bloque} = \text{Hora Inicio} + \text{Duración del Servicio} + 15\text{ minutos}$$  
impidiendo que otros turnos inicien dentro de dicho lapso.

### EARS-F1-05 (Unwanted behavior - Solapamiento horario)
SI un cliente intenta reservar un horario que interfiere con el intervalo de otro turno activo del mismo barbero (incluyendo sus 15 minutos de amortiguación), ENTONCES el sistema DEBE rechazar la petición con un error HTTP 400 y el mensaje *"El horario seleccionado ya no se encuentra disponible. Por favor elegí otro horario."*

### EARS-F1-06 (Unwanted behavior - Anticipación insuficiente)
SI la hora seleccionada para el turno se sitúa a menos de 10 horas de la hora actual del servidor, ENTONCES el sistema DEBE invalidar el slot y exigir un mínimo de 10 horas de anticipación.

---

## 📌 Funcionalidad 2: Notificación y Confirmación Asistida vía WhatsApp

### EARS-F2-01 (Event-driven - Disparo de notificación inicial)
CUANDO un turno es registrado exitosamente en el sistema con estado `pendiente`, el sistema DEBE generar el enlace de confirmación único con el ID asignado (`/confirmar?id=[ID]`).

### EARS-F2-02 (Event-driven - Notificación al barbero asignado)
CUANDO se reserva un turno con un barbero específico, el sistema DEBE componer y registrar un mensaje con destino al WhatsApp personal del profesional con el detalle del servicio y la fecha/hora solicitada.

### EARS-F2-03 (Event-driven - Confirmación del cliente)
CUANDO el cliente accede al enlace de confirmación y pulsa *"Confirmar Asistencia"*, el sistema DEBE cambiar el estado del turno a `confirmado`, registrar la fecha de confirmación y disparar el mensaje de confirmación de agenda.

### EARS-F2-04 (Optional feature - Número institucional de la empresa)
DONDE el administrador configure el número de WhatsApp central de la barbería en el panel de control, el sistema DEBE emplear dicho número como emisor oficial de las notificaciones al cliente y barberos.

---

## 📌 Funcionalidad 3: Panel de Administración, Gestión de Barberos y Métricas Operativas

### EARS-F3-01 (Event-driven - Carga de métricas en tiempo real)
CUANDO un administrador autenticado accede a la sección de reportes de `/admin`, el sistema DEBE calcular dinámicamente los siguientes indicadores clave (KPIs): Total de turnos históricos, turnos programados para el día actual, turnos confirmados, turnos pendientes, turnos cancelados, solicitudes activas en lista de espera y desglose por servicio.

### EARS-F3-02 (Event-driven - Alta y edición de barberos)
CUANDO el administrador actualice los datos de un profesional en la pestaña de Barberos, el sistema DEBE persistir de manera inmediata el nombre, especialidad, horario de atención y número de WhatsApp con formato internacional.

### EARS-F3-03 (State-driven - Gestión de estados de turno)
MIENTRAS el administrador visualiza la tabla de turnos, el sistema DEBE proveer acciones directas para transicionar el estado del turno entre `pendiente`, `confirmado` o `cancelado`, actualizando los contadores de métricas en la interfaz de forma reactiva.
