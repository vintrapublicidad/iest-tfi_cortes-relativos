# Stack Tecnológico

| Capa | Tecnología | Motivo |
| :--- | :--- | :--- |
| Interfaz | React | Permite construir componentes reutilizables para servicios, formularios y calendario. |
| Framework | Next.js | Integra rutas, renderizado, SEO y funcionalidades de servidor en un mismo proyecto. |
| Estilos | CSS con variables | Permite centralizar los colores de la marca y mantener una interfaz consistente. |
| Base de datos | PostgreSQL | Es adecuada para relaciones entre clientes, servicios, peluqueros y turnos. |
| ORM/acceso a datos | A definir | Se seleccionará según la implementación final y las necesidades del proyecto. |
| Repositorio | Git + GitHub | Permite controlar versiones y registrar los cambios del proyecto. |
| Publicación | Vercel | Facilita la publicación de una aplicación Next.js y el uso de HTTPS. |
| WhatsApp | API compatible con WhatsApp, por ejemplo Twilio | Permite automatizar recordatorios y gestionar el flujo de confirmación. |
| IA | Asistente de IA generativa | Se utilizará como apoyo para documentación, generación y revisión de código, ideas de interfaz y resolución de errores, siempre verificando el resultado. |

## Criterios de selección

Las tecnologías fueron seleccionadas buscando:

- Facilidad de aprendizaje y desarrollo.
- Compatibilidad entre frontend y backend.
- Buen funcionamiento en dispositivos móviles.
- Facilidad de mantenimiento.
- Posibilidad de publicar el proyecto.
- Capacidad para manejar información relacional de turnos.

## Uso de IA

La IA no reemplaza la revisión del desarrollador. Puede utilizarse para:

- Proponer estructuras de código.
- Ayudar a documentar el proyecto.
- Detectar posibles errores.
- Generar alternativas de interfaz.
- Explicar conceptos técnicos.
- Revisar consultas o estructuras de datos.

Todo código generado con IA debe ser revisado, probado y adaptado al proyecto antes de incorporarse.

## Variables de entorno

Las credenciales de base de datos y los tokens de servicios externos deben almacenarse en variables de entorno y no deben publicarse en el repositorio.

Ejemplos:

```env
DATABASE_URL=
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

Los valores reales nunca deben escribirse en esta documentación ni subirse a GitHub.
