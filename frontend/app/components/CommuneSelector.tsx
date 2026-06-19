"use client"

import { useMemo, useState } from "react"
import { useCommunes } from "../hooks/useApi"

interface Props {
  selected: string[]
  onChange: (communes: string[]) => void
}

const MAX = 5

export default function CommuneSelector({ selected, onChange }: Props) {
  const { communes, loading } = useCommunes()
  const [query, setQuery] = useState("")

  function toggle(commune: string) {
    if (selected.includes(commune)) {
      onChange(selected.filter((c) => c !== commune))
    } else if (selected.length < MAX) {
      onChange([...selected, commune])
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return communes
    return communes.filter((c) => c.toLowerCase().includes(q))
  }, [communes, query])

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-9 rounded-full"
            style={{ width: `${70 + ((i * 23) % 70)}px` }}
          />
        ))}
      </div>
    )
  }

  const full = selected.length >= MAX

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une commune…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium text-slate-500">
            <span className="text-indigo-600 font-semibold">{selected.length}</span> / {MAX} sélectionnées
          </span>
          {selected.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex max-h-56 flex-wrap gap-2 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="py-4 text-sm text-slate-400">Aucune commune ne correspond à « {query} ».</p>
        )}
        {filtered.map((commune) => {
          const isSelected = selected.includes(commune)
          const disabled = !isSelected && full
          return (
            <button
              key={commune}
              onClick={() => toggle(commune)}
              disabled={disabled}
              className={`group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                isSelected
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : disabled
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700"
              }`}
            >
              {commune}
              {isSelected && (
                <svg className="h-3.5 w-3.5 opacity-80 transition group-hover:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
