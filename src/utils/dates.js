export function parseISODate(dateStr) {
  if (!dateStr) return null

  // Supports both date-only ("YYYY-MM-DD") and datetime strings.
  const raw = String(dateStr).trim()
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const y = Number(match[1])
    const m = Number(match[2])
    const d = Number(match[3])
    if (!y || !m || !d) return null
    return new Date(y, m - 1, d)
  }

  const dt = new Date(raw)
  if (Number.isNaN(dt.getTime())) return null
  return dt
}

export function formatISO(dateStr) {
  const dt = parseISODate(dateStr)
  if (!dt) return '—'
  return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function daysRemaining(endDateStr, now = new Date()) {
  const end = parseISODate(endDateStr)
  if (!end) return null
  const ms = startOfDay(end).getTime() - startOfDay(now).getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export function isActiveMember(member, now = new Date()) {
  const start = parseISODate(member?.startDate ?? member?.start_date)
  const end = parseISODate(member?.endDate ?? member?.end_date)
  if (!end) return false

  const today = startOfDay(now).getTime()
  const startDay = start ? startOfDay(start).getTime() : null
  const endDay = startOfDay(end).getTime()

  if (startDay != null && today < startDay) return false
  return today <= endDay
}

