# Cortes Relativos

> *"Tu estilo, relativamente perfecto."*

Sistema web para la gestión y reserva de turnos de una peluquería en Tinogasta, Catamarca. Permite a los clientes consultar servicios, peluqueros y disponibilidad, seleccionar día y horario respetando la anticipación mínima de 10 horas, y recibir recordatorios para confirmar su asistencia por WhatsApp.

---

## 🚀 Tecnologías

- **Framework:** Next.js (App Router, Turbopack)
- **UI:** React 19, CSS con variables de diseño
- **Base de Datos:** PostgreSQL
- **Diseño & Marca:** Paleta institucional (Azul Pizarra `#2C3E50`, Amarillo Einstein `#F1C40F`, Blanco Nube `#FFFFFF`, Gris Cálculo `#ECF0F1`), fuentes Google Fonts (*Poppins* y *Bangers*).

---

## 📁 Estructura del Proyecto

```text
cortes-relativos/
├── app/                  # Rutas y páginas de Next.js (App Router)
│   ├── layout.js         # Layout raíz con fuentes y metadatos SEO
│   ├── page.js           # Página de inicio
│   ├── turnos/           # Consulta de disponibilidad y reserva
│   ├── confirmar/        # Confirmación de asistencia
│   └── api/              # Endpoints de API (turnos, confirmaciones, whatsapp)
├── components/           # Componentes modulares reutilizables
├── lib/                  # Utilidades compartidas (db, validaciones)
├── public/               # Recursos estáticos (logos, isotipo)
├── scripts/              # Scripts de base de datos (schema DDL y seed)
├── docs/                 # Documentación completa del proyecto
└── marca/                # Recursos de identidad visual
```

---

## ⚙️ Configuración y Desarrollo

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Variables de entorno:**
   Crear un archivo `.env.local` basado en `.env.example`:
   ```bash
   DATABASE_URL=postgresql://postgres:password@localhost:5432/cortes_relativos
   ```

3. **Inicializar y poblar la base de datos:**
   ```bash
   npm run db:init
   npm run db:seed
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## 📋 Reglas de Negocio Clave

- **Anticipación mínima:** Los turnos deben reservarse con al menos 10 horas de antelación.
- **Disponibilidad:** El servidor valida que el horario y profesional no estén ocupados antes de agendar.
- **Confirmación WhatsApp:** Notificación y recordatorio con liberación de turno si no se confirma a tiempo.
- **Tardanzas:** Si el cliente llega con más de 15 minutos de demora, aplica un recargo del 20% sobre el servicio.
