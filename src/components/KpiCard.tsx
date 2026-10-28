import type { ReactNode } from 'react'
import { Card, Typography } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'

interface Props {
  label: string
  value: string
  icon: ReactNode
  color: string
  change?: number // % vs last period
}

export default function KpiCard ({ label, value, icon, color, change }: Props): JSX.Element {
  const up = (change ?? 0) >= 0
  return (
    <Card bordered={false} style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Typography.Text type="secondary">{label}</Typography.Text>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>{value}</div>
        </div>
        <div className="kpi-icon" style={{ background: `${color}1A`, color }}>{icon}</div>
      </div>
      {change != null && (
        <div style={{ marginTop: 10, fontSize: 13 }}>
          <span style={{ color: up ? '#059669' : '#E11D48', fontWeight: 600 }}>
            {up ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(change).toFixed(1)}%
          </span>
          <Typography.Text type="secondary"> vs last month</Typography.Text>
        </div>
      )}
    </Card>
  )
}
