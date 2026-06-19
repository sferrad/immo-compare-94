"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import CommuneSelector from "./components/CommuneSelector"
import CompareTable from "./components/CompareTable"
import CompareChart from "./components/CompareChart"
import StatsCards from "./components/StatsCards"
import { useCompare } from "./hooks/useApi"

const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => <div className="skeleton h-[440px] w-full rounded-2xl" />,
})

function SectionCard({
  children,
  step,
  title,
  subtitle,
}: {
  children: React.ReactNode
  step?: string
  title: string
  subtitle?: string
}) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm shadow-slate-200/50 backdrop-blur-sm sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        {step && (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm shadow-indigo-300">
            {step}
          </span>
        )}
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

export default function Home() {
  const [selected, setSelected] = useState<string[]>([])
  const { data, loading } = useCompare(selected)
  const hasSelection = selected.length > 0

  return (
    <div className="flex min-h-full flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-300">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 11.5 12 4l9 7.5M5 10v9h5v-5h4v5h5v-9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-800">Immo Compare</p>
              <p className="text-[11px] font-medium text-indigo-500">Val-de-Marne · 94</p>
            </div>
          </div>
          <a
            href="https://app.dvf.etalab.gouv.fr/"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 sm:block"
          >
            Données DVF · Etalab
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-20 pt-10 sm:px-8">
        {/* Hero */}
        <div className="mb-10 text-center sm:mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
            Marché immobilier en temps réel
          </span>
          <h1 className="mt-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-700 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Comparez l’immobilier
            <br className="hidden sm:block" /> du Val-de-Marne
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            Sélectionnez jusqu’à 5 communes et confrontez prix au m², prix médians et volumes de transactions, carte à l’appui.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <SectionCard step="1" title="Sélectionnez des communes" subtitle="Jusqu'à 5 communes à comparer">
            <CommuneSelector selected={selected} onChange={setSelected} />
          </SectionCard>

          {/* KPIs */}
          {hasSelection && !loading && data.length > 0 && <StatsCards data={data} />}

          {/* Map + analysis */}
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <SectionCard title="Carte du Val-de-Marne" subtitle="Survolez une commune pour le détail">
                <Map statsData={data} selected={selected} />
              </SectionCard>
            </div>

            <div className="lg:col-span-2">
              <SectionCard step="2" title="Analyse" subtitle="Vos communes sélectionnées">
                {!hasSelection ? (
                  <EmptyState />
                ) : loading ? (
                  <ChartSkeleton />
                ) : (
                  <CompareChart data={data} />
                )}
              </SectionCard>
            </div>
          </div>

          {/* Detailed table */}
          {hasSelection && (
            <SectionCard step="3" title="Tableau détaillé" subtitle="Cliquez sur une colonne pour trier">
              {loading ? <TableSkeleton /> : <CompareTable data={data} />}
            </SectionCard>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-6 text-center text-xs text-slate-400">
        Immo Compare 94 · Données issues des demandes de valeurs foncières (DVF)
      </footer>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-indigo-400 shadow-sm">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 7v5M21 7h-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <p className="mt-4 text-sm font-medium text-slate-600">Aucune commune sélectionnée</p>
      <p className="mt-1 max-w-xs text-xs text-slate-400">
        Choisissez des communes ci-dessus pour afficher le graphique comparatif et les statistiques.
      </p>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div>
      <div className="mb-5 flex justify-between">
        <div className="skeleton h-9 w-40 rounded-lg" />
        <div className="skeleton h-9 w-44 rounded-xl" />
      </div>
      <div className="flex h-64 items-end gap-3">
        {[60, 85, 45, 70, 55].map((h, i) => (
          <div key={i} className="skeleton flex-1 rounded-t-lg" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}
