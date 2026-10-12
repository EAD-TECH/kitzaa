"use client";
import type { StatsCardProps } from "@/components/shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";

function formatMonth(value: string) {
  const [year, month] = value.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "tr-TR",
    { month: "short" },
  );
}

export default function StatsCard({ data }: { data: StatsCardProps }) {

  

  if (!data.trends || data.trends.length === 0) {
    return (
      <Card className="h-full w-full rounded-xl border bg-card text-card-foreground shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {data.title}
          </CardTitle>
          {data.icon && (
            <div className="text-muted-foreground">{data.icon}</div>
          )}
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{data.value}</div>
          {data.description && (
            <p className="text-xs text-muted-foreground mt-1">
              {data.description}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <HoverCard >
      <HoverCardTrigger
        render={
          <Card className="h-full w-full rounded-xl border bg-card text-card-foreground shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {data.title}
              </CardTitle>
              {data.icon && (
                <div className="text-muted-foreground">{data.icon}</div>
              )}
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{data.value}</div>
              {data.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {data.description}
                </p>
              )}
            </CardContent>
          </Card>
        }
      />
      <HoverCardContent className="w-64" side="top">
        <div className="h-25 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={data.trends}>
              <XAxis
                dataKey="month"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={16}
                tickFormatter={(value) => formatMonth(String(value))}
              />
              <Bar
                className="fill-primary"
                dataKey={data.trendKey}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
