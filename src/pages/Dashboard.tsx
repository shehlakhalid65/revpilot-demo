import { useMemo } from 'react'
import dayjs from 'dayjs'
import { Avatar, Card, Col, List, Progress, Row, Table, Typography } from 'antd'
import { DollarOutlined, RiseOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons'
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'

import { useStore } from '../data/store'
import KpiCard from '../components/KpiCard'
import PageHeader from '../components/PageHeader'
import StatusTag from '../components/StatusTag'
import { colors } from '../theme'
import { fmtDate, money, moneyShort, sum } from '../utils'

const PIE_COLORS = [colors.primary, colors.teal, colors.amber, colors.rose, colors.sky]

export default function Dashboard ({ user }: { user: string }): JSX.Element {
  const { trades, reps, payouts, periods, repName } = useStore()

  const stats = useMemo(() => {
    const thisMonth = dayjs().format('YYYY-MM')
    const lastMonth = dayjs().subtract(1, 'month').format('YYYY-MM')
    const inMonth = (m: string): number => sum(trades.filter(t => t.date.startsWith(m)).map(t => t.commission))
    const cur = inMonth(thisMonth)
    const prev = inMonth(lastMonth)

    const monthly = periods.map(p => {
      const list = trades.filter(t => t.date.startsWith(p.id))
      return { month: dayjs(p.start).format('MMM'), volume: sum(list.map(t => t.amount)), commission: sum(list.map(t => t.commission)) }
    })

    const byType = new Map<string, number>()
    trades.forEach(t => byType.set(t.type, (byType.get(t.type) ?? 0) + t.amount))

    const byRep = new Map<string, number>()
    trades.forEach(t => byRep.set(t.repId, (byRep.get(t.repId) ?? 0) + t.commission))
    const top = [...byRep.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

    return {
      cur,
      change: prev > 0 ? ((cur - prev) / prev) * 100 : 0,
      ytd: sum(trades.filter(t => t.date.startsWith(String(dayjs().year()))).map(t => t.commission)),
      pending: sum(payouts.filter(p => p.status !== 'Paid').map(p => p.net)),
      monthly,
      mix: [...byType.entries()].map(([name, value]) => ({ name, value })),
      top
    }
  }, [trades, payouts, periods])

  const topMax = stats.top[0]?.[1] ?? 1

  return (
    <div className="page">
      <PageHeader title={`Good to see you, ${user.split(' ')[0]} 👋`} subtitle="Here's how your sales team is performing." />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard label="Commission this month" value={money(stats.cur)} change={stats.change} icon={<DollarOutlined />} color={colors.primary} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard label="Year to date" value={moneyShort(stats.ytd)} icon={<RiseOutlined />} color={colors.teal} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard label="Pending payouts" value={money(stats.pending)} icon={<SwapOutlined />} color={colors.amber} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <KpiCard label="Active reps" value={`${reps.filter(r => r.active).length} / ${reps.length}`} icon={<UserOutlined />} color={colors.rose} />
        </Col>

        <Col xs={24} xl={16}>
          <Card bordered={false} title="Commission trend" extra={<Typography.Text type="secondary">Last 12 months</Typography.Text>}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats.monthly} margin={{ left: 0, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fillC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.primary} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={colors.border} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={moneyShort} tickLine={false} axisLine={false} width={64} />
                <Tooltip formatter={(v: number) => money(v)} />
                <Area type="monotone" dataKey="commission" name="Commission" stroke={colors.primary} strokeWidth={2.5} fill="url(#fillC)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card bordered={false} title="Volume by product" style={{ height: '100%' }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats.mix} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {stats.mix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => money(v)} />
              </PieChart>
            </ResponsiveContainer>
            {stats.mix.map((m, i) => (
              <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[i % PIE_COLORS.length], marginRight: 8 }} />{m.name}</span>
                <Typography.Text strong>{moneyShort(m.value)}</Typography.Text>
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card bordered={false} title="Top performers" style={{ height: '100%' }}>
            <List
              dataSource={stats.top}
              renderItem={([id, total]) => (
                <List.Item>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
                    <Avatar style={{ background: colors.primary }}>{repName(id).charAt(0)}</Avatar>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography.Text strong>{repName(id)}</Typography.Text>
                        <Typography.Text>{moneyShort(total)}</Typography.Text>
                      </div>
                      <Progress percent={(total / topMax) * 100} showInfo={false} size="small" strokeColor={colors.teal} />
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} xl={16}>
          <Card bordered={false} title="Recent trades">
            <Table
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={trades.slice(0, 6)}
              scroll={{ x: 600 }}
              columns={[
                { title: 'Date', dataIndex: 'date', render: fmtDate },
                { title: 'Rep', dataIndex: 'repId', render: repName },
                { title: 'Client', dataIndex: 'client' },
                { title: 'Action', dataIndex: 'action', render: (v: string) => <StatusTag value={v} /> },
                { title: 'Amount', dataIndex: 'amount', align: 'right', render: money },
                { title: 'Commission', dataIndex: 'commission', align: 'right', render: (v: number) => <Typography.Text strong>{money(v)}</Typography.Text> }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
