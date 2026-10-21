# Modelo de Datos

## Entidades principales

| Tabla | Campos principales | Tipo |
| :--- | :--- | :--- |
| Clientes | id, nombre, telefono, email | SERIAL, VARCHAR, VARCHAR, VARCHAR |
| Servicios | id, nombre, precio, duracion_minutos, categoria | SERIAL, VARCHAR, NUMERIC, INTEGER, VARCHAR |
| Peluqueros | id, nombre, especialidad, horario_inicio, horario_fin, dias_trabajo | SERIAL, VARCHAR, VARCHAR, TIME, TIME, VARCHAR |
| Turnos | id, cliente_id, servicio_id, peluquero_id, fecha_hora, estado, confirmado, recordatorio_enviado | SERIAL, FK, FK, FK, TIMESTAMP, VARCHAR, BOOLEAN, BOOLEAN |
| ListaEspera | id, cliente_id, servicio_id, fecha_solicitud, estado | SERIAL, FK, FK, TIMESTAMP, VARCHAR |

## Relaciones

- Un cliente puede tener varios turnos.
- Un servicio puede estar asociado a varios turnos.
- Un peluquero puede atender varios turnos.
- Un turno pertenece a un cliente, un servicio y un peluquero.
- La lista de espera se relaciona con el cliente y el servicio solicitado.

## Estados del turno

Los estados previstos son:

```text
pendiente
confirmado
cancelado
liberado
completado
```

## Datos de servicios de ejemplo

| Servicio | Precio | Duración |
| :--- | :--- | :--- |
| Corte de caballero | $ 0 | 30 min |
| Corte de dama | $ 0 | 45 min |
| Corte de niño | $ 0 | 30 min |
| Color completo | $ 0 | 120 min |
| Brushing / peinado | $ 0 | 45 min |
| Corte y barba | $ 0 | 60 min |

Los precios son valores provisorios porque todavía no se definieron los precios reales del emprendimiento.

## Ejemplo de registro

```text
Cliente:
  nombre: "Ana Pérez"
  telefono: "Ejemplo"
  email: "ejemplo@correo.com"

Turno:
  servicio: "Corte de dama"
  peluquero: "Peluquero de ejemplo"
  fecha_hora: "2026-10-15 15:00"
  estado: "pendiente"
  confirmado: false
```

Los datos anteriores son únicamente de demostración y no representan información real de clientes.

## Consideraciones

- Cada turno debe tener un identificador único.
- Los identificadores de cliente, servicio y peluquero deben relacionarse con registros existentes.
- El sistema debe comprobar que no se reserve un horario ocupado.
- Los precios definitivos deben actualizarse cuando el emprendimiento los determine.
- Los datos personales deben utilizarse únicamente para gestionar las reservas.
