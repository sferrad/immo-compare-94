"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import type { Feature, GeoJsonObject } from "geojson"
import type { Layer, PathOptions, LeafletMouseEvent, Path } from "leaflet"
import { Stats, getPriceColor, PRICE_SCALE, formatEuro } from "../lib/prices"

const API_URL = "http://localhost:8001"

interface Props {
  statsData: Stats[]
  selected: string[]
}

export default function Map({ statsData, selected }: Props) {
  const [cadastre, setCadastre] = useState<GeoJsonObject | null>(null)
  const selectedUpper = selected.map((s) => s.toUpperCase())

  useEffect(() => {
    fetch(`${API_URL}/cadastre`)
      .then((res) => res.json())
      .then((data) => setCadastre(data))
      .catch(() => setCadastre(null))
  }, [])

  function featureName(feature: Feature): string {
    const props = (feature.properties ?? {}) as { nom?: string }
    return props.nom || "Commune"
  }

  function styleFeature(feature?: Feature): PathOptions {
    const nom = feature ? featureName(feature).toUpperCase() : ""
    const stat = statsData.find((s) => s.commune.toUpperCase() === nom)
    const isSelected = selectedUpper.includes(nom)
    return {
      fillColor: stat ? getPriceColor(stat.prix_m2_moyen) : "#cbd5e1",
      fillOpacity: stat ? 0.78 : isSelected ? 0.35 : 0.12,
      color: isSelected ? "#0b1120" : "#ffffff",
      weight: isSelected ? 2.5 : 1,
    }
  }

  function onEachFeature(feature: Feature, layer: Layer) {
    const nom = featureName(feature)
    const stat = statsData.find((s) => s.commune.toUpperCase() === nom.toUpperCase())
    const label = stat
      ? `<strong>${nom}</strong><br/>${formatEuro(stat.prix_m2_moyen)} /m²`
      : `<strong>${nom}</strong>`
    layer.bindTooltip(label, { className: "immo-tip", sticky: true })
    layer.on({
      mouseover: (e: LeafletMouseEvent) => (e.target as Path).setStyle({ weight: 3, fillOpacity: 0.9 }),
      mouseout: (e: LeafletMouseEvent) => (e.target as Path).setStyle(styleFeature(feature)),
    })
  }

  if (!cadastre) {
    return (
      <div className="grid h-[440px] w-full place-items-center rounded-2xl bg-slate-100">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="skeleton h-12 w-12 rounded-full" />
          <p className="text-sm">Chargement de la carte…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200">
      <MapContainer
        center={[48.79, 2.47]}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "440px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        <GeoJSON
          key={statsData.map((s) => s.commune).join(",") + selected.join(",")}
          data={cadastre}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Prix au m²
        </p>
        <div className="space-y-1">
          {PRICE_SCALE.map((step) => (
            <div key={step.label} className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="h-3 w-3 rounded-sm" style={{ background: step.color }} />
              {step.label} €
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
