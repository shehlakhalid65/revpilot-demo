import { useState } from 'react'
import { App, Button, Card, Col, Row, Segmented, Select, Table, Typography } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, DownloadOutlined, WalletOutlined } from '@ant-design/icons'

import { useStore } from '../data/store'
import type { Payout } from '../data/types'
import KpiCard from '../components/KpiCard'
import PageHeader from '../components/PageHeader'
import StatusTag from '../components/StatusTag'
import { colors } from '../theme'
import { downloadCsv, fmtDate, money, sum } from '../utils'

export default function Payouts (): JSX.Element {
  const { payouts, periods, repName, markPaid } = useStore()
  const { message } = App.useApp()
  const [periodId, setPeriodId] = useState(periods[periods.length - 1].id)
  const [status, setStatus] = useState<string>('All')

  const inPeriod = payouts.filter(p => p.periodId === periodId)
  const rows = inPeriod.filter(p => status === 'All' || p.status === status)

  return (
    <div className="page">
      <PageHeader
        title="Payouts"
        subtitle="Monthly commission payouts per rep, after a 5% admin fee."
        extra={(
          <>
            <Select value={periodId} onChange={setPeriodId} style={{ width: 150 }} options={[...periods].reverse().map(p => ({ value: p.id, label: p.label }))} />
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                downloadCsv(`payouts-${periodId}.csv`, rows.map(p => ({
                  Rep: repName(p.repId), Gross: p.gross, Fee: p.fee, Net: p.net, Status: p.status, PaidOn: p.paidOn ?? ''
                })))
              }}
            >
              Export
            </Button>
          </>
        )}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}><KpiCard label="Total net payout" value={money(sum(inPeriod.map(p => p.net)))} icon={<WalletOutlined />} color={colors.primary} /></Col>
        <Col xs={24} md={8}><KpiCard label="Paid" value={money(sum(inPeriod.filter(p => p.status === 'Paid').map(p => p.net)))} icon={<CheckCircleOutlined />} color={colors.teal} /></Col>
        <Col xs={24} md={8}><KpiCard label="Outstanding" value={money(sum(inPeriod.filter(p => p.status !== 'Paid').map(p => p.net)))} icon={<ClockCircleOutlined />} color={colors.amber} /></Col>
      </Row>

      <Card bordered={false} styles={{ body: { padding: 0 } }}>
        <div style={{ padding: 16 }}>
          <Segmented options={['All', 'Paid', 'Processing', 'Pending']} value={status} onChange={v => { setStatus(v) }} />
        </div>
        <Table
          rowKey="id"
          dataSource={rows}
          scroll={{ x: 760 }}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          columns={[
            { title: 'Rep', dataIndex: 'repId', render: (id: string) => <Typography.Text strong>{repName(id)}</Typography.Text> },
            { title: 'Gross', dataIndex: 'gross', align: 'right', render: money, sorter: (a, b) => a.gross - b.gross },
            { title: 'Admin fee', dataIndex: 'fee', align: 'right', render: (v: number) => <Typography.Text type="secondary">−{money(v)}</Typography.Text> },
            { title: 'Net', dataIndex: 'net', align: 'right', render: (v: number) => <Typography.Text strong>{money(v)}</Typography.Text>, sorter: (a, b) => a.net - b.net },
            { title: 'Status', dataIndex: 'status', render: (v: string) => <StatusTag value={v} /> },
            { title: 'Paid on', dataIndex: 'paidOn', render: fmtDate },
            {
              title: '',
              key: 'pay',
              align: 'right',
              render: (_, p: Payout) => p.status !== 'Paid' && (
                <Button size="small" type="primary" ghost onClick={() => { markPaid(p.id); message.success(`Paid ${repName(p.repId)}`) }}>
                  Mark paid
                </Button>
              )
            }
          ]}
          summary={data => (
            <Table.Summary.Row style={{ background: '#F8FAFC' }}>
              <Table.Summary.Cell index={0}><Typography.Text strong>Total</Typography.Text></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">{money(sum(data.map(p => p.gross)))}</Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right">−{money(sum(data.map(p => p.fee)))}</Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="right"><Typography.Text strong>{money(sum(data.map(p => p.net)))}</Typography.Text></Table.Summary.Cell>
              <Table.Summary.Cell index={4} colSpan={3} />
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  )
}
