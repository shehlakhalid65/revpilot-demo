import { Button, Checkbox, Divider, Form, Input, Typography } from 'antd'
import { CheckCircleFilled, LockOutlined, MailOutlined } from '@ant-design/icons'
import { brand } from '../theme'

const FEATURES = [
  'Track every trade and the commission it earns',
  'Automated monthly payouts with fees applied',
  'Rep, month and year-to-date reports with CSV export'
]

export default function Login ({ onLogin }: { onLogin: (name: string) => void }): JSX.Element {
  return (
    <div className="login-wrap">
      <div className="login-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, fontWeight: 700 }}>
          <img src="/logo.svg" alt="" width={40} height={40} />
          {brand.name}
        </div>
        <div>
          <h1 style={{ fontSize: 40, lineHeight: 1.15, margin: '0 0 16px', fontWeight: 700 }}>
            Pay your sales team<br />right, every month.
          </h1>
          <p style={{ fontSize: 16, opacity: 0.85, maxWidth: 440, marginBottom: 28 }}>
            {brand.name} turns trades into accurate commissions and payouts, with no spreadsheets.
          </p>
          {FEATURES.map(f => (
            <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 15 }}>
              <CheckCircleFilled style={{ color: '#5EEAD4', marginTop: 3 }} /> {f}
            </div>
          ))}
        </div>
        <div style={{ opacity: 0.6, fontSize: 13 }}>© {new Date().getFullYear()} {brand.name}. Demo build.</div>
      </div>

      <div className="login-form">
        <div style={{ width: '100%', maxWidth: 380 }}>
          <Typography.Title level={2} style={{ marginBottom: 4 }}>Welcome back</Typography.Title>
          <Typography.Text type="secondary">Sign in to your workspace</Typography.Text>

          <Form
            layout="vertical"
            style={{ marginTop: 28 }}
            initialValues={{ email: 'jordan@revpilot.demo', password: 'demo1234', remember: true }}
            onFinish={() => { onLogin('Jordan Ellis') }}
            requiredMark={false}
          >
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input size="large" prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
              <Input.Password size="large" prefix={<LockOutlined />} />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Typography.Link>Forgot password?</Typography.Link>
            </div>
            <Button type="primary" htmlType="submit" size="large" block>Sign in</Button>
          </Form>

          <Divider plain><Typography.Text type="secondary">or</Typography.Text></Divider>
          <Button size="large" block onClick={() => { onLogin('Demo User') }}>Continue as demo user</Button>
        </div>
      </div>
    </div>
  )
}
