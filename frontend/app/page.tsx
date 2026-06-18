"use client"

import { useState } from "react"
import CommuneSelector from "./components/CommuneSelector"
import CompareTable from "./components/CompareTable"
import { useCompare } from "./hooks/useApi"

export default function Home() {
  const [selected, setSelected] = useState<string[]>([])
  const { data, loading } = useCompare(selected)

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Immo Compare 94
      </h1>
      <p className="text-gray-500 mb-8">
        Comparez le marché immobilier des communes du Val-de-Marne
      </p>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Sélectionnez des communes
        </h2>
        <CommuneSelector selected={selected} onChange={setSelected} />
      </div>

      {selected.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Comparaison
          </h2>
          {loading ? (
            <p className="text-gray-400">Chargement...</p>
          ) : (
            <CompareTable data={data} />
          )}
        </div>
      )}
    </main>
  )
}