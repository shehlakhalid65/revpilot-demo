import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Button, Card, Col, Row, Select, Table, Tabs, Typography } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useStore } from '../data/store'
import PageHeader from '../components/PageHeader'
import { colors } from '../theme'
import { downloadCsv, money, moneyShort, sum } from '../utils'

function ByRep (): JSX.Element {
  const { trades, reps } = useStore()
  const [region, setRegion] = useState<string>()

  const rows = useMemo(() => reps
    .filter(r => region == null || r.region === region)
    .map(r => {
      const list = trades.filter(t => t.repId === r.id)
      return { id: r.id, name: r.name, region: r.region, trades: list.length, volume: sum(list.map(t => t.amount)), commission: sum(list.map(t => t.commission)) }
    })
    .sort((a, b) => b.commission - a.commission), [trades, reps, region])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card
          bordered={false}
          title="Commission by rep"
          extra={(
            <>
              <Select placeholder="All regions" allowClear style={{ width: 140, marginRight: 8 }} onChange={setRegion} options={['North', 'South', 'East', 'West'].map(v => ({ value: v }))} />
              <Button icon={<DownloadOutlined />} onClick={() => { downloadCsv('commission-by-rep.csv', rows) }}>CSV</Button>
            </>
          )}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rows.slice(0, 10)} margin={{ top: 8 }}>
              <CartesianGrid vertical={false} stroke={colors.border} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 11 }} tickFormatter={(n: string) => n.split(' ')[0]} />
              <YAxis tickFormatter={moneyShort} tickLine={false} axisLine={false} width={64} />
              <Tooltip formatter={(v: number) => money(v)} />
              <Bar dataKey="commission" name="Commission" fill={colors.primary} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col span={24}>
        <Card bordered={false} styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="id"
            dataSource={rows}
            pagination={false}
            size="middle"
            scroll={{ x: 600 }}
            columns={[
              { title: '#', key: 'rank', render: (_, __, i) => i + 1, width: 48 },
              { title: 'Rep', dataIndex: 'name', render: (v: string) => <Typography.Text strong>{v}</Typography.Text> },
              { title: 'Region', dataIndex: 'region' },
              { title: 'Trades', dataIndex: 'trades', align: 'right' },
              { title: 'Volume', dataIndex: 'volume', align: 'right', render: money },
              { title: 'Commission', dataIndex: 'commission', align: 'right', render: (v: number) => <Typography.Text strong>{money(v)}</Typography.Text> }
            ]}
          />
        </Card>
      </Col>
    </Row>
  )
}

function ByMonth (): JSX.Element {
  const { trades, periods } = useStore()

  const rows = periods.map(p => {
    const list = trades.filter(t => t.date.startsWith(p.id))
    const buy = list.filter(t => t.action === 'Buy')
    return {
      month: dayjs(p.start).format('MMM YY'),
      trades: list.length,
      buy: sum(buy.map(t => t.commission)),
      sell: sum(list.filter(t => t.action === 'Sell').map(t => t.commission)),
      total: sum(list.map(t => t.commission))
    }
  })

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card
          bordered={false}
          title="Monthly commission (buy vs sell)"
          extra={<Button icon={<DownloadOutlined />} onClick={() => { downloadCsv('commission-by-month.csv', rows) }}>CSV</Button>}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rows} margin={{ top: 8 }}>
              <CartesianGrid vertical={false} stroke={colors.border} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={moneyShort} tickLine={false} axisLine={false} width={64} />
              <Tooltip formatter={(v: number) => money(v)} />
              <Legend />
              <Bar dataKey="buy" name="Buy" stackId="a" fill={colors.primary} />
              <Bar dataKey="sell" name="Sell" stackId="a" fill={colors.teal} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col span={24}>
        <Card bordered={false} styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="month"
            dataSource={[...rows].reverse()}
            pagination={false}
            size="middle"
            scroll={{ x: 520 }}
            columns={[
              { title: 'Month', dataIndex: 'month', render: (v: string) => <Typography.Text strong>{v}</Typography.Text> },
              { title: 'Trades', dataIndex: 'trades', align: 'right' },
              { title: 'Buy', dataIndex: 'buy', align: 'right', render: money },
              { title: 'Sell', dataIndex: 'sell', align: 'right', render: money },
              { title: 'Total', dataIndex: 'total', align: 'right', render: (v: number) => <Typography.Text strong>{money(v)}</Typography.Text> }
            ]}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default function Reports (): JSX.Element {
  return (
    <div className="page">
      <PageHeader title="Reports" subtitle="Commission breakdowns you can filter and export." />
      <Tabs
        items={[
          { key: 'rep', label: 'By rep', children: <ByRep /> },
          { key: 'month', label: 'By month', children: <ByMonth /> }
        ]}
      />
    </div>
  )
}
