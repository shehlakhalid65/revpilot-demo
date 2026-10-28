import type { ThemeConfig } from 'antd'

export const brand = {
  name: 'RevPilot',
  tagline: 'Commission & payout management'
}

export const colors = {
  primary: '#6366F1',
  teal: '#14B8A6',
  amber: '#F59E0B',
  rose: '#F43F5E',
  sky: '#0EA5E9',
  sidebar: '#0F172A',
  sidebarHover: '#1E293B',
  bg: '#F4F6FB',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0'
}

export const theme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorBgLayout: colors.bg,
    colorText: colors.text,
    colorTextSecondary: colors.muted,
    colorBorderSecondary: colors.border,
    borderRadius: 10,
    fontFamily: 'Inter, -apple-system, "Segoe UI", Roboto, sans-serif'
  },
  components: {
    Layout: { siderBg: colors.sidebar, headerBg: '#FFFFFF' },
    Menu: {
      darkItemBg: colors.sidebar,
      darkItemSelectedBg: colors.primary,
      darkItemHoverBg: colors.sidebarHover,
      itemBorderRadius: 8
    },
    Table: { headerBg: '#F8FAFC', headerColor: colors.muted },
    Card: { borderRadiusLG: 14 }
  }
}
