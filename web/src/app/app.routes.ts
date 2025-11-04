import { Routes } from '@angular/router';
import { TeamsPageComponent } from './pages/teams-page.component';
import { StandingsPageComponent } from './pages/standings-page.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'teams' },
	{ path: 'teams', component: TeamsPageComponent },
	{ path: 'standings', component: StandingsPageComponent },
	{ path: '**', redirectTo: 'teams' },
];
