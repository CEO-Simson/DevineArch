import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

type GivingRow = { fundId: string; fundName?: string; total: number; count: number }

export default function ReportsPage() {
  const giving = useQuery({
    queryKey: ['reports-giving'],
    queryFn: () => api<{ items: GivingRow[]; grandTotal: number }>(`/api/reports/giving/summary`),
  })

  return (
    <div className="space-y-6 w-full">
      <div className="card p-4">
        <h3 className="font-semibold mb-3">Giving Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-500">
              <tr>
                <th className="py-2">Fund</th>
                <th className="py-2">Total</th>
                <th className="py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {giving.data?.items.map((r) => (
                <tr key={r.fundId} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="py-2">{r.fundName || r.fundId}</td>
                  <td className="py-2">${'{'}r.total.toFixed(2){'}'}</td>
                  <td className="py-2">{r.count}</td>
                </tr>
              ))}
              {giving.data && (
                <tr className="border-t-2 border-neutral-300 dark:border-neutral-700 font-semibold">
                  <td className="py-2">Grand Total</td>
                  <td className="py-2">${'{'}giving.data.grandTotal.toFixed(2){'}'}</td>
                  <td className="py-2"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
