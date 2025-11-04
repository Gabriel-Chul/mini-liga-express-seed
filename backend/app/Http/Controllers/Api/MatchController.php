<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeagueMatch;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index(): JsonResponse
    {
        // Se retornan todos los partidos enriqueciendo con los nombres de los equipos.
        $matches = LeagueMatch::with(['homeTeam:id,name', 'awayTeam:id,name'])
            ->orderBy('scheduled_at')
            ->orderBy('id')
            ->get()
            ->map(fn (LeagueMatch $match) => $this->transformMatch($match));

        return response()->json([
            'data' => $matches,
        ]);
    }

    public function updateResult(Request $request, int $matchId): JsonResponse
    {
        $match = LeagueMatch::findOrFail($matchId);

        $validated = $request->validate([
            'home_score' => ['required', 'integer', 'min:0'],
            'away_score' => ['required', 'integer', 'min:0'],
        ]);

        // Se actualiza el marcador preservando la fecha de juego para la clasificación.
        $match->fill([
            'home_score' => $validated['home_score'],
            'away_score' => $validated['away_score'],
            'played_at' => now(),
        ]);
        $match->save();

        $match->load(['homeTeam:id,name', 'awayTeam:id,name']);

        return response()->json([
            'data' => $this->transformMatch($match),
        ]);
    }

    /**
     * Permite agendar un nuevo partido entre dos equipos válidos y distintos.
     */
    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'home_team_id' => ['required', 'integer', 'exists:teams,id'],
            'away_team_id' => ['required', 'integer', 'different:home_team_id', 'exists:teams,id'],
            'scheduled_at' => ['nullable', 'date'],
        ]);

        // Se crea la ficha del partido garantizando que la información temporal quede normalizada.
        $match = LeagueMatch::create([
            'home_team_id' => $payload['home_team_id'],
            'away_team_id' => $payload['away_team_id'],
            'scheduled_at' => isset($payload['scheduled_at'])
                ? Carbon::parse($payload['scheduled_at'])
                : null,
        ]);

        $match->load(['homeTeam:id,name', 'awayTeam:id,name']);

        return response()->json([
            'data' => $this->transformMatch($match),
        ], 201);
    }

    private function transformMatch(LeagueMatch $match): array
    {
        // Se homologa la estructura para mantener el contrato desde la API hacia los clientes.
        return [
            'id' => $match->id,
            'status' => $match->home_score === null || $match->away_score === null ? 'scheduled' : 'completed',
            'home_team' => [
                'id' => $match->homeTeam->id,
                'name' => $match->homeTeam->name,
            ],
            'away_team' => [
                'id' => $match->awayTeam->id,
                'name' => $match->awayTeam->name,
            ],
            'home_score' => $match->home_score,
            'away_score' => $match->away_score,
            'scheduled_at' => $match->scheduled_at?->toIso8601String(),
            'played_at' => $match->played_at?->toIso8601String(),
            'created_at' => $match->created_at?->toIso8601String(),
            'updated_at' => $match->updated_at?->toIso8601String(),
        ];
    }
}
