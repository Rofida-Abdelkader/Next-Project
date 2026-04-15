"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"

interface SparklineProps {
  data: number[]
  color?: string
}

export function Sparkline({ data, color = "#818cf8" }: SparklineProps) {
  // Format data for Recharts
  const chartData = data.map((value, index) => ({ value, index }))

  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
