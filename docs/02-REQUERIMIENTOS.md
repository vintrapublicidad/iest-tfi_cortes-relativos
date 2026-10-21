# Requerimientos del Sistema

## Requerimientos funcionales

| ID | Requerimiento | Prioridad |
| :--- | :--- | :--- |
| RF01 | Mostrar los servicios disponibles con duración y precio. | Alta |
| RF02 | Mostrar los peluqueros disponibles. | Alta |
| RF03 | Mostrar un calendario con horarios disponibles. | Alta |
| RF04 | Permitir seleccionar un día y horario con al menos 10 horas de anticipación. | Alta |
| RF05 | Permitir seleccionar peluquero y servicio. | Alta |
| RF06 | Registrar nombre y número de WhatsApp del cliente. | Alta |
| RF07 | Confirmar la solicitud de turno y mostrar sus datos. | Alta |
| RF08 | Enviar un recordatorio por WhatsApp antes del turno. | Alta |
| RF09 | Permitir confirmar la asistencia mediante el mecanismo definido para WhatsApp. | Alta |
| RF10 | Liberar el turno cuando no se confirme dentro del plazo establecido. | Alta |
| RF11 | Permitir cancelar un turno. | Media |
| RF12 | Registrar clientes en lista de espera cuando no exista disponibilidad. | Media |
| RF13 | Notificar al siguiente cliente de la lista cuando se libere un turno. | Media |
| RF14 | Informar el posible adicional por demora antes de finalizar la reserva. | Media |

## Requerimientos no funcionales

| ID | Requerimiento | Criterio |
| :--- | :--- | :--- |
| RNF01 | Responsive | La interfaz debe adaptarse a celulares, tablets y computadoras. |
| RNF02 | Rendimiento | Se busca una carga inicial inferior a 2 segundos en condiciones normales. |
| RNF03 | Accesibilidad | La información y los controles deben ser claros y fáciles de utilizar. |
| RNF04 | Seguridad | Los datos sensibles y credenciales deben permanecer protegidos. |
| RNF05 | Validación | Los datos importantes deben validarse también en el servidor. |
| RNF06 | Consistencia visual | La interfaz debe respetar la identidad definida para Cortes Relativos. |
| RNF07 | Disponibilidad | El sistema debe evitar reservas sobre horarios ya ocupados. |
| RNF08 | Claridad | Las condiciones de confirmación, cancelación y demora deben mostrarse antes de reservar. |

## Reglas de negocio

- La reserva requiere una anticipación mínima de 10 horas.
- Un horario ocupado no puede ser reservado por otro cliente.
- El turno debe asociarse a un servicio y, cuando corresponda, a un peluquero.
- El recordatorio debe enviarse antes del horario del turno.
- Si el cliente no confirma dentro del plazo establecido, el turno puede pasar a estado liberado.
- Si un turno se libera y existe lista de espera, se debe considerar al siguiente cliente elegible.
- Si el cliente llega más de 15 minutos tarde, se informa un adicional del 20% sobre el servicio, sujeto a las condiciones definidas por el emprendimiento.

## Historia de usuario principal

Como cliente de la peluquería, quiero consultar los horarios disponibles y reservar un turno online para elegir un momento conveniente sin tener que comunicarme telefónicamente.

## Criterios de aceptación

- El cliente puede consultar servicios y disponibilidad.
- No puede seleccionar un horario ocupado.
- No puede reservar con menos de 10 horas de anticipación.
- Debe ingresar nombre y WhatsApp.
- Antes de confirmar, debe visualizar las condiciones importantes.
- Al completar la reserva, debe recibir la confirmación correspondiente.
