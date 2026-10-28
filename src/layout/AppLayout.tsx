import { useState } from 'react'
import { Avatar, Badge, Button, Dropdown, Grid, Input, Layout, Menu, Space, Typography } from 'antd'
import {
  BarChartOutlined, BellOutlined, CalendarOutlined, DashboardOutlined, LogoutOutlined,
  MenuOutlined, SearchOutlined, SwapOutlined, TeamOutlined, UserOutlined, WalletOutlined
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { brand, colors } from '../theme'

const { Sider, Header, Content } = Layout

const NAV = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/reps', icon: <UserOutlined />, label: 'Sales Reps' },
  { key: '/trades', icon: <SwapOutlined />, label: 'Trades' },
  { key: '/payouts', icon: <WalletOutlined />, label: 'Payouts' },
  { key: '/periods', icon: <CalendarOutlined />, label: 'Pay Periods' },
  { key: '/reports', icon: <BarChartOutlined />, label: 'Reports' },
  { key: '/team', icon: <TeamOutlined />, label: 'Team' }
]

interface Props { user: string, onLogout: () => void }

export default function AppLayout ({ user, onLogout }: Props): JSX.Element {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const screens = Grid.useBreakpoint()
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = screens.md === false

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={232}
        collapsed={isMobile ? collapsed : false}
        collapsedWidth={isMobile ? 0 : 80}
        trigger={null}
        style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 20 }}
      >
        <div className="sider-brand">
          <img src="/logo.svg" alt="" />
          {brand.name}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={NAV}
          style={{ padding: '0 12px', border: 'none' }}
          onClick={({ key }) => {
            navigate(key)
            if (isMobile) setCollapsed(true)
          }}
        />
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <div style={{ background: colors.sidebarHover, borderRadius: 12, padding: 14, color: '#CBD5E1', fontSize: 12 }}>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}>Demo workspace</div>
            Sample data only. Changes reset on refresh.
          </div>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            borderBottom: `1px solid ${colors.border}`,
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          {isMobile && (
            <Button type="text" icon={<MenuOutlined />} onClick={() => { setCollapsed(c => !c) }} />
          )}
          <Input
            prefix={<SearchOutlined style={{ color: colors.muted }} />}
            placeholder="Search reps, trades, clients…"
            variant="filled"
            style={{ maxWidth: 360 }}
          />
          <Space size={16} style={{ marginLeft: 'auto' }}>
            <Badge dot>
              <Button type="text" shape="circle" icon={<BellOutlined />} />
            </Badge>
            <Dropdown
              menu={{
                items: [{ key: 'logout', icon: <LogoutOutlined />, label: 'Sign out', onClick: onLogout }]
              }}
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ background: colors.primary }}>{user.charAt(0).toUpperCase()}</Avatar>
                {screens.sm === true && (
                  <div style={{ lineHeight: 1.2 }}>
                    <Typography.Text strong>{user}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>Admin</Typography.Text>
                  </div>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
