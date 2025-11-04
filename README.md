# Mini Liga Express

MVP completo para gestionar una mini liga con **Laravel 11** (API REST), **Angular 17** (web) y **Ionic/Angular** (mobile). Incluye clasificación dinámica, programación de fixtures y registro de resultados desde web y móvil.

## Estructura del repositorio
- `backend/` – API Laravel con endpoints de equipos, partidos, standings y eliminación de equipos.
- `web/` – SPA Angular con pestañas de Equipos (alta, programación y borrado) y Clasificación.
- `mobile/` – App Ionic con tabs para listar partidos y reportar marcadores.
- `openapi.yaml` – contrato de referencia para la API.
- `DECISIONES.md` – log de decisiones técnicas y próximos pasos.

## Requisitos previos
- PHP 8.2+, Composer 2.
- Node.js 20+, npm 10+.
- SQLite incluido con PHP (no requiere configuración adicional).

## Puesta en marcha
1. **Backend**
   ```bash
   cd backend
   cp .env.example .env
   composer install
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve
   ```
   La API queda disponible en `http://127.0.0.1:8000`.
2. **Web**
   ```bash
   cd web
   npm install
   npm start
   ```
   La SPA queda expuesta en `http://localhost:4200`. Ajusta `API_BASE_URL` en `src/environments/*` si tu backend usa otra URL.
3. **Mobile**
   ```bash
   cd mobile
   npm install
   npm start
   ```
   Ionic sirve la aplicación en `http://localhost:8100`. Configura `environment.ts` con la URL del backend cuando pruebes en dispositivos físicos.

## Endpoints principales
- `GET /api/teams`
- `POST /api/teams`
- `DELETE /api/teams/{team}`
- `GET /api/matches`
- `POST /api/matches`
- `POST /api/matches/{match}/result`
- `GET /api/standings`

Revisa `backend/README.md` para payloads y detalles adicionales.

## Verificación rápida
- Backend: `php artisan test`
- Web: `npm run lint && npm run test` (Karma) && `npm run build`
- Mobile: `npm run lint && npm run test`

## Documentación complementaria
- `backend/README.md`, `web/README.md`, `mobile/README.md`: guías específicas de cada cliente.
- `DECISIONES.md`: trade-offs de arquitectura, criterios y trabajos pendientes.