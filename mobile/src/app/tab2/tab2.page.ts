import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonText,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import type { RefresherCustomEvent } from '@ionic/angular';
import { finalize } from 'rxjs';
import { LeagueApiService } from '../services/league-api.service';
import { Standing } from '../models/standing';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonSpinner,
    IonText,
    IonButton,
    IonButtons,
  ]
})
export class Tab2Page implements OnInit {
  private readonly api = inject(LeagueApiService);

  protected readonly standings = signal<Standing[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadStandings();
  }

  protected loadStandings(event?: RefresherCustomEvent): void {
    if (!event) {
      this.loading.set(true);
    }

    this.error.set(null);

    this.api
      .getStandings()
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
        next: (table) => this.standings.set(table),
        error: () => this.error.set('No se pudo cargar la clasificación. Intenta de nuevo.'),
      });
  }
}
