import { Tag } from 'antd'

const COLORS: Record<string, string> = {
  Paid: 'green',
  Active: 'green',
  Open: 'blue',
  Processing: 'blue',
  Pending: 'gold',
  Closed: 'default',
  Inactive: 'red',
  Gold: 'gold',
  Silver: 'geekblue',
  Bronze: 'volcano',
  Buy: 'cyan',
  Sell: 'magenta',
  Owner: 'purple',
  Admin: 'blue',
  Viewer: 'default'
}

export default function StatusTag ({ value }: { value: string }): JSX.Element {
  return <Tag bordered={false} color={COLORS[value] ?? 'default'}>{value}</Tag>
}
