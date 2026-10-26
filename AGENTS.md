# Proyecto Cortes Relativos: Instrucciones para la IA

Cortes Relativos es un sitio web para gestionar y reservar turnos de una peluquería ubicada en Tinogasta, Catamarca. El cliente puede consultar servicios, peluqueros y disponibilidad, elegir día y horario, reservar y recibir un recordatorio para confirmar su asistencia por WhatsApp.

## Archivos que debe leer antes de escribir código

- docs/IDENTIDAD-MARCA.md — identidad visual y tono de la marca.
- docs/01-CONTEXTO.md — problema, objetivo, público y alcance.
- docs/02-REQUERIMIENTOS.md — requerimientos funcionales y no funcionales.
- docs/03-TECNOLOGIAS.md — tecnologías seleccionadas y justificación.
- docs/04-ARQUITECTURA.md — estructura general del proyecto.
- docs/05-DATOS.md — modelo de datos y ejemplos.
- docs/06-DISENO-UI.md — pantallas y criterios visuales.
- docs/07-CONVENCIONES.md — reglas de código, nombres y commits.
- docs/08-TAREAS.md — tareas pendientes y orden de trabajo.
- docs/09-SEO.md — criterios de posicionamiento y accesibilidad básica.
- docs/10-SEGURIDAD.md — protección de datos y secretos.

## Reglas obligatorias

- Leer la documentación anterior antes de modificar o crear código.
- Respetar los colores y tipografías definidos en IDENTIDAD-MARCA.md.
- No inventar precios, horarios, nombres de peluqueros ni datos reales. Si falta información, utilizar $ 0 o datos claramente marcados como ejemplo o provisorios.
- Trabajar de a una tarea de 08-TAREAS.md por vez.
- El código debe escribirse en inglés y los textos visibles del sitio en español.
- Las validaciones importantes deben realizarse también en el servidor.
- Las credenciales, tokens y datos sensibles nunca deben exponerse al navegador.
- El sistema debe respetar la anticipación mínima de 10 horas para reservar.
- El sistema debe contemplar el recordatorio por WhatsApp y el proceso de confirmación definido en los requerimientos.
- No agregar funcionalidades fuera del alcance sin documentarlas y justificarlas previamente.
- Mantener coherencia entre identidad, requerimientos, arquitectura, datos y diseño de interfaz.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
