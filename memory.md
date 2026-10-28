# MEMORIA DEL PROYECTO: CORTES RELATIVOS (memory.md)

Este documento condensa el contexto acumulado, las decisiones de arquitectura de software, las reglas de negocio críticas y el estado operativo actual del sistema para asegurar la continuidad entre sesiones de desarrollo.

---

## 📌 Datos Clave del Emprendimiento
* **Negocio**: Barbería y Peluquería *Cortes Relativos*.
* **Ubicación**: Tinogasta, Catamarca, Argentina.
* **Identidad de Marca**: Inspiración en Albert Einstein fusionado con barbería tradicional y moderna.
  - Color Principal: Azul Pizarra Profundo (`#2C3E50`)
  - Color de Acento: Amarillo Einstein Relativo (`#F1C40F`)
  - Tipografías: Playfair Display (editorial) y Roboto / Inter (cuerpo).

---

## 🕒 Reglas Operativas y de Negocio

1. **Horarios de Atención**:
   - Días hábiles de atención: **Martes a Sábados** (Domingos y Lunes cerrado).
   - Turno Mañana: `09:00` a `13:00` hs (último turno disponible `12:30` hs).
   - Turno Tarde/Noche: `15:00` a `23:00` hs (último turno disponible `22:30` hs).
2. **Anticipación Mínima**:
   - Los turnos deben reservarse con al menos **10 horas de antelación**.
3. **Ventana de Amortiguación entre Servicios (Buffer)**:
   - Todo servicio incluye una ventana obligatoria de **15 minutos** posterior a su duración estimada para permitir higiene, desinfección de herramientas y absorber eventuales demoras del cliente anterior:
     $$\text{Bloque Reservado} = \text{Hora Inicio} + \text{Duración Servicio} + 15\text{ minutos}$$
   - Dos turnos del mismo barbero no pueden colisionar en este intervalo extendido.
4. **Flujo de Confirmación WhatsApp**:
   - Tras registrar un turno en `/turnos`, el estado inicial es `pendiente`.
   - Se notifica tanto al barbero asignado como al cliente con el enlace de confirmación (`/confirmar?id=...`).
   - El administrador puede registrar y actualizar el WhatsApp institucional de la empresa desde `/admin`.

---

## 🏗️ Pila Tecnológica y Arquitectura

* **Framework**: Next.js 16.4.1 (App Router + Turbopack).
* **Estilos**: Vanilla CSS puro en `app/globals.css` (con sistema de variables de diseño y reglas de microinteracciones Bexa).
* **Almacenamiento**:
  - Primario: PostgreSQL (`pg`) con esquema relacional en `scripts/schema.sql`.
  - Resiliencia / Fallback: Estructura en memoria persistente en `lib/data.js` para operar en entornos locales sin Postgres activo.
* **Comunicaciones**: Módulo `lib/whatsapp.js` para disparo y generación de mensajes de contacto y recordatorios.

---

## 📋 Comandos del Arnés de IA
* `/spec`: Generación y revisión de especificaciones bajo notación EARS.
* `/clarificar`: Solicitud interactiva de resolución de ambigüedades de negocio con el usuario antes de codificar.
* `/verificar`: Ejecución de comprobaciones (validaciones, pruebas automatizadas y compilación sin errores).
