type InlineAlertProps = {
  tone?: 'info' | 'error' | 'success'
  children: React.ReactNode
}

const toneClasses: Record<NonNullable<InlineAlertProps['tone']>, string> = {
  info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900',
  error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-900',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900',
}

export function InlineAlert({ tone = 'info', children }: InlineAlertProps) {
  return <div className={`rounded-lg border px-3 py-2 text-sm ${toneClasses[tone]}`}>{children}</div>
}
