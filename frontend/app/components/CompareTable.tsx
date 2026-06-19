"use client"

import { useState } from "react"
import { Stats, getPriceColor, formatEuro, formatNumber } from "../lib/prices"

interface Props {
  data: Stats[]
}

type SortKey = "commune" | "prix_m2_moyen" | "prix_m2_median" | "prix_moyen" | "nb_transactions"

const COLUMNS: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: "commune", label: "Commune", numeric: false },
  { key: "prix_m2_moyen", label: "Prix m² moyen", numeric: true },
  { key: "prix_m2_median", label: "Prix m² médian", numeric: true },
  { key: "prix_moyen", label: "Prix moyen", numeric: true },
  { key: "nb_transactions", label: "Transactions", numeric: true },
]

export default function CompareTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("prix_m2_moyen")
  const [asc, setAsc] = useState(false)

  if (data.length === 0) return null

  const minM2 = Math.min(...data.map((d) => d.prix_m2_moyen))
  const maxM2 = Math.max(...data.map((d) => d.prix_m2_moyen))

  const sorted = [...data].sort((a, b) => {
    if (sortKey === "commune") {
      return asc ? a.commune.localeCompare(b.commune) : b.commune.localeCompare(a.commune)
    }
    return asc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
  })

  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc((p) => !p)
    else {
      setSortKey(key)
      setAsc(false)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => toggleSort(col.key)}
                className={`cursor-pointer select-none border-b border-slate-200 bg-slate-50/80 px-4 py-3 font-semibold text-slate-500 first:rounded-tl-xl last:rounded-tr-xl ${
                  col.numeric ? "text-right" : "text-left"
                } transition hover:text-indigo-600`}
              >
                <span className={`inline-flex items-center gap-1 ${col.numeric ? "flex-row-reverse" : ""}`}>
                  {col.label}
                  <span className={`text-[10px] transition ${sortKey === col.key ? "text-indigo-500" : "text-slate-300"}`}>
                    {sortKey === col.key ? (asc ? "▲" : "▼") : "▾"}
                  </span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const isMin = row.prix_m2_moyen === minM2 && data.length > 1
            const isMax = row.prix_m2_moyen === maxM2 && data.length > 1
            return (
              <tr key={row.commune} className="group transition hover:bg-indigo-50/40">
                <td className="border-b border-slate-100 px-4 py-3 font-semibold text-slate-800">
                  <span className="inline-flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white"
                      style={{ background: getPriceColor(row.prix_m2_moyen) }}
                    />
                    {row.commune}
                    {isMin && (
                      <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                        Min
                      </span>
                    )}
                    {isMax && (
                      <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                        Max
                      </span>
                    )}
                  </span>
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-right font-semibold tabular-nums text-slate-900">
                  {formatEuro(row.prix_m2_moyen)}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-right tabular-nums text-slate-600">
                  {formatEuro(row.prix_m2_median)}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-right tabular-nums text-slate-600">
                  {formatEuro(row.prix_moyen)}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-right tabular-nums text-slate-600">
                  {formatNumber(row.nb_transactions)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
