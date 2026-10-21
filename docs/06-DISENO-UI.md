# Diseño de Interfaz

## Objetivo visual

La interfaz debe transmitir una peluquería moderna, cercana y divertida, pero mantener claridad suficiente para que cualquier persona pueda reservar un turno sin dificultades.

## Pantallas

### Inicio

Debe incluir:

- Logo de Cortes Relativos.
- Eslogan: "Tu estilo, relativamente perfecto".
- Presentación breve del emprendimiento.
- Botón principal "Reservar turno".
- Servicios destacados.
- Acceso a la disponibilidad.

### Disponibilidad

Debe permitir:

- Seleccionar una fecha.
- Seleccionar un peluquero.
- Visualizar horarios disponibles.
- Diferenciar horarios disponibles de ocupados.
- Mostrar la anticipación mínima de 10 horas.

### Reserva

Debe incluir:

- Servicio seleccionado.
- Peluquero seleccionado.
- Fecha y hora.
- Nombre del cliente.
- Número de WhatsApp.
- Resumen del turno.
- Condiciones de confirmación y demora.
- Botón de confirmación.

### Confirmación

Debe mostrar:

- Mensaje de reserva realizada.
- Fecha y hora.
- Servicio.
- Peluquero.
- Aviso sobre la confirmación por WhatsApp.
- Información sobre la liberación del turno si no se confirma dentro del plazo establecido.

### Lista de espera

Cuando no exista disponibilidad, debe permitir:

- Registrar los datos básicos del cliente.
- Seleccionar el servicio solicitado.
- Informar que se trata de una lista de espera.
- Mostrar un mensaje claro sobre la notificación cuando exista disponibilidad.

## Aplicación de la identidad

| Elemento | Aplicación |
| :--- | :--- |
| Fondo principal | Blanco Nube #FFFFFF |
| Fondo secundario | Gris Cálculo #ECF0F1 |
| Texto principal | Azul Pizarra #2C3E50 |
| Botón principal | Amarillo Einstein #F1C40F |
| Títulos del sitio | Bangers |
| Texto general | Poppins |
| Logotipo | Diseño personalizado de Cortes Relativos inspirado en Einstein y la relatividad |

## Botones

- Utilizar bordes redondeados.
- Mantener textos claros y legibles.
- Utilizar Amarillo Einstein para las acciones principales.
- Diferenciar visualmente los estados normal, hover, foco y deshabilitado.

## Tarjetas

- Fondo Blanco Nube.
- Bordes redondeados.
- Sombra suave.
- Información organizada por bloques.
- Espaciado suficiente entre elementos.

## Formularios

- Etiquetas visibles.
- Campos suficientemente grandes para celulares.
- Mensajes de error claros.
- Validación antes de enviar.
- No utilizar solamente el color para indicar errores.

## Avisos importantes

Los avisos importantes utilizarán Gris Cálculo como fondo y Azul Pizarra como texto, con un acento Amarillo Einstein.

Ejemplo:

> Recordatorio: Confirmá tu asistencia por WhatsApp según las instrucciones recibidas. Si no confirmás dentro del plazo establecido, el turno puede liberarse.

También debe informarse antes de reservar la condición sobre llegadas con más de 15 minutos de demora y el posible adicional del 20%.

## Diseño adaptable

La interfaz debe funcionar en:

- Celulares.
- Tablets.
- Computadoras de escritorio.

Se priorizará el diseño para pantallas pequeñas y luego se adaptará a pantallas más grandes.

## Accesibilidad visual

- Contraste suficiente entre texto y fondo.
- Tamaños de texto legibles.
- Estados de foco visibles.
- Botones fáciles de identificar.
- Formularios con etiquetas claras.
- Mensajes comprensibles para usuarios con distintos niveles de experiencia digital.

## De la marca al código: variables CSS

Las siguientes variables deben copiarse tal cual en `app/globals.css`. La IA debe usar siempre estas variables, nunca colores escritos a mano.

```css
/* app/globals.css */
:root {
  --color-principal: #2C3E50;
  --color-acento: #F1C40F;
  --color-fondo: #FFFFFF;
  --color-fondo-secundario: #ECF0F1;
  --radio-borde: 8px;
}

h1 {
  font-family: var(--fuente-titulos);
  color: var(--color-principal);
}
```

Si la marca cambia un color, se edita una sola línea y se actualiza todo el sitio.
