import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Team } from '../models/team';
import { Standing } from '../models/standing';
import { environment } from '../../environments/environment';
import { Match } from '../models/match';

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class LeagueApiService {
  private readonly http = inject(HttpClient);
  // Todas las rutas se construyen a partir de este origen configurable.
  private readonly baseUrl = environment.apiUrl;

  getTeams(): Observable<Team[]> {
    return this.http
      .get<ApiResponse<Team[]>>(`${this.baseUrl}/api/teams`)
      .pipe(map((response) => response.data));
  }

  createTeam(name: string): Observable<Team> {
    return this.http
      .post<ApiResponse<Team>>(`${this.baseUrl}/api/teams`, { name })
      .pipe(map((response) => response.data));
  }

  getStandings(): Observable<Standing[]> {
    return this.http
      .get<ApiResponse<Standing[]>>(`${this.baseUrl}/api/standings`)
      .pipe(map((response) => response.data));
  }

  /**
   * Programa un nuevo fixture conservando el formato esperado por la API.
   */
  createMatch(homeTeamId: number, awayTeamId: number, scheduledAt?: string | null): Observable<Match> {
    return this.http
      .post<ApiResponse<Match>>(`${this.baseUrl}/api/matches`, {
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        scheduled_at: scheduledAt ?? null,
      })
      .pipe(map((response) => response.data));
  }

  /**
   * Elimina un equipo y espera confirmación 204 sin contenido.
   */
  deleteTeam(teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/teams/${teamId}`);
  }
}
