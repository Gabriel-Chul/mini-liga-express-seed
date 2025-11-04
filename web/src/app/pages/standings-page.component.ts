import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { LeagueApiService } from '../services/league-api.service';
import { Standing } from '../models/standing';

@Component({
  selector: 'app-standings-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standings-page.component.html',
  styleUrl: './standings-page.component.css'
})
export class StandingsPageComponent implements OnInit {
  private readonly api = inject(LeagueApiService);

  protected readonly standings = signal<Standing[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadStandings();
  }

  protected loadStandings(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .getStandings()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (table) => this.standings.set(table),
        error: () => this.error.set('No se pudo cargar la clasificación. Intenta de nuevo.'),
      });
  }
}
