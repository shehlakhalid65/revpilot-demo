import dayjs from 'dayjs'
import type {
  PayPeriod, Payout, Region, Rep, TeamMember, Tier, Trade, TradeType
} from './types'

// Small seeded PRNG so the demo shows the same data on every load
function mulberry32 (seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(20240611)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const between = (min: number, max: number): number => min + rand() * (max - min)
const round2 = (n: number): number => Math.round(n * 100) / 100

const FIRST = ['Ava', 'Liam', 'Noah', 'Mia', 'Ethan', 'Zara', 'Lucas', 'Chloe', 'Omar', 'Isla',
  'Mason', 'Leah', 'Ryan', 'Nora', 'Kai', 'Sofia', 'Adam', 'Hana', 'Jack', 'Maya']
const LAST = ['Carter', 'Nguyen', 'Patel', 'Brooks', 'Rivera', 'Khan', 'Bennett', 'Foster',
  'Hughes', 'Morales', 'Price', 'Reed', 'Shah', 'Turner', 'Walsh', 'Young']
const CLIENTS = ['Northwind LLC', 'Bluepeak Co.', 'Harbor & Pine', 'Summit Group', 'Oakridge Inc.',
  'Brightline', 'Cedar Holdings', 'Lumen Partners', 'Atlas Family Trust', 'Silverleaf',
  'Redwood Capital', 'Maple Street Co.', 'Quarry Labs', 'Willow Ventures']
const REGIONS: Region[] = ['North', 'South', 'East', 'West']
const TIERS: Tier[] = ['Gold', 'Silver', 'Silver', 'Bronze', 'Bronze']
const TYPES: TradeType[] = ['Equity', 'Mutual Fund', 'Insurance', 'Annuity', 'Bond']
const TIER_RATE: Record<Tier, number> = { Gold: 8, Silver: 6, Bronze: 4.5 }

const today = dayjs()

export function seedReps (): Rep[] {
  return Array.from({ length: 18 }, (_, i) => {
    const first = FIRST[i % FIRST.length]
    const last = pick(LAST)
    const tier = pick(TIERS)
    return {
      id: `R-${String(1001 + i)}`,
      name: `${first} ${last}`,
      email: `${first}.${last}@revpilot.demo`.toLowerCase(),
      region: pick(REGIONS),
      tier,
      rate: TIER_RATE[tier],
      joined: today.subtract(Math.floor(between(60, 1400)), 'day').format('YYYY-MM-DD'),
      active: rand() > 0.15
    }
  })
}

export function seedPeriods (): PayPeriod[] {
  return Array.from({ length: 12 }, (_, i) => {
    const m = today.subtract(11 - i, 'month')
    return {
      id: m.format('YYYY-MM'),
      label: m.format('MMM YYYY'),
      start: m.startOf('month').format('YYYY-MM-DD'),
      end: m.endOf('month').format('YYYY-MM-DD'),
      closed: i < 11
    }
  })
}

export function seedTrades (reps: Rep[]): Trade[] {
  const trades: Trade[] = []
  for (let i = 0; i < 240; i++) {
    const rep = pick(reps)
    // Skew toward recent months so the trend line climbs
    const daysAgo = Math.floor(Math.pow(rand(), 1.3) * 360)
    const amount = round2(between(2500, 85000))
    trades.push({
      id: `T-${String(50001 + i)}`,
      date: today.subtract(daysAgo, 'day').format('YYYY-MM-DD'),
      repId: rep.id,
      client: pick(CLIENTS),
      type: pick(TYPES),
      action: rand() > 0.3 ? 'Buy' : 'Sell',
      amount,
      commission: round2(amount * rep.rate / 100)
    })
  }
  return trades.sort((a, b) => b.date.localeCompare(a.date))
}

export function buildPayouts (trades: Trade[], periods: PayPeriod[]): Payout[] {
  const payouts: Payout[] = []
  periods.forEach((p) => {
    const byRep = new Map<string, number>()
    trades
      .filter(t => t.date >= p.start && t.date <= p.end)
      .forEach(t => byRep.set(t.repId, (byRep.get(t.repId) ?? 0) + t.commission))
    byRep.forEach((gross, repId) => {
      const fee = round2(gross * 0.05)
      payouts.push({
        id: `P-${p.id}-${repId.slice(2)}`,
        periodId: p.id,
        repId,
        gross: round2(gross),
        fee,
        net: round2(gross - fee),
        status: p.closed ? 'Paid' : (rand() > 0.5 ? 'Pending' : 'Processing'),
        paidOn: p.closed ? dayjs(p.end).add(5, 'day').format('YYYY-MM-DD') : undefined
      })
    })
  })
  return payouts
}

export function seedTeam (): TeamMember[] {
  return [
    { id: 'U-1', name: 'Jordan Ellis', email: 'jordan@revpilot.demo', role: 'Owner', lastActive: today.format('YYYY-MM-DD') },
    { id: 'U-2', name: 'Priya Malik', email: 'priya@revpilot.demo', role: 'Admin', lastActive: today.subtract(1, 'day').format('YYYY-MM-DD') },
    { id: 'U-3', name: 'Sam Ortega', email: 'sam@revpilot.demo', role: 'Admin', lastActive: today.subtract(3, 'day').format('YYYY-MM-DD') },
    { id: 'U-4', name: 'Grace Lin', email: 'grace@revpilot.demo', role: 'Viewer', lastActive: today.subtract(9, 'day').format('YYYY-MM-DD') }
  ]
}
