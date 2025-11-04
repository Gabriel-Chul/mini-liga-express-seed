<?php

namespace Tests\Feature;

use App\Models\LeagueMatch;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MatchesTest extends TestCase
{
    use RefreshDatabase;

    public function test_matches_endpoint_lists_matches_with_status_and_relations(): void
    {
        $home = Team::factory()->create(['name' => 'Alpha FC']);
        $away = Team::factory()->create(['name' => 'Bravo FC']);
        $scheduled = LeagueMatch::factory()->create([
            'home_team_id' => $home->id,
            'away_team_id' => $away->id,
            'scheduled_at' => now()->addDay(),
        ]);

        $completed = LeagueMatch::factory()
            ->withResult(2, 1)
            ->create([
                'home_team_id' => $away->id,
                'away_team_id' => $home->id,
                'scheduled_at' => now()->subDays(2),
            ]);

        $response = $this->getJson('/api/matches');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');

        $response->assertJsonFragment([
            'id' => $scheduled->id,
            'status' => 'scheduled',
            'home_team' => [
                'id' => $home->id,
                'name' => 'Alpha FC',
            ],
            'away_team' => [
                'id' => $away->id,
                'name' => 'Bravo FC',
            ],
            'home_score' => null,
            'away_score' => null,
        ]);

        $response->assertJsonFragment([
            'id' => $completed->id,
            'status' => 'completed',
            'home_score' => 2,
            'away_score' => 1,
        ]);
    }

    public function test_match_can_be_scheduled_through_api(): void
    {
        $home = Team::factory()->create();
        $away = Team::factory()->create();

        $payload = [
            'home_team_id' => $home->id,
            'away_team_id' => $away->id,
            'scheduled_at' => now()->addDays(4)->toAtomString(),
        ];

        $response = $this->postJson('/api/matches', $payload);

        $response->assertCreated();
        $response->assertJsonPath('data.home_team.id', $home->id);
        $response->assertJsonPath('data.away_team.id', $away->id);
        $response->assertJsonPath('data.status', 'scheduled');

        $this->assertDatabaseHas('matches', [
            'home_team_id' => $home->id,
            'away_team_id' => $away->id,
        ]);
    }
}
