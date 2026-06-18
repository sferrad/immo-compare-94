"use client"

import { useCommunes } from "../hooks/useApi"

interface Props {
  selected: string[]
  onChange: (communes: string[]) => void
}

export default function CommuneSelector({ selected, onChange }: Props) {
  const { communes, loading } = useCommunes()

  function toggle(commune: string) {
    if (selected.includes(commune)) {
      onChange(selected.filter(c => c !== commune))
    } else if (selected.length < 5) {
      onChange([...selected, commune])
    }
  }

  if (loading) return <p className="text-gray-400">Chargement des communes...</p>

  return (
    <div>
      <p className="text-sm text-gray-500 mb-3">
        Sélectionnez jusqu'à 5 communes ({selected.length}/5)
      </p>
      <div className="flex flex-wrap gap-2">
        {communes.map(commune => (
          <button
            key={commune}
            onClick={() => toggle(commune)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              selected.includes(commune)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
            }`}
          >
            {commune}
          </button>
        ))}
      </div>
    </div>
  )
}