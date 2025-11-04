<?php

namespace Tests\Feature;

use App\Models\LeagueMatch;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StandingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_standings_order_and_stats_are_calculated_correctly(): void
    {
        $teamAlpha = Team::factory()->create(['name' => 'Alpha FC']);
        $teamBravo = Team::factory()->create(['name' => 'Bravo FC']);
        $teamCharlie = Team::factory()->create(['name' => 'Charlie FC']);

        $timestamp = now();

        LeagueMatch::create([
            'home_team_id' => $teamAlpha->id,
            'away_team_id' => $teamBravo->id,
            'home_score' => 2,
            'away_score' => 1,
            'played_at' => $timestamp->copy()->subDays(2),
            'scheduled_at' => $timestamp->copy()->subDays(2),
        ]);

        LeagueMatch::create([
            'home_team_id' => $teamCharlie->id,
            'away_team_id' => $teamAlpha->id,
            'home_score' => 1,
            'away_score' => 1,
            'played_at' => $timestamp->copy()->subDay(),
            'scheduled_at' => $timestamp->copy()->subDay(),
        ]);

        LeagueMatch::create([
            'home_team_id' => $teamBravo->id,
            'away_team_id' => $teamCharlie->id,
            'home_score' => 0,
            'away_score' => 3,
            'played_at' => $timestamp->copy(),
            'scheduled_at' => $timestamp->copy(),
        ]);

        $response = $this->getJson('/api/standings');

        $response->assertOk();

        $response->assertJsonPath('data.0.team_id', $teamCharlie->id);
        $response->assertJsonPath('data.0.points', 4);
        $response->assertJsonPath('data.0.goal_difference', 3);
        $response->assertJsonPath('data.1.team_id', $teamAlpha->id);
        $response->assertJsonPath('data.1.points', 4);
        $response->assertJsonPath('data.1.goal_difference', 1);
        $response->assertJsonPath('data.2.team_id', $teamBravo->id);
        $response->assertJsonPath('data.2.points', 0);

        $response->assertJsonPath('data.0.played', 2);
        $response->assertJsonPath('data.0.won', 1);
        $response->assertJsonPath('data.0.drawn', 1);
        $response->assertJsonPath('data.0.lost', 0);
        $response->assertJsonPath('data.0.goals_for', 4);
        $response->assertJsonPath('data.0.goals_against', 1);
    }
}
