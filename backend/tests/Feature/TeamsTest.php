<?php

namespace Tests\Feature;

use App\Models\LeagueMatch;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamsTest extends TestCase
{
    use RefreshDatabase;

    public function test_team_can_be_deleted_and_related_matches_are_removed(): void
    {
        $home = Team::factory()->create();
        $away = Team::factory()->create();

        LeagueMatch::factory()->withResult(1, 0)->create([
            'home_team_id' => $home->id,
            'away_team_id' => $away->id,
        ]);

        $response = $this->deleteJson('/api/teams/' . $home->id);

        $response->assertNoContent();

        $this->assertDatabaseMissing('teams', ['id' => $home->id]);
        $this->assertDatabaseCount('matches', 0);
    }
}
