import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import { FundForm, FundFormValues } from '../components/giving/FundForm'
import { DonationForm, DonationFormValues } from '../components/giving/DonationForm'
import { InlineAlert } from '../components/ui/InlineAlert'
import { ErrorList } from '../components/ErrorList'

type Fund = { _id: string; name: string; restricted?: boolean; active?: boolean }
type Donation = {
  _id: string
  fundId: string
  amount: number
  method: 'cash' | 'check' | 'card' | 'ach'
  date: string
  personId?: string
  txnRef?: string
}

const methodLabels: Record<Donation['method'], string> = {
  cash: 'Cash',
  check: 'Check',
  card: 'Card',
  ach: 'ACH',
}

export default function GivingPage() {
  const qc = useQueryClient()
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [filterFundId, setFilterFundId] = useState<'all' | string>('all')

  const funds = useQuery({ queryKey: ['funds'], queryFn: () => api<{ items: Fund[] }>(`/api/giving/funds`) })

  useEffect(() => {
    if (!selectedFund && funds.data?.items.length) {
      setSelectedFund(funds.data.items[0])
    }
  }, [funds.data, selectedFund])

  const donations = useQuery({
    queryKey: ['donations', filterFundId],
    queryFn: () => {
      const query = filterFundId === 'all' ? '' : `?fundId=${filterFundId}`
      return api<{ items: Donation[] }>(`/api/giving/donations${query}`)
    },
  })

  const totals = useMemo(() => {
    const items = donations.data?.items ?? []
    const amount = items.reduce((sum, donation) => sum + donation.amount, 0)
    return { count: items.length, amount }
  }, [donations.data])

  const createFund = useMutation({
    mutationFn: (values: FundFormValues) =>
      api<Fund>(`/api/giving/funds`, {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    onSuccess: (fund) => {
      qc.invalidateQueries({ queryKey: ['funds'] })
      setSelectedFund(fund)
    },
  })

  const updateFund = useMutation({
    mutationFn: ({ id, ...values }: FundFormValues & { id: string }) =>
      api<Fund>(`/api/giving/funds/${id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
      }),
    onSuccess: (fund) => {
      setSelectedFund(fund)
      qc.invalidateQueries({ queryKey: ['funds'] })
    },
  })

  const deleteFund = useMutation({
    mutationFn: (id: string) => api<void>(`/api/giving/funds/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['funds'] })
      if (selectedFund?._id === id) setSelectedFund(null)
    },
  })

  const createDonation = useMutation({
    mutationFn: (values: DonationFormValues) =>
      api<Donation>(`/api/giving/donations`, {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['donations'] })
      setSelectedDonation(null)
    },
  })

  const updateDonation = useMutation({
    mutationFn: ({ id, ...values }: DonationFormValues & { id: string }) =>
      api<Donation>(`/api/giving/donations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['donations'] })
    },
  })

  const deleteDonation = useMutation({
    mutationFn: (id: string) => api<void>(`/api/giving/donations/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['donations'] })
      if (selectedDonation?._id === id) setSelectedDonation(null)
    },
  })

  const fundsList = funds.data?.items ?? []

  const selectedFundInitial: FundFormValues | undefined = selectedFund
    ? { name: selectedFund.name, restricted: selectedFund.restricted, active: selectedFund.active }
    : undefined

  const selectedDonationInitial: DonationFormValues | undefined = selectedDonation
    ? {
        fundId: selectedDonation.fundId,
        amount: selectedDonation.amount,
        method: selectedDonation.method,
        date: selectedDonation.date.slice(0, 10),
        personId: selectedDonation.personId,
        txnRef: selectedDonation.txnRef,
      }
    : undefined

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-neutral-500">Total gifts</p>
          <p className="text-2xl font-semibold">${totals.amount.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-neutral-500">Gift count</p>
          <p className="text-2xl font-semibold">{totals.count}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-neutral-500">Active funds</p>
          <p className="text-2xl font-semibold">
            {fundsList.filter((fund) => fund.active !== false).length}/{fundsList.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Funds</h3>
              <button className="text-sm text-neutral-500 hover:underline" onClick={() => setSelectedFund(null)}>
                New fund
              </button>
            </div>
            <ul className="space-y-2">
              {fundsList.map((fund) => (
                <li key={fund._id}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                      selectedFund?._id === fund._id
                        ? 'border-brand-500 bg-brand-50/60 text-brand-700'
                        : 'border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                    onClick={() => {
                      setSelectedFund(fund)
                      setSelectedDonation(null)
                    }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{fund.name}</span>
                      <span className="text-neutral-500">{fund.active === false ? 'Inactive' : 'Active'}</span>
                    </div>
                    {fund.restricted ? (
                      <p className="text-xs text-neutral-500 mt-1">Restricted fund</p>
                    ) : null}
                  </button>
                </li>
              ))}
              {fundsList.length === 0 ? (
                <InlineAlert tone="info">No funds yet. Create one to begin tracking giving.</InlineAlert>
              ) : null}
            </ul>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-3">{selectedFund ? 'Edit fund' : 'Create fund'}</h3>
            <FundForm
              initial={selectedFundInitial}
              submitLabel={selectedFund ? 'Save changes' : 'Create fund'}
              loading={selectedFund ? updateFund.isPending : createFund.isPending}
              error={selectedFund ? updateFund.error : createFund.error}
              onSubmit={(values) =>
                selectedFund
                  ? updateFund.mutate({ id: selectedFund._id, ...values })
                  : createFund.mutate(values)
              }
              onDelete={
                selectedFund
                  ? () => {
                      if (confirm('Delete this fund?')) deleteFund.mutate(selectedFund._id)
                    }
                  : undefined
              }
            />
          </div>
        </div>

        <div className="xl:col-span-3 space-y-6">
          <div className="card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-semibold">Donations</h3>
              <select
                className="input sm:w-60"
                value={filterFundId}
                onChange={(e) => setFilterFundId(e.target.value as 'all' | string)}
              >
                <option value="all">All funds</option>
                {fundsList.map((fund) => (
                  <option key={fund._id} value={fund._id}>
                    {fund.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-neutral-500">
                  <tr>
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2 pr-3">Fund</th>
                    <th className="py-2 pr-3">Amount</th>
                    <th className="py-2 pr-3">Method</th>
                    <th className="py-2 pr-3">Reference</th>
                    <th className="py-2 pr-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {donations.data?.items.map((donation) => {
                    const fund = fundsList.find((f) => f._id === donation.fundId)
                    return (
                      <tr key={donation._id} className="border-t border-neutral-200 dark:border-neutral-800">
                        <td className="py-2 pr-3">{new Date(donation.date).toLocaleDateString()}</td>
                        <td className="py-2 pr-3">{fund?.name || 'Unknown'}</td>
                        <td className="py-2 pr-3 font-medium">${donation.amount.toFixed(2)}</td>
                        <td className="py-2 pr-3">{methodLabels[donation.method]}</td>
                        <td className="py-2 pr-3 text-neutral-500">{donation.txnRef || '—'}</td>
                        <td className="py-2 pr-3 text-right">
                          <button
                            className="text-sm text-brand-600 hover:underline"
                            onClick={() => setSelectedDonation(donation)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {donations.data && donations.data.items.length === 0 ? (
                    <tr>
                      <td className="py-4 text-center text-neutral-500" colSpan={6}>
                        No donations for this selection.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{selectedDonation ? 'Edit donation' : 'Record donation'}</h3>
              <button className="text-sm text-neutral-500 hover:underline" onClick={() => setSelectedDonation(null)}>
                New entry
              </button>
            </div>
            {fundsList.length === 0 ? (
              <InlineAlert tone="info">Create a fund before recording donations.</InlineAlert>
            ) : (
              <DonationForm
                funds={fundsList}
                initial={selectedDonationInitial}
                submitLabel={selectedDonation ? 'Save changes' : 'Save donation'}
                loading={selectedDonation ? updateDonation.isPending : createDonation.isPending}
                error={selectedDonation ? updateDonation.error : createDonation.error}
                onSubmit={(values) =>
                  selectedDonation
                    ? updateDonation.mutate({ id: selectedDonation._id, ...values })
                    : createDonation.mutate(values)
                }
                onDelete={
                  selectedDonation
                    ? () => {
                        if (confirm('Delete this donation?')) deleteDonation.mutate(selectedDonation._id)
                      }
                    : undefined
                }
              />
            )}
            {deleteDonation.isError ? (
              <div className="mt-3">
                <InlineAlert tone="error">
                  {(deleteDonation.error as Error).message}
                  <ErrorList error={deleteDonation.error} />
                </InlineAlert>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
