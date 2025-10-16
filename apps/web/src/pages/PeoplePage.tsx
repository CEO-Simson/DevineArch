import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import { ErrorList } from '../components/ErrorList'
import { PersonForm, PersonFormValues } from '../components/people/PersonForm'

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
  const [selected, setSelected] = useState<Person | null>(null)
  const [createKey, setCreateKey] = useState(0)
  const qc = useQueryClient()

  const queryKey = useMemo(() => ['persons', q, tagAny], [q, tagAny])
  const persons = useQuery({
    queryKey,
    queryFn: () =>
      api<{ items: Person[] }>(
        `/api/people/persons?q=${encodeURIComponent(q)}&tagAny=${encodeURIComponent(tagAny)}`
      ),
  })

  const create = useMutation({
    mutationFn: (data: PersonFormValues) =>
      api<Person>(`/api/people/persons`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      setCreateKey((value) => value + 1)
      qc.invalidateQueries({ queryKey: ['persons'] })
    },
  })

  const update = useMutation({
    mutationFn: ({ id, ...data }: PersonFormValues & { id: string }) =>
      api<Person>(`/api/people/persons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      if (selected && selected._id === variables.id) {
        setSelected((prev) => (prev ? { ...prev, ...variables } : prev))
      }
      qc.invalidateQueries({ queryKey: ['persons'] })
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => api<void>(`/api/people/persons/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) => {
      if (selected?._id === id) setSelected(null)
      qc.invalidateQueries({ queryKey: ['persons'] })
    },
  })

  const handleSelect = (person: Person) => {
    setSelected(person)
  }

  return (
    <div className="space-y-6 w-full">
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              className="input"
              placeholder="Search name or email"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Tag includes</label>
            <input
              className="input"
              placeholder="member, volunteer"
              value={tagAny}
              onChange={(e) => setTagAny(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">People</h2>
            <div className="text-sm text-neutral-500">
              {persons.isLoading ? 'Loading…' : `${persons.data?.items.length ?? 0} results`}
            </div>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {persons.data?.items.map((p) => (
              <button
                key={p._id}
                className={`w-full text-left py-3 px-2 rounded-lg transition hover:bg-neutral-100 dark:hover:bg-neutral-900 ${
                  selected?._id === p._id ? 'bg-neutral-100 dark:bg-neutral-900' : ''
                }`}
                onClick={() => handleSelect(p)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">
                      {p.firstName} {p.lastName}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {(p.email || '—') + ' | ' + (p.phone || '—')}
                    </div>
                    {p.tags?.length ? (
                      <div className="mt-1 text-xs text-neutral-500">tags: {p.tags.join(', ')}</div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:underline"
                      onClick={(event) => {
                        event.stopPropagation()
                        if (confirm('Delete this person?')) remove.mutate(p._id)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </button>
            ))}
            {persons.data && persons.data.items.length === 0 ? (
              <p className="text-sm text-neutral-500 py-6 text-center">
                No people found. Adjust filters or add someone new.
              </p>
            ) : null}
          </div>
          {remove.isError ? (
            <p className="text-sm text-red-600 mt-3">
              {(remove.error as Error).message}
              <ErrorList error={remove.error} />
            </p>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="card p-4">
            <h3 className="font-semibold mb-3">Add person</h3>
            <PersonForm
              key={createKey}
              submitLabel="Create"
              loading={create.isPending}
              error={create.error}
              onSubmit={(values) => create.mutate(values)}
            />
          </div>

          {selected ? (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Edit person</h3>
                <button className="text-sm text-neutral-500 hover:underline" onClick={() => setSelected(null)}>
                  Clear selection
                </button>
              </div>
              <PersonForm
                initial={selected}
                submitLabel="Save changes"
                loading={update.isPending}
                error={update.error}
                onSubmit={(values) => update.mutate({ id: selected._id, ...values })}
              />
            </div>
          ) : (
            <div className="card p-4 text-sm text-neutral-500">Select a person to edit their details.</div>
          )}
        </div>
      </div>
    </div>
  )
}
