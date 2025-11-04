# Web – Angular SPA

Aplicación Angular 17 que consume la API de la Mini Liga Express y ofrece dos pestañas principales:
- **Equipos**: alta rápida, programación de partidos y eliminación con confirmación.
- **Clasificación**: tabla reactiva con puntos, goles, diferencia y estado de sincronización.

## Requisitos
- Node.js 20+
- npm 10+

## Configuración
```bash
cd web
npm install
npm start
```

- La aplicación queda disponible en `http://localhost:4200`.
- Ajusta `API_BASE_URL` en `src/environments/environment.ts` y `environment.development.ts` si el backend usa otra URL (por defecto `http://127.0.0.1:8000/api`).

## Scripts de verificación
- `npm run lint`
- `npm run test`
- `npm run build`

## Funcionalidades destacadas
- Formularios reactivos para crear equipos y programar partidos con validaciones básicas.
- Confirmación antes de eliminar equipos y refresco automático de listados.
- Estilos personalizados (glassmorphism) en `src/app/app.css` y CSS por página.
- `LeagueApiService` centraliza las peticiones y modelos (`src/app/services/league-api.service.ts`).

## Estructura básica
- `src/app/pages/teams-page.*` – gestión de equipos y programación de fixtures.
- `src/app/pages/standings-page.*` – clasificación y recarga manual.
- `src/app/models/*` – contratos de datos compartidos.
- `src/app/app.config.ts` – configuración standalone (`provideRouter`, `provideHttpClient`).
