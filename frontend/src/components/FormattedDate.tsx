'use client'

import { useEffect, useState } from 'react'

interface FormattedDateProps {
  date: string
  format?: 'full' | 'date' | 'timeago'
  className?: string
}

function computeTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = Math.max(0, now.getTime() - date.getTime())
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function FormattedDate({ date, format = 'full', className }: FormattedDateProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const d = new Date(date)

  if (!mounted) {
    // Render an initial placeholder or SSR-safe string with suppressHydrationWarning
    return (
      <span className={className} suppressHydrationWarning>
        {format === 'timeago'
          ? computeTimeAgo(date)
          : format === 'date'
          ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
          : d.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              timeZone: 'UTC',
            })}
      </span>
    )
  }

  let text = ''
  if (format === 'date') {
    text = d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } else if (format === 'timeago') {
    text = computeTimeAgo(date)
  } else {
    text = d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <span className={className} suppressHydrationWarning>
      {text}
    </span>
  )
}
