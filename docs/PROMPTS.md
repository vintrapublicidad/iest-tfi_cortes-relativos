# REGISTRO DE PROMPTS Y CONTROL DE ERRORES DE IA (docs/PROMPTS.md)

**Proyecto**: Cortes Relativos  
**Metodología**: Desarrollo Guiado por Especificaciones (SDD) con Asistencia de IA  

---

## 1. Registro de Prompts Clave del Ciclo de Desarrollo

### Fase 1: Arquitectura, Lógica de Negocio y Base de Datos
* **Prompt del Desarrollador**:
  > *"Diseñemos el backend de turnos para una barbería en Tinogasta. Debe permitir consultar disponibilidad, respetar 10 hs mínimas de anticipación, soportar barberos independientes y prever resiliencia si la base de datos PostgreSQL no está conectada localmente."*
* **Resultado**: Implementación de `lib/data.js` con soporte híbrido (PostgreSQL nativo con fallback a almacenamiento en memoria ordenado por timestamps), evitando que la app colapse en desarrollo o despliegues estáticos.

### Fase 2: Configuración de WhatsApp y Notificación Dual
* **Prompt del Desarrollador**:
  > *"Con respecto a la función de que el dueño ponga el WhatsApp de la empresa ya que este será el encargado de notificar a los barberos de los turnos tanto reservas como disponibilidad y además debe confirmar con el cliente el turno también mediante WhatsApp esa función debe agregarse en admin también por favor y comprueba que funcione y conecte todo el sistema es la más importante."*
* **Resultado**: Creación de `/api/company` y `/api/barbers`, adición de campos de WhatsApp con validación telefónica y notificación automática al cliente y al peluquero asignado.

### Fase 3: Animaciones de Marca y Microinteracciones Móviles
* **Prompt del Desarrollador**:
  > *"Al logo de cortes relativos en el hero podemos darle alguna animación así como de rayo que recorre los bordes? Sal de lo cotidiano usado por todas las IAs por favor."*
* **Resultado**: Desarrollo de `.logo-lightning-wrapper` con efecto **Electric Border Beam** en CSS puro (`conic-gradient` rotatorio, `mask-composite: exclude` y filtro de resplandor ambiental), compatible con `prefers-reduced-motion`.

### Fase 4: Horarios Operativos y Amortiguación de Seguridad
* **Prompt del Desarrollador**:
  > *"Vamos a configurar algo de los horarios y adaptar el contenido ya que estaba pensando que entre corte y corte debe haber un periodo por si el corte se demora por alguna cosa entonces entre corte y reserva debe haber una ventana de 15 min además vamos a cambiar el horario de atención de 9 a 1 y de 15 a 23 de martes a sábados."*
* **Resultado**: Modificación del selector en `components/Calendario.js` y de la regla de colisión en `lib/data.js`, bloqueando domingos y lunes e implementando la fórmula de ventana de 15 minutos entre reservas.

---

## 2. Registro de Errores Cometidos por la IA, Detección Humana y Corrección (Mínimo 3 Exigidos)

A continuación se documentan tres errores reales y críticos cometidos por los agentes de IA durante el proyecto, evidenciando el rol fundamental de la supervisión humana:

### ⚠️ Error 1: Corrupción de Codificación UTF-8 (Mojibake) en Títulos y Acentos
* **Problema Generado por la IA**:
  Al intentar modificar archivos JSX mediante comandos automatizados de PowerShell (`Set-Content`), la IA guardó los archivos en codificación ANSI / UTF-16, provocando que caracteres como `á`, `é`, `í`, `ó`, `ú`, `ñ` y comillas se transformaran en símbolos corruptos (mojibake: ej. `gestin`, `No se encontraron turnos`, etc.), rompiendo los títulos visuales de la aplicación.
* **Detección Humana**:
  El usuario detectó el error inmediatamente y notificó: *"revisa los cambios realizados ya que afectaron la funcionalidad y en los titulos se pusieron cualquier letra"*.
* **Corrección Aplicada**:
  Se prohibió a la IA utilizar comandos de PowerShell para escribir archivos fuente. Se implementó una política estricta de edición mediante scripts de Node.js (`fs.readFileSync` y `fs.writeFileSync` con codificación `'utf8'` explícita) y se restauraron las cadenas limpias mediante `git checkout` y refactorización controlada.

---

### ⚠️ Error 2: Pérdida de Reactividad al Modificar Nombres de Peluqueros
* **Problema Generado por la IA**:
  El backend permitía editar los nombres de los peluqueros desde el panel de administración, pero la IA había hardcodeado una lista estática de peluqueros en memoria que no sincronizaba el estado con la selección de turnos del cliente (`/turnos`), provocando que los cambios de barberos no se vieran reflejados al querer reservar.
* **Detección Humana**:
  El usuario probó el flujo en vivo y advirtió: *"quedo perfecto ahora acabo de cambiar el nombre de los peluqueros pero al querer reservar turno no muestra sus nombres o no guarda el cambio"*.
* **Corrección Aplicada**:
  Se refactorizó el almacenamiento en `lib/data.js` para que `memoryBarbers` fuera la fuente de verdad mutable compartida en caliente por `/api/barbers` y `/api/turnos`. Se crearon los métodos `getBarbersWithWhatsApp()` y `updateBarber()`, refrescando los selectores dinámicamente.

---

### ⚠️ Error 3: Cálculo Insuficiente de Colisión Horaria (Falta de Buffer Dinámico)
* **Problema Generado por la IA**:
  Inicialmente, la IA validaba colisiones de turnos con un umbral estático de 20 minutos (`Math.abs(existingTime - targetDate.getTime()) < 20 * 60 * 1000`), sin considerar que un corte puede durar 45 o 60 minutos, ni contemplar el tiempo muerto necesario entre clientes sucesivos.
* **Detección Humana**:
  El usuario intervino con una regla de negocio de barbería real: *"entre corte y corte debe haber un periodo por si el corte se demora por alguna cosa entonces entre corte y reserva debe haber una ventana de 15 min"*.
* **Corrección Aplicada**:
  Se reemplazó el umbral estático por una evaluación matemática de intersección de intervalos:  
  $$\text{Intervalo A: } [\text{Inicio}_A, \text{Inicio}_A + \text{Duración}_A + 15\text{m})$$  
  $$\text{Intervalo B: } [\text{Inicio}_B, \text{Inicio}_B + \text{Duración}_B + 15\text{m})$$  
  Si ambos intervalos se cruzan para el mismo profesional, la reserva se bloquea tanto en el frontend visual (`components/Calendario.js`) como en la validación del servidor (`lib/data.js`).
