// Shared price color scale so the map, chart, table and legend stay coherent.

export interface Stats {
  commune: string
  nb_transactions: number
  prix_m2_moyen: number
  prix_m2_median: number
  prix_moyen: number
}

export const PRICE_SCALE = [
  { max: 3500, color: "#22c55e", label: "< 3 500" },
  { max: 5000, color: "#84cc16", label: "3 500 – 5 000" },
  { max: 6500, color: "#eab308", label: "5 000 – 6 500" },
  { max: 8000, color: "#f97316", label: "6 500 – 8 000" },
  { max: Infinity, color: "#dc2626", label: "> 8 000" },
] as const

export function getPriceColor(prixM2: number): string {
  for (const step of PRICE_SCALE) {
    if (prixM2 <= step.max) return step.color
  }
  return PRICE_SCALE[PRICE_SCALE.length - 1].color
}

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

const num = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })

export function formatEuro(value: number): string {
  return eur.format(value)
}

export function formatNumber(value: number): string {
  return num.format(value)
}

export function formatCompactEuro(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)} M€`
  if (value >= 1_000) return `${Math.round(value / 1000)} k€`
  return formatEuro(value)
}
