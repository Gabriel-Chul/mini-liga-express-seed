import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { LeagueApiService } from '../services/league-api.service';
import { Team } from '../models/team';
import { Match } from '../models/match';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teams-page.component.html',
  styleUrl: './teams-page.component.css'
})
export class TeamsPageComponent implements OnInit {
  private readonly api = inject(LeagueApiService);
  private readonly fb = inject(FormBuilder);

  // Estado reactivo para sincronizar listados y banderas de manera explícita.
  protected readonly teams = signal<Team[]>([]);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly scheduling = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);
  protected readonly matchError = signal<string | null>(null);
  protected readonly matchSuccess = signal<string | null>(null);
  protected readonly deletingId = signal<number | null>(null);
  protected readonly deleteError = signal<string | null>(null);

  // Formulario minimalista para el alta inmediata de equipos.
  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
  });

  // Formulario independiente para programar partidos con selectores controlados.
  protected readonly matchForm = this.fb.group({
    home_team_id: [null, [Validators.required]],
    away_team_id: [null, [Validators.required]],
    scheduled_at: [''],
  });

  ngOnInit(): void {
    this.loadTeams();
  }

  protected get isFormInvalid(): boolean {
    // Using a getter keeps the button binding in sync with Angular's change detection cycle.
    return this.form.invalid || this.submitting();
  }

  protected get isMatchFormInvalid(): boolean {
    return this.matchForm.invalid || this.scheduling();
  }

  protected loadTeams(): void {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);
    this.deleteError.set(null);

    // La carga inicial o manual asegura que ambos formularios operen con datos actualizados.
    this.api
      .getTeams()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (teams) => this.teams.set(teams),
        error: () => this.error.set('No se pudieron cargar los equipos. Intenta de nuevo.'),
      });
  }

  protected createTeam(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    this.success.set(null);

    const { name } = this.form.getRawValue();

    this.api
      .createTeam(name)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (team) => {
          // Se añade el equipo manteniendo el orden alfabético sin requerir recarga completa.
          const updated = [...this.teams(), team].sort((a, b) => a.name.localeCompare(b.name));
          this.teams.set(updated);
          this.form.reset({ name: '' });
          this.success.set('Equipo registrado correctamente. Ya puedes programar sus partidos.');
        },
        error: (response) => {
          if (response?.error?.errors?.name?.[0]) {
            this.error.set(response.error.errors.name[0]);
          } else {
            this.error.set('No se pudo crear el equipo. Intenta de nuevo.');
          }
        },
      });
  }

  /**
   * Agenda un nuevo partido y expone feedback consistente en la vista.
   */
  protected scheduleMatch(): void {
    if (this.matchForm.invalid || this.scheduling()) {
      this.matchForm.markAllAsTouched();
      return;
    }

    const raw = this.matchForm.getRawValue();

    this.matchError.set(null);
    this.matchSuccess.set(null);

    if (!raw.home_team_id || !raw.away_team_id) {
      this.matchForm.markAllAsTouched();
      return;
    }

    if (raw.home_team_id === raw.away_team_id) {
      this.matchError.set('Selecciona dos equipos distintos para el partido.');
      return;
    }

    this.scheduling.set(true);

    const scheduledAt = raw.scheduled_at
      ? new Date(raw.scheduled_at).toISOString()
      : null;

    this.api
      .createMatch(raw.home_team_id, raw.away_team_id, scheduledAt)
      .pipe(finalize(() => this.scheduling.set(false)))
      .subscribe({
        next: (match: Match) => {
          // Mensaje contextual que comunica la acción exitosa a la persona usuaria.
          this.matchSuccess.set(
            `Partido ${match.home_team.name} vs ${match.away_team.name} programado correctamente.`
          );
          this.matchForm.reset({
            home_team_id: null,
            away_team_id: null,
            scheduled_at: '',
          });
        },
        error: () => this.matchError.set('No se pudo programar el partido. Intenta nuevamente.'),
      });
  }

  protected deleteTeam(team: Team): void {
    if (this.deletingId()) {
      return;
    }

    const accepted = confirm(`¿Eliminar definitivamente a ${team.name}?`);
    if (!accepted) {
      return;
    }

    this.deletingId.set(team.id);
    this.deleteError.set(null);
    this.success.set(null);

    this.api
      .deleteTeam(team.id)
      .pipe(finalize(() => this.deletingId.set(null)))
      .subscribe({
        next: () => {
          this.teams.set(this.teams().filter((current) => current.id !== team.id));
          this.success.set('Equipo eliminado correctamente.');
        },
        error: () => this.deleteError.set('No se pudo eliminar el equipo. Reintenta.'),
      });
  }
}
