import { useEffect, useState } from 'react'
import { ErrorList } from '../ErrorList'

export type PersonFormValues = {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  tags?: string[]
}

type PersonFormProps = {
  initial?: PersonFormValues
  submitLabel: string
  loading?: boolean
  error?: any
  onSubmit: (values: PersonFormValues) => void
  onCancel?: () => void
}

export function PersonForm({ initial, submitLabel, loading, error, onSubmit, onCancel }: PersonFormProps) {
  const [values, setValues] = useState<PersonFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tags: [],
  })

  useEffect(() => {
    if (initial) {
      setValues({
        firstName: initial.firstName,
        lastName: initial.lastName,
        email: initial.email || '',
        phone: initial.phone || '',
        tags: initial.tags || [],
      })
    }
  }, [initial])

  const setField = (field: keyof PersonFormValues, value: string) => {
    if (field === 'tags') {
      setValues((prev) => ({ ...prev, tags: value.split(',').map((s) => s.trim()).filter(Boolean) }))
    } else {
      setValues((prev) => ({ ...prev, [field]: value }))
    }
  }

  const tagsString = values.tags?.join(', ') || ''

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(values)
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">First name</label>
          <input
            className="input"
            value={values.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last name</label>
          <input
            className="input"
            value={values.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input className="input" type="email" value={values.email || ''} onChange={(e) => setField('email', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input className="input" value={values.phone || ''} onChange={(e) => setField('phone', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <input className="input" value={tagsString} onChange={(e) => setField('tags', e.target.value)} placeholder="member, volunteer" />
        <p className="text-xs text-neutral-500 mt-1">Separate tags with commas</p>
      </div>
      {error ? <p className="text-sm text-red-600">{(error as Error).message}<ErrorList error={error} /></p> : null}
      <div className="flex items-center gap-3">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="btn bg-neutral-200 text-neutral-900 hover:bg-neutral-300" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}
