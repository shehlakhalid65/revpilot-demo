import { useState } from 'react'
import dayjs from 'dayjs'
import {
  App, Avatar, Button, Card, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, Typography
} from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

import { useStore } from '../data/store'
import type { Rep } from '../data/types'
import PageHeader from '../components/PageHeader'
import StatusTag from '../components/StatusTag'
import { colors } from '../theme'
import { fmtDate } from '../utils'

export default function Reps (): JSX.Element {
  const { reps, saveRep } = useStore()
  const { message } = App.useApp()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Rep | 'new' | null>(null)
  const [form] = Form.useForm()

  const q = search.toLowerCase()
  const rows = reps.filter(r => `${r.name} ${r.email} ${r.id}`.toLowerCase().includes(q))

  const open = (rep: Rep | 'new'): void => {
    setEditing(rep)
    form.setFieldsValue(rep === 'new'
      ? { region: 'North', tier: 'Silver', rate: 6, active: true, joined: dayjs() }
      : { ...rep, joined: dayjs(rep.joined) })
  }

  const submit = (values: Omit<Rep, 'joined' | 'id'> & { joined: dayjs.Dayjs }): void => {
    const id = editing === 'new' ? `R-${1001 + reps.length}` : (editing as Rep).id
    saveRep({ ...values, id, joined: values.joined.format('YYYY-MM-DD') })
    message.success(editing === 'new' ? 'Rep added' : 'Rep updated')
    setEditing(null)
  }

  return (
    <div className="page">
      <PageHeader
        title="Sales Reps"
        subtitle={`${reps.length} reps · ${reps.filter(r => r.active).length} active`}
        extra={(
          <>
            <Input prefix={<SearchOutlined />} placeholder="Search reps" allowClear onChange={e => { setSearch(e.target.value) }} style={{ width: 240 }} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { open('new') }}>New rep</Button>
          </>
        )}
      />
      <Card bordered={false} styles={{ body: { padding: 0 } }}>
        <Table
          rowKey="id"
          dataSource={rows}
          scroll={{ x: 800 }}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          columns={[
            {
              title: 'Rep',
              key: 'name',
              sorter: (a, b) => a.name.localeCompare(b.name),
              render: (_, r: Rep) => (
                <Space>
                  <Avatar style={{ background: colors.primary }}>{r.name.charAt(0)}</Avatar>
                  <div>
                    <Typography.Text strong>{r.name}</Typography.Text><br />
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Typography.Text>
                  </div>
                </Space>
              )
            },
            { title: 'ID', dataIndex: 'id' },
            {
              title: 'Region',
              dataIndex: 'region',
              filters: ['North', 'South', 'East', 'West'].map(v => ({ text: v, value: v })),
              onFilter: (v, r) => r.region === v
            },
            { title: 'Tier', dataIndex: 'tier', render: (v: string) => <StatusTag value={v} /> },
            { title: 'Rate', dataIndex: 'rate', render: (v: number) => `${v}%`, sorter: (a, b) => a.rate - b.rate },
            { title: 'Joined', dataIndex: 'joined', render: fmtDate, sorter: (a, b) => a.joined.localeCompare(b.joined) },
            {
              title: 'Status',
              dataIndex: 'active',
              render: (_, r: Rep) => (
                <Switch
                  size="small"
                  checked={r.active}
                  onChange={active => { saveRep({ ...r, active }) }}
                  checkedChildren="On"
                  unCheckedChildren="Off"
                />
              )
            },
            { title: '', key: 'edit', align: 'right', render: (_, r: Rep) => <Button type="link" onClick={() => { open(r) }}>Edit</Button> }
          ]}
        />
      </Card>

      <Modal
        title={editing === 'new' ? 'Add rep' : 'Edit rep'}
        open={editing != null}
        onCancel={() => { setEditing(null) }}
        onOk={() => { form.submit() }}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={submit} requiredMark={false}>
          <Form.Item name="name" label="Full name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
          <Space style={{ display: 'flex' }} styles={{ item: { flex: 1 } }}>
            <Form.Item name="region" label="Region"><Select options={['North', 'South', 'East', 'West'].map(v => ({ value: v }))} /></Form.Item>
            <Form.Item name="tier" label="Tier"><Select options={['Gold', 'Silver', 'Bronze'].map(v => ({ value: v }))} /></Form.Item>
          </Space>
          <Space style={{ display: 'flex' }} styles={{ item: { flex: 1 } }}>
            <Form.Item name="rate" label="Commission rate (%)" rules={[{ required: true }]}>
              <InputNumber min={0} max={50} step={0.5} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="joined" label="Joined"><DatePicker style={{ width: '100%' }} /></Form.Item>
          </Space>
          <Form.Item name="active" label="Active" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
