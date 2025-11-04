# Backend – Laravel API

API REST que gestiona equipos, partidos y standings de la Mini Liga Express.

## Requisitos
- PHP 8.2+
- Composer 2+

## Puesta en marcha
```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

- `php artisan migrate --seed` crea las tablas de `teams` y `matches` y precarga 4 clubes, 2 partidos jugados y 2 pendientes.
- La base de datos usa SQLite (`database/database.sqlite`). El seeder es idempotente: puedes reejecutarlo sin duplicados (`php artisan migrate:fresh --seed`).
- Si trabajas desde WSL o Linux, antepone `sudo` solo si tu instalación de PHP lo requiere.

## Endpoints expuestos
- `GET /api/teams`
- `POST /api/teams` (`name`)
- `DELETE /api/teams/{team}`
- `GET /api/matches`
- `POST /api/matches` (`home_team_id`, `away_team_id`, `scheduled_at?`)
- `POST /api/matches/{match}/result` (`home_score`, `away_score`)
- `GET /api/standings`

Todas las respuestas siguen el contrato descrito en `../openapi.yaml`.

## Pruebas y calidad
- `php artisan test` ejecuta la suite completa (feature tests para standings, matches y borrado de equipos).
- `php artisan pint` aplica formato PSR-12.
- `php artisan migrate:fresh --seed` es la forma recomendada de resetear datos durante QA.

## Variables relevantes
- `APP_URL` debe coincidir con la URL que expone tu servidor (`http://127.0.0.1:8000`).
- `config/cors.php` lista los orígenes permitidos (4200, 8100 y Capacitor).

## Estructura clave
- Modelos: `app/Models/Team.php`, `app/Models/LeagueMatch.php`.
- Controladores: `app/Http/Controllers/Api/TeamController.php`, `MatchController.php`.
- Seeders y factories: `database/seeders/DatabaseSeeder.php`, `database/factories/*`.
- Pruebas: `tests/Feature/StandingsTest.php`, `MatchesTest.php`, `TeamsTest.php`.
