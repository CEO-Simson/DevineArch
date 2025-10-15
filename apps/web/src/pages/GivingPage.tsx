import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import { ErrorList } from '../components/ErrorList'

type Fund = { _id: string; name: string; restricted?: boolean; active?: boolean }
type Donation = { _id: string; amount: number; method: 'cash'|'check'|'card'|'ach'; date: string; fundId: string; personId?: string }

export default function GivingPage() {
  const qc = useQueryClient()
  const funds = useQuery({ queryKey: ['funds'], queryFn: () => api<{ items: Fund[] }>(`/api/giving/funds`) })
  const donations = useQuery({ queryKey: ['donations'], queryFn: () => api<{ items: Donation[] }>(`/api/giving/donations`) })

  const addFund = useMutation({
    mutationFn: (name: string) => api<Fund>(`/api/giving/funds`, { method: 'POST', body: JSON.stringify({ name }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['funds'] }),
  })

  const addDonation = useMutation({
    mutationFn: (data: { fundId: string; amount: number; method: Donation['method']; personId?: string }) =>
      api<Donation>(`/api/giving/donations`, { method: 'POST', body: JSON.stringify({ ...data }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['donations'] }),
  })

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-4">
          <h3 className="font-semibold mb-3">Funds</h3>
          <ul className="text-sm space-y-1 mb-3">
            {funds.data?.items.map((f) => (
              <li key={f._id} className="flex items-center justify-between">
                <span>{f.name}</span>
                <span className="text-neutral-500">{f.active ? 'Active' : 'Inactive'}</span>
              </li>
            ))}
          </ul>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget as HTMLFormElement)
              const name = String(f.get('name') || '')
              if (name) addFund.mutate(name)
              ;(e.currentTarget as HTMLFormElement).reset()
            }}
          >
            <input name="name" className="input" placeholder="New fund name" required />
            <button className="btn btn-primary" disabled={addFund.isPending}>Add</button>
          </form>
          {addFund.isError ? <div className="text-sm text-red-600">{(addFund.error as Error).message}<ErrorList error={addFund.error} /></div> : null}
        </div>

        <div className="lg:col-span-2 card p-4">
          <h3 className="font-semibold mb-3">Add Donation</h3>
          <form
            className="grid grid-cols-1 sm:grid-cols-4 gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget as HTMLFormElement)
              addDonation.mutate({
                fundId: String(f.get('fundId') || ''),
                amount: Number(f.get('amount') || 0),
                method: String(f.get('method') || 'cash') as any,
                personId: String(f.get('personId') || '') || undefined,
              })
              ;(e.currentTarget as HTMLFormElement).reset()
            }}
          >
            <select name="fundId" className="input" required>
              <option value="">Select fund</option>
              {funds.data?.items.map((f) => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
            <input name="amount" className="input" placeholder="Amount" type="number" step="0.01" required />
            <select name="method" className="input">
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="card">Card</option>
              <option value="ach">ACH</option>
            </select>
            <input name="personId" className="input" placeholder="Person ID (optional)" />
            <div className="sm:col-span-4">
              <button className="btn btn-primary" disabled={addDonation.isPending}>Save Donation</button>
            </div>
          </form>

          {addDonation.isError ? <div className="text-sm text-red-600 mt-2">{(addDonation.error as Error).message}<ErrorList error={addDonation.error} /></div> : null}

          <h3 className="font-semibold mt-6 mb-2">Recent Donations</h3>
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm">
            {donations.data?.items.map((d) => (
              <li key={d._id} className="py-2 flex items-center justify-between">
                <span>${'{'}d.amount.toFixed(2){'}'} — {d.method}</span>
                <span className="text-neutral-500">{new Date(d.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
