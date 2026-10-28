import { useState } from 'react'
import { App as AntApp, ConfigProvider } from 'antd'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { theme } from './theme'
import { StoreProvider } from './data/store'
import AppLayout from './layout/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Reps from './pages/Reps'
import Trades from './pages/Trades'
import Payouts from './pages/Payouts'
import PayPeriods from './pages/PayPeriods'
import Reports from './pages/Reports'
import Team from './pages/Team'

const AUTH_KEY = 'revpilot_demo_user'

function readUser (): string | null {
  try { return localStorage.getItem(AUTH_KEY) } catch { return null }
}

export default function App (): JSX.Element {
  const [user, setUser] = useState<string | null>(readUser)

  const login = (name: string): void => {
    try { localStorage.setItem(AUTH_KEY, name) } catch { /* private mode */ }
    setUser(name)
  }
  const logout = (): void => {
    try { localStorage.removeItem(AUTH_KEY) } catch { /* private mode */ }
    setUser(null)
  }

  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <StoreProvider>
          <BrowserRouter>
            {user == null
              ? (
                <Routes>
                  <Route path="*" element={<Login onLogin={login} />} />
                </Routes>
                )
              : (
                <Routes>
                  <Route element={<AppLayout user={user} onLogout={logout} />}>
                    <Route path="/" element={<Dashboard user={user} />} />
                    <Route path="/reps" element={<Reps />} />
                    <Route path="/trades" element={<Trades />} />
                    <Route path="/payouts" element={<Payouts />} />
                    <Route path="/periods" element={<PayPeriods />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
                )}
          </BrowserRouter>
        </StoreProvider>
      </AntApp>
    </ConfigProvider>
  )
}
