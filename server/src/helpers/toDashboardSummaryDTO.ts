
type MonthBucket = { _id: string; count: number };

type DashboardSummaryDTO = {
  pendingApprovals: number;
  totalEvents: number;
  totalParticipants: number;
  trends: Array<{
    month: string;
    events: number;
    participants: number;
  }>;
};

export function toDashboardSummaryDTO(input: {
  pendingApprovals: number;
  totalEvents: number;
  totalParticipants: number;
  eventTrends: MonthBucket[];
  participantTrends: MonthBucket[];
  months: string[];
}): DashboardSummaryDTO {
 
  const eventsByMonth = new Map(
    input.eventTrends?.map((row) => [row._id, row.count]) || [],
  );
  const participantsByMonth = new Map(
    input.participantTrends?.map((row) => [row._id, row.count]) || [],
  );

  return {
    pendingApprovals: input.pendingApprovals,
    totalEvents: input.totalEvents,
    totalParticipants: input.totalParticipants,
    trends: input.months.map((monthStr) => {
      
      return {
        month: monthStr,
        events: eventsByMonth.get(monthStr) ?? 0, 
        participants: participantsByMonth.get(monthStr) ?? 0,
      };
    }),
  };
}
