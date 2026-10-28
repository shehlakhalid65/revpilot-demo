import type { ReactNode } from 'react'
import { Space, Typography } from 'antd'

interface Props { title: string, subtitle?: string, extra?: ReactNode }

export default function PageHeader ({ title, subtitle, extra }: Props): JSX.Element {
  return (
    <div className="page-head">
      <div>
        <Typography.Title level={3}>{title}</Typography.Title>
        {subtitle != null && <p>{subtitle}</p>}
      </div>
      {extra != null && <Space wrap>{extra}</Space>}
    </div>
  )
}
