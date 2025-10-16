import { useEffect, useState } from 'react'
import { InlineAlert } from '../ui/InlineAlert'

export type DonationFormValues = {
  fundId: string
  amount: number
  method: 'cash' | 'check' | 'card' | 'ach'
  date?: string
  personId?: string
  txnRef?: string
}

type DonationFormProps = {
  funds: { _id: string; name: string }[]
  initial?: DonationFormValues
  submitLabel: string
  loading?: boolean
  error?: any
  onSubmit: (values: DonationFormValues) => void
  onDelete?: () => void
}

const defaultValues: DonationFormValues = {
  fundId: '',
  amount: 0,
  method: 'cash',
  date: new Date().toISOString().slice(0, 10),
}

export function DonationForm({ funds, initial, submitLabel, loading, error, onSubmit, onDelete }: DonationFormProps) {
  const [values, setValues] = useState<DonationFormValues>(defaultValues)

  useEffect(() => {
    if (initial) {
      setValues({
        ...initial,
        date: initial.date || defaultValues.date,
      })
    } else {
      setValues((prev) => ({ ...prev, fundId: funds[0]?._id || '' }))
    }
  }, [initial, funds])

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(values)
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Fund</label>
          <select
            className="input"
            value={values.fundId}
            onChange={(e) => setValues((prev) => ({ ...prev, fundId: e.target.value }))}
            required
          >
            <option value="">Select fund</option>
            {funds.map((fund) => (
              <option key={fund._id} value={fund._id}>
                {fund.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={values.amount}
            onChange={(e) => setValues((prev) => ({ ...prev, amount: Number(e.target.value) }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Method</label>
          <select
            className="input"
            value={values.method}
            onChange={(e) => setValues((prev) => ({ ...prev, method: e.target.value as DonationFormValues['method'] }))}
          >
            <option value="cash">Cash</option>
            <option value="check">Check</option>
            <option value="card">Card</option>
            <option value="ach">ACH</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            className="input"
            type="date"
            value={values.date || ''}
            onChange={(e) => setValues((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Person ID (optional)</label>
        <input
          className="input"
          value={values.personId || ''}
          onChange={(e) => setValues((prev) => ({ ...prev, personId: e.target.value || undefined }))}
          placeholder="person ObjectId"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Reference (optional)</label>
        <input
          className="input"
          value={values.txnRef || ''}
          onChange={(e) => setValues((prev) => ({ ...prev, txnRef: e.target.value || undefined }))}
          placeholder="Check number or processor reference"
        />
      </div>

      {error ? <InlineAlert tone="error">{(error as Error).message}</InlineAlert> : null}
      <div className="flex flex-wrap gap-3">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </button>
        {onDelete ? (
          <button type="button" className="btn bg-red-100 text-red-700 hover:bg-red-200" onClick={onDelete}>
            Delete donation
          </button>
        ) : null}
      </div>
    </form>
  )
}
