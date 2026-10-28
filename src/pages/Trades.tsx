import { useState } from 'react'
import dayjs from 'dayjs'
import {
  App, Button, Card, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Radio, Select, Space, Table, Typography
} from 'antd'
import { DeleteOutlined, DownloadOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'

import { useStore } from '../data/store'
import type { Trade } from '../data/types'
import PageHeader from '../components/PageHeader'
import StatusTag from '../components/StatusTag'
import { downloadCsv, fmtDate, money, sum } from '../utils'

const TYPES = ['Equity', 'Mutual Fund', 'Insurance', 'Annuity', 'Bond']

export default function Trades (): JSX.Element {
  const { trades, reps, repName, saveTrade, deleteTrade } = useStore()
  const { message } = App.useApp()
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string>()
  const [adding, setAdding] = useState(false)
  const [form] = Form.useForm()

  const q = search.toLowerCase()
  const rows = trades.filter(t =>
    (type == null || t.type === type) &&
    `${t.id} ${t.client} ${repName(t.repId)}`.toLowerCase().includes(q))

  const submit = (v: { date: dayjs.Dayjs, repId: string, client: string, type: Trade['type'], action: Trade['action'], amount: number }): void => {
    const rate = reps.find(r => r.id === v.repId)?.rate ?? 5
    saveTrade({
      ...v,
      id: `T-${50001 + trades.length + Math.floor(Math.random() * 1000)}`,
      date: v.date.format('YYYY-MM-DD'),
      commission: Math.round(v.amount * rate) / 100
    })
    message.success('Trade recorded')
    setAdding(false)
  }

  const exportCsv = (): void => {
    downloadCsv('trades.csv', rows.map(t => ({
      ID: t.id, Date: t.date, Rep: repName(t.repId), Client: t.client, Type: t.type, Action: t.action, Amount: t.amount, Commission: t.commission
    })))
  }

  return (
    <div className="page">
      <PageHeader
        title="Trades"
        subtitle={`${rows.length} trades · ${money(sum(rows.map(t => t.commission)))} commission`}
        extra={(
          <>
            <Input prefix={<SearchOutlined />} placeholder="Search client, rep, ID" allowClear onChange={e => { setSearch(e.target.value) }} style={{ width: 240 }} />
            <Select placeholder="All products" allowClear style={{ width: 150 }} onChange={setType} options={TYPES.map(v => ({ value: v }))} />
            <Button icon={<DownloadOutlined />} onClick={exportCsv}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setAdding(true) }}>New trade</Button>
          </>
        )}
      />
      <Card bordered={false} styles={{ body: { padding: 0 } }}>
        <Table
          rowKey="id"
          dataSource={rows}
          scroll={{ x: 900 }}
          pagination={{ pageSize: 12, showSizeChanger: false }}
          columns={[
            { title: 'Trade ID', dataIndex: 'id' },
            { title: 'Date', dataIndex: 'date', render: fmtDate, sorter: (a, b) => a.date.localeCompare(b.date) },
            { title: 'Rep', dataIndex: 'repId', render: repName },
            { title: 'Client', dataIndex: 'client' },
            { title: 'Product', dataIndex: 'type' },
            { title: 'Action', dataIndex: 'action', render: (v: string) => <StatusTag value={v} /> },
            { title: 'Amount', dataIndex: 'amount', align: 'right', render: money, sorter: (a, b) => a.amount - b.amount },
            { title: 'Commission', dataIndex: 'commission', align: 'right', render: (v: number) => <Typography.Text strong>{money(v)}</Typography.Text>, sorter: (a, b) => a.commission - b.commission },
            {
              title: '',
              key: 'del',
              align: 'right',
              render: (_, t: Trade) => (
                <Popconfirm title="Delete this trade?" onConfirm={() => { deleteTrade(t.id); message.success('Trade deleted') }}>
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              )
            }
          ]}
        />
      </Card>

      <Modal title="Record trade" open={adding} onCancel={() => { setAdding(false) }} onOk={() => { form.submit() }} okText="Save">
        <Form form={form} layout="vertical" onFinish={submit} requiredMark={false} initialValues={{ date: dayjs(), action: 'Buy', type: 'Equity' }}>
          <Space style={{ display: 'flex' }} styles={{ item: { flex: 1 } }}>
            <Form.Item name="date" label="Trade date" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="action" label="Action"><Radio.Group options={['Buy', 'Sell']} optionType="button" /></Form.Item>
          </Space>
          <Form.Item name="repId" label="Rep" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="label" options={reps.filter(r => r.active).map(r => ({ value: r.id, label: `${r.name} (${r.rate}%)` }))} />
          </Form.Item>
          <Form.Item name="client" label="Client" rules={[{ required: true }]}><Input /></Form.Item>
          <Space style={{ display: 'flex' }} styles={{ item: { flex: 1 } }}>
            <Form.Item name="type" label="Product"><Select options={TYPES.map(v => ({ value: v }))} /></Form.Item>
            <Form.Item name="amount" label="Amount (USD)" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} prefix="$" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  )
}
