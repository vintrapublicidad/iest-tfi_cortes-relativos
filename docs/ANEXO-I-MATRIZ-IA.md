# ANEXO I: MATRIZ DE HERRAMIENTAS DE IA UTILIZADAS

**Proyecto**: Cortes Relativos — Sistema Web de Gestión y Reserva de Turnos  
**Ubicación**: Tinogasta, Catamarca  
**Fecha de Elaboración**: Octubre 2026  

---

## 1. Matriz Comparativa y Operativa de Herramientas de IA

| Herramienta / Modelo | Rol en el Proyecto | Propósito Principal | Fortalezas Detectadas | Limitaciones y Riesgos | Mitigación Humana Aplicada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Claude 3.5 Sonnet / 3.7 Thinking** | Arquitectura y Lógica de Negocio | Diseño inicial del modelo de datos, diagramación del flujo de reservas y refactorización backend. | Alta precisión en razonamiento de código complejo, respeto de contratos de API y generación estructurada. | Tendencia a sobre-modularizar o proponer dependencias npm externas innecesarias. | Revisión manual del código generado; directiva estricta de no instalar librerías pesadas (ej. animaciones en CSS puro). |
| **Google Gemini (Flash / Pro via Antigravity)** | Pair Programming y Ejecución Rápida | Asistencia en tiempo real, integración de endpoints REST, resolución de bugs de codificación UTF-8 e inyección de estilos CSS. | Excelente velocidad de respuesta, integración nativa con el espacio de trabajo local y ejecución de tareas de terminal. | Puede interpretar erróneamente comandos de PowerShell con pipes o caracteres especiales en entornos Windows. | Uso de scripts Node.js (`.mjs`) dedicados para manipulación segura de archivos y lecturas binarias limpias. |
| **Bexa Frontend Design Skill (AI Agent Skill)** | Sistema de Diseño e Interacciones | Guía de microinteracciones fluidas, físicas de resorte en tarjetas, shimmer de barbería y respeto a WCAG. | Proporciona reglas matemáticas y cinéticas precisas para CSS moderno sin sobrecargar el bundle JS. | En etapas iniciales alteró textos y codificación de fuentes en archivos JSX. | Restauración controlada con Git y aplicación granular de clases CSS (`btn-kinetic`, `tarjeta-tactil`). |
| **Motor Generativo de Ilustraciones y Logotipos** | Identidad Visual | Creación del logo vectorizado conceptual de Cortes Relativos (Einstein + Tijeras/Navaja). | Rápida iteración estética y conceptualización de marca adaptada a la localidad. | No genera archivos vectoriales limpios listos para producción web directa. | Vectorización y limpieza del SVG en `public/img/logo.svg` para garantizar escalabilidad y nitidez en pantallas Retina. |

---

## 2. Criterios de Selección y Evaluación
1. **Soberanía y Rendimiento**: Se priorizaron modelos capaces de trabajar con código nativo (Next.js App Router, CSS nativo) sin depender de librerías de terceros propensas a obsolescencia.
2. **Seguridad y Privacidad**: Ninguna credencial de bases de datos, tokens de WhatsApp ni datos privados de clientes fueron ingresados en prompts públicos o abiertos.
3. **Mantenibilidad**: Todo componente asistido por IA fue documentado con comentarios claros y tipos verificables.
