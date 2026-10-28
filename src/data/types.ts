export type Region = 'North' | 'South' | 'East' | 'West'
export type Tier = 'Gold' | 'Silver' | 'Bronze'

export interface Rep {
  id: string
  name: string
  email: string
  region: Region
  tier: Tier
  rate: number // commission rate in %
  joined: string // ISO date
  active: boolean
}

export type TradeType = 'Equity' | 'Mutual Fund' | 'Insurance' | 'Annuity' | 'Bond'
export type TradeAction = 'Buy' | 'Sell'

export interface Trade {
  id: string
  date: string
  repId: string
  client: string
  type: TradeType
  action: TradeAction
  amount: number
  commission: number
}

export type PayoutStatus = 'Paid' | 'Pending' | 'Processing'

export interface Payout {
  id: string
  periodId: string
  repId: string
  gross: number
  fee: number
  net: number
  status: PayoutStatus
  paidOn?: string
}

export interface PayPeriod {
  id: string
  label: string
  start: string
  end: string
  closed: boolean
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Viewer'
  lastActive: string
}
