# Decisiones y siguientes pasos

## Decisiones clave
- **SQLite como datastore**: simplifica la puesta en marcha y funciona con el hosting embebido de Laravel; se priorizó rapidez sobre escalabilidad horizontal.
- **Seeders idempotentes**: `DatabaseSeeder` usa `upsert` y limpieza previa para permitir reinicios frecuentes sin romper llaves únicas.
- **Standings calculados on-the-fly**: se optó por generar la tabla en cada petición para evitar inconsistencias y mantener lógica en un solo lugar.
- **Angular standalone components**: evita módulos adicionales y agiliza el tree-shaking en build.
- **Ionic modal para resultados**: mejora UX respecto a navegar a otra vista y reduce latencia percibida.
- **CORS centralizado**: middleware global para permitir clientes locales múltiples mientras se mantiene lista blanca configurable.

## Trade-offs
- **Sin persistencia de usuarios/autenticación**: se asumió entorno de demo. Autenticación quedaría para una siguiente iteración.
- **Sin tests end-to-end**: se priorizaron pruebas de API (`phpunit`) y unitarias en Angular; e2e (Playwright/Cypress) puede agregarse.
- **Sin Docker Compose**: decisión para reducir tiempo; scripts existentes bastan para iniciar en local.
- **Assets estáticos mínimos**: estilos sencillos para cumplir requerimientos, dejando branding/UI avanzada para un sprint futuro.

## Próximos pasos sugeridos
- Implementar autenticación ligera (Laravel Sanctum) para restringir creación de equipos/resultados.
- Añadir histórico de partidos y filtros en los clientes.
- Desplegar pipeline CI (GitHub Actions) que ejecute `phpunit`, `npm run build` (web) y `npm run build` (mobile).
- Generar documentación OpenAPI interactiva (Swagger UI) servida desde el backend.
- Incorporar almacenamiento persistente local/offline en la app móvil usando Capacitor Storage.
