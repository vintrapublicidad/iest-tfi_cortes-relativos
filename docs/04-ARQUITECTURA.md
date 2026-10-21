# Arquitectura del Proyecto

## Estructura propuesta

```text
cortes-relativos/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── turnos/
│   │   └── page.js
│   ├── confirmar/
│   │   └── page.js
│   └── api/
│       ├── turnos/
│       │   └── route.js
│       ├── confirmar/
│       │   └── route.js
│       └── whatsapp/
│           └── route.js
├── components/
│   ├── Calendario.js
│   ├── TarjetaServicio.js
│   ├── SelectorPeluquero.js
│   ├── FormularioReserva.js
│   └── ListaEspera.js
├── lib/
│   ├── db.js
│   └── validaciones.js
├── public/
│   └── img/
│       ├── logo.png
│       └── isotipo.png
├── docs/
├── marca/
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## Función de cada parte

| Parte | Función |
| :--- | :--- |
| app/ | Contiene las páginas y rutas principales de la aplicación. |
| app/page.js | Página de inicio y presentación del emprendimiento. |
| app/turnos/ | Interfaz para consultar disponibilidad y reservar. |
| app/confirmar/ | Pantalla relacionada con la confirmación de asistencia. |
| app/api/turnos/ | Consulta y creación de turnos mediante el servidor. |
| app/api/confirmar/ | Procesa la confirmación de un turno. |
| app/api/whatsapp/ | Gestiona la comunicación con el servicio externo de WhatsApp. |
| components/ | Componentes reutilizables de la interfaz. |
| lib/db.js | Conexión y acceso a la base de datos. |
| lib/validaciones.js | Validaciones reutilizables para datos de entrada. |
| public/ | Recursos públicos como imágenes y logo. |
| docs/ | Documentación Markdown del proyecto. |
| marca/ | Recursos de identidad visual. |
| .env.local | Variables privadas utilizadas durante el desarrollo. |
| .gitignore | Archivos que no deben incorporarse al repositorio. |

## Principio general

La interfaz no debe acceder directamente a las credenciales de la base de datos ni a tokens de servicios externos. Las operaciones sensibles se realizan en el servidor mediante las rutas correspondientes.

## Flujo principal

```text
Cliente
   |
   v
Página de turnos
   |
   v
Selecciona servicio + peluquero + fecha + horario
   |
   v
Servidor valida disponibilidad y anticipación mínima
   |
   v
Base de datos registra el turno
   |
   v
Cliente recibe confirmación
   |
   v
Recordatorio por WhatsApp
   |
   v
Confirmación / liberación del turno
```
