# Mobile – Ionic App

Aplicación Ionic Angular con tabs para consumir la API de la Mini Liga Express desde dispositivos móviles o navegador.

## Características
- **Partidos**: listado con pull-to-refresh y modal para reportar resultados.
- **Clasificación**: standings calculados por la API.
- UI responsive compatible con Capacitor para builds nativas.

## Requisitos
- Node.js 20+
- npm 10+
- Ionic CLI (opcional) si generarás builds nativas (`npm install -g @ionic/cli`).

## Puesta en marcha
```bash
cd mobile
npm install
npm start
```

- Se expone en `http://localhost:8100`.
- Configura `environment.ts` (`apiUrl`) con la URL del backend si no es `http://127.0.0.1:8000`.

## Ejecutar en dispositivo o emulador
```bash
npx cap sync
ionic capacitor run android --livereload
```
Asegúrate de que el dispositivo pueda alcanzar la IP del backend.

## Scripts de verificación
- `npm run lint`
- `npm run test`

## Arquitectura breve
- `src/app/tab1` – listado de partidos y modal `report-result`.
- `src/app/services/league-api.service.ts` – cliente HTTP centralizado.
- `src/app/models/*` – tipos compartidos con la API.
