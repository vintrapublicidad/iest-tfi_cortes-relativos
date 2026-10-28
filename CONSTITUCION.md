# CONSTITUCIÓN DEL PROYECTO: CORTES RELATIVOS

Esta Constitución establece los principios fundamentales, inquebrantables y comprobables que rigen todo el ciclo de vida del software, la arquitectura técnica y la colaboración entre el desarrollador humano y los agentes de Inteligencia Artificial en el proyecto **Cortes Relativos** (Tinogasta, Catamarca).

---

## 🏛️ Principios Fundamentales

### Principio 1: Diseño Centrado en el Usuario y Enfoque Mobile-First
* **Enunciado**: Toda pantalla, interacción y componente visual debe concebirse, maquetarse y probarse prioritariamente para dispositivos móviles antes que para escritorio.
* **Criterio Comprobable**: El layout principal no debe presentar desbordamiento horizontal (`overflow-x`) en pantallas de 360px de ancho. Los elementos táctiles (botones, tarjetas, selectores de hora) deben cumplir una zona táctil mínima de 44x44px.

### Principio 2: Integridad y Veracidad de la Información (Cero Alucinación)
* **Enunciado**: El sistema no debe mostrar, almacenar ni procesar información ficticia, precios engañosos o datos inventados por modelos de lenguaje.
* **Criterio Comprobable**: Los servicios sin cotización definida se informarán formalmente con valor referencial provisorio ($0) según documentación. Los nombres de barberos, números de contacto y horarios corresponden estrictamente a la realidad operativa de Tinogasta o son catalogados explícitamente como ejemplos de prueba en entornos de desarrollo.

### Principio 3: Uso Ético y Responsable de la Inteligencia Artificial (Supervisión Humana Activa)
* **Enunciado**: La Inteligencia Artificial actúa como un copiloto de programación y acelerador de diseño, pero nunca como decisor final no supervisado. Todo código o recurso generado debe ser validado, comprendido y testeado por el desarrollador responsable.
* **Criterio Comprobable**: Ninguna sugerencia de código generativo se integra a producción sin pasar por un `build` libre de errores y validaciones unitarias en verde. En el producto final se incluye la leyenda de transparencia sobre el uso de asistencia de IA en el desarrollo.

### Principio 4: Rigor en la Lógica de Negocio y Doble Validación (Client & Server)
* **Enunciado**: Las restricciones operativas de la barbería deben garantizarse obligatoriamente en el servidor, independientemente de las validaciones en la interfaz de usuario.
* **Criterio Comprobable**: Las reservas requieren al menos 10 horas de anticipación cronológica. La ventana de amortiguación de 15 minutos entre turnos debe verificarse matemáticamente antes de insertar cualquier registro en la base de datos, impidiendo solapamientos horarios de un mismo peluquero.

### Principio 5: Privacidad, Seguridad y Protección de Datos
* **Enunciado**: La información sensible del cliente (número telefónico, correo y citas) y los secretos de configuración del negocio deben tratarse bajo el principio de menor privilegio.
* **Criterio Comprobable**: Ningún token, contraseña administrativa o cadena de conexión a base de datos debe ser expuesta al cliente o incluida en el repositorio Git. Toda variable de entorno crítica se aísla en el backend.

### Principio 6: Respeto a Estándares Web, Rendimiento y Accesibilidad (WCAG)
* **Enunciado**: Las animaciones, interacciones y transiciones deben enriquecer la experiencia sin degradar la fluidez del dispositivo ni perjudicar a usuarios con sensibilidades sensoriales.
* **Criterio Comprobable**: Toda animación continua debe desactivarse de forma inmediata y automática cuando el usuario tenga configurado `prefers-reduced-motion: reduce`. Las animaciones deben utilizar aceleración por hardware (`transform`, `opacity`, `will-change`).

### Principio 7: Desarrollo Guiado por Especificaciones (SDD) y Trazabilidad
* **Enunciado**: Cada nueva funcionalidad debe surgir de un requerimiento claro, expresado en lenguaje formal (sintaxis EARS), planificado paso a paso y registrado con trazabilidad completa.
* **Criterio Comprobable**: Toda modificación de alcance técnico debe reflejarse en los documentos de arquitectura y en el plan de tareas (`08-TAREAS.md`), con registro de errores detectados y corregidos en la bitácora de prompts (`docs/PROMPTS.md`).
