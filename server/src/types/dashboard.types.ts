export interface DashboardTrendPoint {
  month: string;
  events: number;
  participants: number;
}


export interface DashboarSummaryDTO {
  pendingApprovals:number
  totalEvents:number
  totalParticipants:number
  trends:DashboardTrendPoint[]
}
