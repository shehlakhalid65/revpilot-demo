import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { PayPeriod, Payout, Rep, TeamMember, Trade } from './types'
import { buildPayouts, seedPeriods, seedReps, seedTeam, seedTrades } from './seed'

const initialReps = seedReps()
const initialPeriods = seedPeriods()
const initialTrades = seedTrades(initialReps)
const initialPayouts = buildPayouts(initialTrades, initialPeriods)

interface Store {
  reps: Rep[]
  trades: Trade[]
  payouts: Payout[]
  periods: PayPeriod[]
  team: TeamMember[]
  repName: (id: string) => string
  saveRep: (rep: Rep) => void
  saveTrade: (trade: Trade) => void
  deleteTrade: (id: string) => void
  markPaid: (id: string) => void
  togglePeriod: (id: string) => void
}

const StoreContext = createContext<Store | null>(null)

const upsert = <T extends { id: string }>(list: T[], item: T): T[] =>
  list.some(x => x.id === item.id) ? list.map(x => (x.id === item.id ? item : x)) : [item, ...list]

export function StoreProvider ({ children }: { children: ReactNode }): JSX.Element {
  const [reps, setReps] = useState(initialReps)
  const [trades, setTrades] = useState(initialTrades)
  const [payouts, setPayouts] = useState(initialPayouts)
  const [periods, setPeriods] = useState(initialPeriods)
  const [team] = useState(seedTeam)

  const value = useMemo<Store>(() => {
    const names = new Map(reps.map(r => [r.id, r.name]))
    return {
      reps,
      trades,
      payouts,
      periods,
      team,
      repName: id => names.get(id) ?? id,
      saveRep: rep => { setReps(list => upsert(list, rep)) },
      saveTrade: trade => { setTrades(list => upsert(list, trade).sort((a, b) => b.date.localeCompare(a.date))) },
      deleteTrade: id => { setTrades(list => list.filter(t => t.id !== id)) },
      markPaid: id => {
        setPayouts(list => list.map(p => (p.id === id
          ? { ...p, status: 'Paid', paidOn: new Date().toISOString().slice(0, 10) }
          : p)))
      },
      togglePeriod: id => { setPeriods(list => list.map(p => (p.id === id ? { ...p, closed: !p.closed } : p))) }
    }
  }, [reps, trades, payouts, periods, team])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore (): Store {
  const ctx = useContext(StoreContext)
  if (ctx == null) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
