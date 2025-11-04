<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeagueMatch extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'matches';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'home_team_id',
        'away_team_id',
        'home_score',
        'away_score',
        'scheduled_at',
        'played_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_at' => 'datetime',
        'played_at' => 'datetime',
    ];

    public function homeTeam(): BelongsTo
    {
        // Relación explícita para acceder al club local sin ambigüedad en el alias.
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    public function awayTeam(): BelongsTo
    {
        // Simetría de la relación anterior para el club visitante.
        return $this->belongsTo(Team::class, 'away_team_id');
    }

    public function scopeCompleted(Builder $query): Builder
    {
        // Facilita filtrar únicamente los partidos con marcador registrado.
        return $query->whereNotNull('home_score')->whereNotNull('away_score');
    }
}
