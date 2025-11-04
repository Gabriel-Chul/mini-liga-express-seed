<?php

namespace Database\Factories;

use App\Models\LeagueMatch;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LeagueMatch>
 */
class LeagueMatchFactory extends Factory
{
    /**
     * @var class-string<LeagueMatch>
     */
    protected $model = LeagueMatch::class;

    public function definition(): array
    {
        return [
            'home_team_id' => Team::factory(),
            'away_team_id' => Team::factory(),
            'scheduled_at' => $this->faker->dateTimeBetween('+1 days', '+2 weeks'),
        ];
    }

    public function withResult(int $homeScore, int $awayScore): self
    {
        return $this->state(fn () => [
            'home_score' => $homeScore,
            'away_score' => $awayScore,
            'played_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ]);
    }
}
