<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeagueMatch;
use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(): JsonResponse
    {
        // Se entrega el catálogo completo ordenado para facilitar su consumo en los clientes.
        $teams = Team::orderBy('name')->get();

        return response()->json([
            'data' => $teams,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:teams,name'],
        ]);

        $team = Team::create($validated);

        return response()->json([
            'data' => $team,
        ], 201);
    }

    /**
     * Elimina un equipo y limpia cualquier partido relacionado.
     */
    public function destroy(Team $team): JsonResponse
    {
        $team->delete();

        return response()->json([], 204);
    }

    public function standings(): JsonResponse
    {
        $teams = Team::all();
        $matches = LeagueMatch::completed()->get();

        // Se calculan las métricas por equipo partiendo de los encuentros concluidos.
        $standings = $teams->map(function (Team $team) use ($matches) {
            $teamMatches = $matches->filter(function (LeagueMatch $match) use ($team) {
                return $match->home_team_id === $team->id || $match->away_team_id === $team->id;
            });

            $stats = [
                'team_id' => $team->id,
                'name' => $team->name,
                'played' => 0,
                'won' => 0,
                'drawn' => 0,
                'lost' => 0,
                'goals_for' => 0,
                'goals_against' => 0,
                'goal_difference' => 0,
                'points' => 0,
            ];

            foreach ($teamMatches as $match) {
                $stats['played']++;

                if ($match->home_team_id === $team->id) {
                    $goalsFor = (int) $match->home_score;
                    $goalsAgainst = (int) $match->away_score;
                } else {
                    $goalsFor = (int) $match->away_score;
                    $goalsAgainst = (int) $match->home_score;
                }

                $stats['goals_for'] += $goalsFor;
                $stats['goals_against'] += $goalsAgainst;

                if ($goalsFor > $goalsAgainst) {
                    $stats['won']++;
                    $stats['points'] += 3;
                } elseif ($goalsFor === $goalsAgainst) {
                    $stats['drawn']++;
                    $stats['points'] += 1;
                } else {
                    $stats['lost']++;
                }
            }

            $stats['goal_difference'] = $stats['goals_for'] - $stats['goals_against'];

            return $stats;
        })->sort(function (array $first, array $second) {
            // Desempate jerárquico: puntos, diferencia, goles a favor y orden alfabético.
            if ($first['points'] !== $second['points']) {
                return $second['points'] <=> $first['points'];
            }

            if ($first['goal_difference'] !== $second['goal_difference']) {
                return $second['goal_difference'] <=> $first['goal_difference'];
            }

            if ($first['goals_for'] !== $second['goals_for']) {
                return $second['goals_for'] <=> $first['goals_for'];
            }

            return strcmp($first['name'], $second['name']);
        })->values()->map(function (array $stats, int $index) {
            // Se anota la posición considerando que el índice ya refleja el orden final.
            $stats['position'] = $index + 1;

            return $stats;
        });

        return response()->json([
            'data' => $standings,
        ]);
    }
}
