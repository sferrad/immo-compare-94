"use client"

interface Stats {
  commune: string
  nb_transactions: number
  prix_m2_moyen: number
  prix_m2_median: number
  prix_moyen: number
}

interface Props {
  data: Stats[]
}

export default function CompareTable({ data }: Props) {
  if (data.length === 0) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 text-left">Commune</th>
            <th className="p-3 text-right">Prix m² moyen</th>
            <th className="p-3 text-right">Prix m² médian</th>
            <th className="p-3 text-right">Prix moyen</th>
            <th className="p-3 text-right">Transactions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.commune} className={`text-gray-900 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <td className="p-3 font-medium">{row.commune}</td>
              <td className="p-3 text-right">{row.prix_m2_moyen.toLocaleString()} €/m²</td>
              <td className="p-3 text-right">{row.prix_m2_median.toLocaleString()} €/m²</td>
              <td className="p-3 text-right">{row.prix_moyen.toLocaleString()} €</td>
              <td className="p-3 text-right">{row.nb_transactions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}