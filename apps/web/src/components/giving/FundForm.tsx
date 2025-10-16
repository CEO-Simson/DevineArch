import { useEffect, useState } from 'react'
import { InlineAlert } from '../ui/InlineAlert'

export type FundFormValues = {
  name: string
  restricted?: boolean
  active?: boolean
}

type FundFormProps = {
  initial?: FundFormValues
  submitLabel: string
  loading?: boolean
  error?: any
  onSubmit: (values: FundFormValues) => void
  onDelete?: () => void
}

export function FundForm({ initial, submitLabel, loading, error, onSubmit, onDelete }: FundFormProps) {
  const [values, setValues] = useState<FundFormValues>({ name: '', restricted: false, active: true })

  useEffect(() => {
    if (initial) setValues(initial)
  }, [initial])

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(values)
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-1">Fund name</label>
        <input
          className="input"
          value={values.name}
          onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(values.restricted)}
          onChange={(e) => setValues((prev) => ({ ...prev, restricted: e.target.checked }))}
        />
        Restricted fund (designated use)
      </label>
      {initial ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(values.active)}
            onChange={(e) => setValues((prev) => ({ ...prev, active: e.target.checked }))}
          />
          Active
        </label>
      ) : null}
      {error ? <InlineAlert tone="error">{(error as Error).message}</InlineAlert> : null}
      <div className="flex flex-wrap gap-3">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </button>
        {onDelete ? (
          <button type="button" className="btn bg-red-100 text-red-700 hover:bg-red-200" onClick={onDelete}>
            Delete fund
          </button>
        ) : null}
      </div>
    </form>
  )
}
