import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Match } from '../models/match';
import { Standing } from '../models/standing';

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class LeagueApiService {
  private readonly http = inject(HttpClient);
  // Construimos las rutas a partir del entorno para reutilizar la app en distintos despliegues.
  private readonly baseUrl = environment.apiUrl;

  getMatches(): Observable<Match[]> {
    return this.http
      .get<ApiResponse<Match[]>>(`${this.baseUrl}/api/matches`)
      .pipe(map((response) => response.data));
  }

  reportResult(matchId: number, homeScore: number, awayScore: number): Observable<Match> {
    return this.http
      .post<ApiResponse<Match>>(`${this.baseUrl}/api/matches/${matchId}/result`, {
        home_score: homeScore,
        away_score: awayScore,
      })
      .pipe(map((response) => response.data));
  }

  getStandings(): Observable<Standing[]> {
    return this.http
      .get<ApiResponse<Standing[]>>(`${this.baseUrl}/api/standings`)
      .pipe(map((response) => response.data));
  }
}
