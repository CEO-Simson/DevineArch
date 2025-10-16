import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export default function BillingPage() {
  const status = useQuery({ queryKey: ['subscription-status'], queryFn: () => api<any>('/api/subscriptions/status') })
  const pricing = useQuery({ queryKey: ['pricing'], queryFn: () => api<any>('/api/subscriptions/pricing') })

  const initiate = useMutation({
    mutationFn: (data: { type: 'superadmin'|'additional_admin'; paymentMethod: 'upi'|'card'|'netbanking'|'imps'|'wallet'; transactionId: string; upiId?: string; bank?: string }) =>
      api<any>('/api/subscriptions/initiate', { method: 'POST', body: JSON.stringify(data) }),
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing</h1>
      {status.data ? (
        <div className="card p-4">
          <div className="text-sm">Status: <strong>{status.data.state}</strong></div>
          {status.data.daysRemaining != null ? (<div className="text-sm text-neutral-600">Days remaining: {status.data.daysRemaining}</div>) : null}
          {status.data.daysPastDue != null ? (<div className="text-sm text-neutral-600">Days past due: {status.data.daysPastDue} / {status.data.graceDays}</div>) : null}
        </div>
      ) : null}

      <div className="card p-4">
        <h2 className="font-medium mb-2">Make Payment</h2>
        <form
          className="grid gap-2 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget as HTMLFormElement)
            const method = String(f.get('method') || 'upi') as any
            const txn = String(f.get('transactionId') || '')
            const upiId = String(f.get('upiId') || '') || undefined
            const bank = String(f.get('bank') || '') || undefined
            initiate.mutate({ type: 'superadmin', paymentMethod: method, transactionId: txn, upiId, bank })
          }}
        >
          <select name="method" className="input" defaultValue="upi" aria-label="Payment method">
            <option value="upi">UPI (apps or UPI ID)</option>
            <option value="card">Card (credit/debit)</option>
            <option value="netbanking">Netbanking (India)</option>
            <option value="imps">IMPS</option>
            <option value="wallet">Wallet</option>
          </select>
          <input name="transactionId" className="input" placeholder="Transaction ID / Ref" required />
          <input name="upiId" className="input" placeholder="UPI ID (optional)" />
          <input name="bank" className="input" placeholder="Bank (for netbanking)" />
          <div className="sm:col-span-2">
            <button className="btn btn-primary" disabled={initiate.isPending}>Initiate Payment</button>
          </div>
        </form>
        {initiate.isSuccess ? (
          <div className="mt-3 text-sm">
            <div>Provider: {initiate.data.paymentIntent?.provider}</div>
            <div>Method: {initiate.data.paymentIntent?.method}</div>
            {initiate.data.paymentIntent?.upiQrData ? <div className="mt-2">UPI QR: <code className="text-xs">{initiate.data.paymentIntent.upiQrData}</code></div> : null}
            {initiate.data.paymentIntent?.redirectUrl ? (
              <div className="mt-2"><a className="underline" href={initiate.data.paymentIntent.redirectUrl} target="_blank" rel="noreferrer">Proceed to checkout</a></div>
            ) : null}
          </div>
        ) : null}
        {initiate.isError ? <div className="mt-2 text-sm text-red-600">{(initiate.error as Error).message}</div> : null}
      </div>
    </div>
  )
}
