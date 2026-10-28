import dayjs from 'dayjs'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const usdShort = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1
})

export const money = (n: number): string => usd.format(n)
export const moneyShort = (n: number): string => usdShort.format(n)
export const fmtDate = (d?: string): string => (d != null ? dayjs(d).format('MMM D, YYYY') : '—')
export const sum = (list: number[]): number => list.reduce((a, b) => a + b, 0)

export function downloadCsv (filename: string, rows: Array<Record<string, string | number>>): void {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0])
  const escape = (v: string | number): string => `"${String(v).replace(/"/g, '""')}"`
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
