"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Stats, getPriceColor, formatEuro, formatNumber } from "../lib/prices"

interface Props {
  data: Stats[]
}

type MetricKey = "prix_m2_moyen" | "prix_moyen" | "nb_transactions"

const METRICS: { key: MetricKey; label: string; isPrice: boolean }[] = [
  { key: "prix_m2_moyen", label: "Prix m²", isPrice: true },
  { key: "prix_moyen", label: "Prix moyen", isPrice: true },
  { key: "nb_transactions", label: "Transactions", isPrice: false },
]

interface TooltipProps {
  active?: boolean
  payload?: { value: number; payload: Stats }[]
  isPrice: boolean
}

function CustomTooltip({ active, payload, isPrice }: TooltipProps) {
  if (!active || !payload?.length) return null
  const v = payload[0].value
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white shadow-xl">
      <p className="text-xs font-medium text-slate-300">{payload[0].payload.commune}</p>
      <p className="text-sm font-bold">{isPrice ? formatEuro(v) : `${formatNumber(v)} ventes`}</p>
    </div>
  )
}

export default function CompareChart({ data }: Props) {
  const [metric, setMetric] = useState<MetricKey>("prix_m2_moyen")
  if (data.length === 0) return null

  const active = METRICS.find((m) => m.key === metric)!
  const chartData = [...data].sort((a, b) => b[metric] - a[metric])

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Visualisation comparative</h3>
          <p className="text-sm text-slate-400">Classement décroissant des communes sélectionnées</p>
        </div>
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                metric === m.key
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barCategoryGap="28%">
            <XAxis
              dataKey="commune"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              interval={0}
              angle={chartData.length > 3 ? -12 : 0}
              textAnchor={chartData.length > 3 ? "end" : "middle"}
              height={chartData.length > 3 ? 46 : 28}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v) =>
                active.isPrice
                  ? v >= 1000
                    ? `${Math.round(v / 1000)}k`
                    : `${v}`
                  : `${v}`
              }
            />
            <Tooltip cursor={{ fill: "rgba(99,102,241,0.06)" }} content={<CustomTooltip isPrice={active.isPrice} />} />
            <Bar dataKey={metric} radius={[8, 8, 0, 0]} maxBarSize={84}>
              {chartData.map((d) => (
                <Cell
                  key={d.commune}
                  fill={active.isPrice ? getPriceColor(d.prix_m2_moyen) : "#6366f1"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
