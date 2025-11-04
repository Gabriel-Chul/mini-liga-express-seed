<?php

namespace Database\Seeders;

use App\Models\LeagueMatch;
use App\Models\Team;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Catálogo base de clubes para garantizar escenarios equilibrados.
        $teamNames = [
            'Lions FC',
            'Tigers FC',
            'Bears FC',
            'Wolves FC',
        ];

        $timestamp = now();

        // La inserción idempotente permite resembrar sin duplicados ni errores de unicidad.
        Team::upsert(
            collect($teamNames)
                ->map(fn (string $name) => [
                    'name' => $name,
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ])->all(),
            ['name'],
            ['updated_at']
        );

        $teams = Team::whereIn('name', $teamNames)->get()->keyBy('name');

        // Se limpia el calendario previo para reconstruir el fixture desde cero.
        LeagueMatch::query()->delete();

        $now = now();

        // Partidos históricos para alimentar la clasificación inicial.
        LeagueMatch::create([
            'home_team_id' => $teams->get('Lions FC')->id,
            'away_team_id' => $teams->get('Tigers FC')->id,
            'home_score' => 3,
            'away_score' => 1,
            'played_at' => $now->copy()->subDays(2),
            'scheduled_at' => $now->copy()->subDays(2),
        ]);

        LeagueMatch::create([
            'home_team_id' => $teams->get('Wolves FC')->id,
            'away_team_id' => $teams->get('Bears FC')->id,
            'home_score' => 2,
            'away_score' => 2,
            'played_at' => $now->copy()->subDay(),
            'scheduled_at' => $now->copy()->subDay(),
        ]);

        // Se añaden dos partidos pendientes para que los clientes puedan reportar resultados.
        LeagueMatch::factory()->create([
            'home_team_id' => $teams->get('Tigers FC')->id,
            'away_team_id' => $teams->get('Bears FC')->id,
            'scheduled_at' => $now->copy()->addDays(3),
        ]);

        LeagueMatch::factory()->create([
            'home_team_id' => $teams->get('Lions FC')->id,
            'away_team_id' => $teams->get('Wolves FC')->id,
            'scheduled_at' => $now->copy()->addDays(5),
        ]);
    }
}
