"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { DashboardTrendPoint } from "@/features/dashboard/dashboard";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

const chartConfig = {
  events: { label: "Etkinlik", color: "var(--chart-2)" },
  participants: { label: "Katılımcı", color: "var(--chart-1)" },
} satisfies ChartConfig;

function formatMonth(value: string, withYear = false) {
  const [year, month] = value.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "tr-TR",
    withYear ? { month: "short", year: "numeric" } : { month: "short" },
  );
}

export default function OverviewChart({
  trends,
}: {
  trends: DashboardTrendPoint[];
}) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("events");

  const total = React.useMemo(
    () => ({
      events: trends.reduce((acc, curr) => acc + curr.events, 0),
      participants: trends.reduce((acc, curr) => acc + curr.participants, 0),
    }),
    [trends],
  );

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Etkinlik Kullanıcı Analizi</CardTitle>
          <CardDescription>Son 12 ay</CardDescription>
        </div>
        <div className="flex">
          {(["events", "participants"] as const).map((key) => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={trends}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatMonth(String(value))}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => formatMonth(String(value), true)}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
