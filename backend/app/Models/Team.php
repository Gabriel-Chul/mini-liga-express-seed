<?php

namespace App\Models;

use App\Models\LeagueMatch;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    public function homeMatches(): HasMany
    {
        // Partidos donde el club actúa como local.
        return $this->hasMany(LeagueMatch::class, 'home_team_id');
    }

    public function awayMatches(): HasMany
    {
        // Partidos donde el club figura como visitante.
        return $this->hasMany(LeagueMatch::class, 'away_team_id');
    }
}
