import { TeamSummary } from './team-summary';

export type MatchStatus = 'scheduled' | 'completed';

export interface Match {
  id: number;
  status: MatchStatus;
  home_team: TeamSummary;
  away_team: TeamSummary;
  home_score: number | null;
  away_score: number | null;
  scheduled_at: string | null;
  played_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}
