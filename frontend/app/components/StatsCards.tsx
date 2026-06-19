"use client"

import { Stats, formatEuro, formatNumber, formatCompactEuro } from "../lib/prices"

interface Props {
  data: Stats[]
}

export default function StatsCards({ data }: Props) {
  if (data.length === 0) return null

  const cheapest = data.reduce((a, b) => (a.prix_m2_moyen < b.prix_m2_moyen ? a : b))
  const priciest = data.reduce((a, b) => (a.prix_m2_moyen > b.prix_m2_moyen ? a : b))
  const avgM2 = Math.round(data.reduce((s, d) => s + d.prix_m2_moyen, 0) / data.length)
  const totalTx = data.reduce((s, d) => s + d.nb_transactions, 0)
  const spread = priciest.prix_m2_moyen - cheapest.prix_m2_moyen

  const cards = [
    {
      label: "Prix m² moyen",
      value: `${formatEuro(avgM2)}`,
      hint: `sur ${data.length} commune${data.length > 1 ? "s" : ""}`,
      accent: "text-indigo-600",
      ring: "ring-indigo-100",
      icon: (
        <path d="M3 17l6-6 4 4 8-8M21 7v5M21 7h-5" strokeLinecap="round" strokeLinejoin="round" />
      ),
    },
    {
      label: "La plus abordable",
      value: cheapest.commune,
      hint: `${formatEuro(cheapest.prix_m2_moyen)} /m²`,
      accent: "text-emerald-600",
      ring: "ring-emerald-100",
      icon: <path d="M12 2 4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7l-8-5Z" strokeLinejoin="round" />,
    },
    {
      label: "La plus chère",
      value: priciest.commune,
      hint: `${formatEuro(priciest.prix_m2_moyen)} /m²`,
      accent: "text-rose-600",
      ring: "ring-rose-100",
      icon: <path d="M12 2v20M5 9l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />,
    },
    {
      label: "Écart de prix m²",
      value: formatCompactEuro(spread),
      hint: `${formatNumber(totalTx)} transactions au total`,
      accent: "text-amber-600",
      ring: "ring-amber-100",
      icon: <path d="M8 7h12M8 7l3-3M8 7l3 3M16 17H4m12 0-3-3m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
          style={{ animation: "var(--animate-fade-up)", animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{c.label}</p>
            <span className={`grid h-8 w-8 place-items-center rounded-lg bg-slate-50 ring-1 ${c.ring} ${c.accent}`}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {c.icon}
              </svg>
            </span>
          </div>
          <p className={`mt-3 truncate text-xl font-bold sm:text-2xl ${c.accent}`}>{c.value}</p>
          <p className="mt-0.5 text-xs text-slate-400">{c.hint}</p>
        </div>
      ))}
    </div>
  )
}
