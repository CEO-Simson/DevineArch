export function ErrorList({ error }: { error: any }) {
  const details = (error as any)?.details as { path: (string|number)[]; message: string }[] | undefined
  if (!details?.length) return null
  return (
    <ul className="mt-2 text-sm text-red-600 list-disc pl-5">
      {details.map((d, i) => (
        <li key={i}>{d.path.join('.')} — {d.message}</li>
      ))}
    </ul>
  )
}
