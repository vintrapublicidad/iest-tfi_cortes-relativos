# Convenciones de Código

## Nombres de archivos

- Componentes: PascalCase.
- Funciones y variables: camelCase.
- Variables de entorno: mayúsculas con guiones bajos.
- Archivos de documentación: nombres descriptivos en mayúsculas o minúsculas según la estructura establecida.

Ejemplos:

```text
Calendario.js
TarjetaServicio.js
FormularioReserva.js
validaciones.js
```

## Componentes

Los componentes deben utilizar PascalCase.

Ejemplos:

```text
TarjetaServicio
Calendario
FormularioReserva
SelectorPeluquero
```

## Funciones y variables

Las funciones y variables deben utilizar camelCase.

Ejemplos:

```text
scheduleAppointment()
confirmAttendance()
selectedDate
availableTime
```

## Variables de entorno

Utilizar mayúsculas y guiones bajos.

Ejemplos:

```env
DATABASE_URL
WHATSAPP_API_TOKEN
WHATSAPP_PHONE_NUMBER_ID
```

Los valores reales de estas variables deben mantenerse privados.

## Idioma

- Código: inglés cuando sea posible.
- Nombres de funciones, variables y componentes: preferentemente en inglés.
- Textos visibles del sitio: español.
- Documentación del TP: español.

## Commits

Los mensajes de los commits deben ser breves y describir el cambio realizado.

Ejemplos:

```text
agrega calendario de disponibilidad
corrige validacion de horario
agrega formulario de reserva
mejora mensaje de confirmacion
```

## Branches

Utilizar los siguientes formatos:

```text
feature/nombre-funcionalidad
fix/nombre-error
docs/nombre-documentacion
```

## Reglas generales

- Evitar nombres ambiguos.
- Mantener componentes pequeños y reutilizables.
- No duplicar lógica innecesariamente.
- Validar los datos antes de guardarlos.
- No guardar secretos dentro del código fuente.
- Mantener una estructura ordenada.
- Revisar los cambios antes de incorporarlos a la rama principal.
