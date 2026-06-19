"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const API_URL = "http://localhost:8001"

interface Props {
  statsData: any[]
}

export default function Map({ statsData }: Props) {
  const [cadastre, setCadastre] = useState<any>(null)

  useEffect(() => {
    fetch(`${API_URL}/cadastre`)
      .then(res => res.json())
      .then(data => setCadastre(data))
  }, [])

  function getColor(prixM2: number) {
    if (prixM2 > 8000) return "#b91c1c"
    if (prixM2 > 6500) return "#ef4444"
    if (prixM2 > 5000) return "#f97316"
    if (prixM2 > 3500) return "#eab308"
    return "#22c55e"
  }

  function styleFeature(feature: any) {
    const nom = (feature.properties.nom || "").toUpperCase()
    const stat = statsData.find(s => s.commune.toUpperCase() === nom)
    return {
      fillColor: stat ? getColor(stat.prix_m2_moyen) : "#e5e7eb",
      fillOpacity: stat ? 0.7 : 0.15,
      color: "#fff",
      weight: 1
    }
  }

  if (!cadastre) return <p className="text-gray-400">Chargement de la carte...</p>

  return (
    <MapContainer
      center={[48.79, 2.47]}
      zoom={11}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={cadastre} style={styleFeature} />
    </MapContainer>
  )
}