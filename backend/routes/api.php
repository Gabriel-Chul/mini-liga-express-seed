<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\MatchController;

// GET /api/teams -> Listar equipos
Route::get('/teams', [TeamController::class, 'index']);

// POST /api/teams -> Crear un equipo
Route::post('/teams', [TeamController::class, 'store']);

// DELETE /api/teams/{team} -> Eliminar un equipo
Route::delete('/teams/{team}', [TeamController::class, 'destroy']);

// GET /api/matches -> Listar partidos
Route::get('/matches', [MatchController::class, 'index']);

// POST /api/matches -> Crear un partido programado
Route::post('/matches', [MatchController::class, 'store']);

// GET /api/standings -> Ver la clasificación
Route::get('/standings', [TeamController::class, 'standings']);

// POST /api/matches/{id}/result -> Reportar un resultado
Route::post('/matches/{id}/result', [MatchController::class, 'updateResult']);