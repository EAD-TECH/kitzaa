export interface DashboardTrendPoint {
  month: string;
  events: number;
  participants: number;
}

export interface DashboardSummaryDTO {
  pendingApprovals: number;
  totalEvents: number;
  totalParticipants: number;
  trends: DashboardTrendPoint[];
}

export interface GetDashboardSummaryResponse {
  error: false;
  summary: DashboardSummaryDTO;
}