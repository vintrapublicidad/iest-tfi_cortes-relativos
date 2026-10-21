# Seguridad

## Datos de clientes

El sistema puede manejar datos personales necesarios para gestionar un turno:

- Nombre.
- Número de WhatsApp.
- Email, si se solicita.

Solo deben solicitarse los datos necesarios para el funcionamiento del sistema.

## Variables de entorno

Las credenciales y los tokens deben almacenarse en variables de entorno.

Ejemplo:

```env
DATABASE_URL=
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

No utilizar NEXT_PUBLIC_ para secretos.

El archivo .env.local no debe subirse al repositorio.

## Validaciones

Los datos deben validarse en el servidor, aunque también exista validación en el navegador.

Validar como mínimo:

- Nombre.
- Número de WhatsApp.
- Servicio.
- Peluquero.
- Fecha.
- Hora.
- Disponibilidad real.
- Anticipación mínima de 10 horas.

## Disponibilidad

El servidor debe comprobar que el horario continúe disponible antes de crear el turno. No debe confiar únicamente en la información mostrada previamente en el navegador.

## Precios

Los precios utilizados para calcular información del turno deben obtenerse desde una fuente confiable del servidor o de la base de datos. No se debe confiar en precios enviados por el navegador.

## WhatsApp

Los tokens de la API de WhatsApp deben permanecer en el servidor.

El navegador nunca debe recibir:

- Tokens.
- Claves privadas.
- Credenciales.
- Variables secretas.

## Lista de espera

El servidor debe controlar que un cliente no pueda registrarse repetidamente para la misma solicitud sin una razón válida.

## Confirmación

El mecanismo de confirmación debe comprobar que la respuesta corresponde al turno correcto y al número de WhatsApp asociado.

## Inyección y contenido

- Utilizar consultas parametrizadas o el mecanismo seguro equivalente del ORM.
- No construir consultas SQL concatenando directamente datos ingresados por usuarios.
- Evitar dangerouslySetInnerHTML salvo que exista una necesidad justificada y un proceso seguro de sanitización.

Ejemplo:

```js
// ❌ MAL: se concatena el texto directamente en el SQL
"SELECT * FROM turnos WHERE fecha = '" + fecha + "'"

// ✅ BIEN: el valor viaja como parámetro
sql`SELECT * FROM turnos WHERE fecha = ${fecha}`
```

## Protección del repositorio

No subir:

```text
.env
.env.local
tokens
contraseñas
claves privadas
datos reales de clientes
```

## Principio general

La aplicación debe aplicar el principio de mínimo privilegio: cada parte del sistema debe acceder solamente a los datos y recursos que realmente necesita.
