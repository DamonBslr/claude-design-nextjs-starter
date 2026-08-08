"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  type ChartConfig,
} from "@workspace/ui/components/chart"

const activityData = [
  { month: "Dec", activity: 186 },
  { month: "Jan", activity: 305 },
  { month: "Feb", activity: 237 },
  { month: "Mar", activity: 273 },
  { month: "Apr", activity: 209 },
  { month: "May", activity: 314 },
]

const chartConfig = {
  activity: {
    label: "Activity",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function ActivityBarChart({ className }: { className?: string }) {
  return (
    <ChartContainer config={chartConfig} className={className}>
      <BarChart accessibilityLayer data={activityData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <Bar
          dataKey="activity"
          fill="var(--color-activity)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}

export { ActivityBarChart }
