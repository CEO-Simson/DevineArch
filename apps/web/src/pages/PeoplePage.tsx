import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import { ErrorList } from '../components/ErrorList'

type Person = {
  _id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  tags?: string[]
}

export default function PeoplePage() {
  const [q, setQ] = useState('')
  const [tagAny, setTagAny] = useState('')
  const qc = useQueryClient()

  const queryKey = useMemo(() => ['persons', q, tagAny], [q, tagAny])
  const persons = useQuery({
    queryKey,
    queryFn: () => api<{ items: Person[] }>(`/api/people/persons?q=${encodeURIComponent(q)}&tagAny=${encodeURIComponent(tagAny)}`),
  })

  const create = useMutation({
    mutationFn: (data: Partial<Person> & { tagsInput?: string }) =>
      api<Person>(`/api/people/persons`, {
        method: 'POST',
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || undefined,
          phone: data.phone || undefined,
          tags: (data.tagsInput || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['persons'] }),
  })

  return (
    <div className="space-y-6 w-full">
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input className="input" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="input" placeholder="Any tags (comma-separated)" value={tagAny} onChange={(e) => setTagAny(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-4">
          <div className="text-sm text-neutral-500 mb-2">Results: {persons.data?.items.length ?? 0}</div>
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {persons.data?.items.map((p) => (
              <li key={p._id} className="py-3">
                <div className="font-medium">{p.firstName} {p.lastName}</div>
                <div className="text-sm text-neutral-500">{p.email || '—'} · {p.phone || '—'}</div>
                {p.tags?.length ? (
                  <div className="mt-1 text-xs text-neutral-500">tags: {p.tags.join(', ')}</div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-3">Add Person</h3>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget as HTMLFormElement)
              create.mutate({
                firstName: String(f.get('firstName') || ''),
                lastName: String(f.get('lastName') || ''),
                email: String(f.get('email') || ''),
                phone: String(f.get('phone') || ''),
                // @ts-ignore
                tagsInput: String(f.get('tags') || ''),
              })
              ;(e.currentTarget as HTMLFormElement).reset()
            }}
          >
            <input name="firstName" className="input" placeholder="First name" required />
            <input name="lastName" className="input" placeholder="Last name" required />
            <input name="email" className="input" placeholder="Email" type="email" />
            <input name="phone" className="input" placeholder="Phone" />
            <input name="tags" className="input" placeholder="Tags (comma-separated)" />
            <button className="btn btn-primary w-full" disabled={create.isPending}>{create.isPending ? 'Saving…' : 'Save'}</button>
            {create.isError ? (
              <div className="text-sm text-red-600">{(create.error as Error).message}<ErrorList error={create.error} /></div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  )
}
