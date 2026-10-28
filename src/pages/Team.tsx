import { Avatar, Button, Card, Space, Table, Typography } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'

import { useStore } from '../data/store'
import type { TeamMember } from '../data/types'
import PageHeader from '../components/PageHeader'
import StatusTag from '../components/StatusTag'
import { colors } from '../theme'
import { fmtDate } from '../utils'

export default function Team (): JSX.Element {
  const { team } = useStore()

  return (
    <div className="page">
      <PageHeader
        title="Team"
        subtitle="People who can access this workspace."
        extra={<Button type="primary" icon={<UserAddOutlined />}>Invite member</Button>}
      />
      <Card bordered={false} styles={{ body: { padding: 0 } }}>
        <Table
          rowKey="id"
          dataSource={team}
          pagination={false}
          scroll={{ x: 560 }}
          columns={[
            {
              title: 'Member',
              key: 'name',
              render: (_, m: TeamMember) => (
                <Space>
                  <Avatar style={{ background: colors.teal }}>{m.name.charAt(0)}</Avatar>
                  <div>
                    <Typography.Text strong>{m.name}</Typography.Text><br />
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>{m.email}</Typography.Text>
                  </div>
                </Space>
              )
            },
            { title: 'Role', dataIndex: 'role', render: (v: string) => <StatusTag value={v} /> },
            { title: 'Last active', dataIndex: 'lastActive', render: fmtDate }
          ]}
        />
      </Card>
    </div>
  )
}
