import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonList,
  IonNote,
  IonSpinner,
  IonText,
  IonModal,
  IonInput,
  IonButtons,
} from '@ionic/angular/standalone';
import { finalize } from 'rxjs';
import type { RefresherCustomEvent } from '@ionic/angular';
import { LeagueApiService } from '../services/league-api.service';
import { Match } from '../models/match';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonList,
    IonNote,
    IonSpinner,
    IonText,
  IonModal,
  IonInput,
  IonButtons,
  ],
})
export class Tab1Page implements OnInit {
  private readonly api = inject(LeagueApiService);
  private readonly fb = inject(FormBuilder);

  // Señales para reflejar estados de carga, selecciones y mensajes transversales.
  protected readonly matches = signal<Match[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly info = signal<string | null>(null);
  protected readonly reporting = signal(false);
  protected readonly modalOpen = signal(false);
  protected readonly selectedMatch = signal<Match | null>(null);

  // Formulario controlado que aprovecha validaciones síncronas de Angular.
  protected readonly form = this.fb.nonNullable.group({
    home_score: [0, [Validators.required, Validators.min(0)]],
    away_score: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.loadMatches();
  }

  protected loadMatches(event?: RefresherCustomEvent): void {
    if (!event) {
      this.loading.set(true);
    }

    this.error.set(null);

    // El refresco reutiliza la misma lógica sin duplicar suscripciones.
    this.api
      .getMatches()
      .pipe(
        finalize(() => {
          if (event) {
            event.target.complete();
          } else {
            this.loading.set(false);
          }
        })
      )
      .subscribe({
        next: (matches) => this.matches.set(matches),
        error: () => this.error.set('No se pudieron cargar los partidos. Intenta de nuevo.'),
      });
  }

  protected openModal(match: Match): void {
    // Se precarga el marcador existente para permitir correcciones.
    this.selectedMatch.set(match);
    this.form.setValue({
      home_score: match.home_score ?? 0,
      away_score: match.away_score ?? 0,
    });
    this.modalOpen.set(true);
    this.info.set(null);
  }

  protected closeModal(): void {
    this.modalOpen.set(false);
    this.selectedMatch.set(null);
    this.form.reset({
      home_score: 0,
      away_score: 0,
    });
  }

  protected submitResult(): void {
    if (this.form.invalid || this.reporting()) {
      this.form.markAllAsTouched();
      return;
    }

    const match = this.selectedMatch();
    if (!match) {
      return;
    }

    this.reporting.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();
    const homeScore = Number(raw.home_score);
    const awayScore = Number(raw.away_score);

    // Se delega la persistencia al servicio y se refresca la vista al concluir.
    this.api
      .reportResult(match.id, homeScore, awayScore)
      .pipe(finalize(() => this.reporting.set(false)))
      .subscribe({
        next: () => {
          this.info.set('Resultado actualizado correctamente.');
          this.closeModal();
          this.loadMatches();
        },
        error: () => this.error.set('No se pudo guardar el resultado. Intenta de nuevo.'),
      });
  }
}
