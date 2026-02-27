export function parseISODate(dateStr) {
  // dateStr should be "YYYY-MM-DD"
  const [y, m, d] = String(dateStr).split('-').map((n) => Number(n))
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
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
  const remaining = daysRemaining(member?.endDate, now)
  if (remaining == null) return false
  return remaining >= 0
}

