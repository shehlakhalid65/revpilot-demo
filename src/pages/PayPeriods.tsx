import { App, Button, Card, Table, Typography } from 'antd'
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'

import { useStore } from '../data/store'
import type { PayPeriod } from '../data/types'
import PageHeader from '../components/PageHeader'
import StatusTag from '../components/StatusTag'
import { fmtDate, money, sum } from '../utils'

export default function PayPeriods (): JSX.Element {
  const { periods, trades, payouts, togglePeriod } = useStore()
  const { message } = App.useApp()

  const rows = [...periods].reverse().map(p => {
    const list = trades.filter(t => t.date >= p.start && t.date <= p.end)
    return {
      ...p,
      trades: list.length,
      commission: sum(list.map(t => t.commission)),
      reps: payouts.filter(x => x.periodId === p.id).length
    }
  })

  return (
    <div className="page">
      <PageHeader title="Pay Periods" subtitle="Close a period to lock its trades and release payouts." />
      <Card bordered={false} styles={{ body: { padding: 0 } }}>
        <Table
          rowKey="id"
          dataSource={rows}
          pagination={false}
          scroll={{ x: 760 }}
          columns={[
            { title: 'Period', dataIndex: 'label', render: (v: string) => <Typography.Text strong>{v}</Typography.Text> },
            { title: 'Start', dataIndex: 'start', render: fmtDate },
            { title: 'End', dataIndex: 'end', render: fmtDate },
            { title: 'Trades', dataIndex: 'trades', align: 'right' },
            { title: 'Reps paid', dataIndex: 'reps', align: 'right' },
            { title: 'Commission', dataIndex: 'commission', align: 'right', render: money },
            { title: 'Status', dataIndex: 'closed', render: (c: boolean) => <StatusTag value={c ? 'Closed' : 'Open'} /> },
            {
              title: '',
              key: 'toggle',
              align: 'right',
              render: (_, p: PayPeriod) => (
                <Button
                  size="small"
                  icon={p.closed ? <UnlockOutlined /> : <LockOutlined />}
                  onClick={() => { togglePeriod(p.id); message.success(`${p.label} ${p.closed ? 'reopened' : 'closed'}`) }}
                >
                  {p.closed ? 'Reopen' : 'Close period'}
                </Button>
              )
            }
          ]}
        />
      </Card>
    </div>
  )
}
