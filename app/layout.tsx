import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteTitle = 'Codex 活动卡片生成器'
const siteDescription =
  '一键生成并分享你的 Codex 使用活动卡片：自定义用户名、头像、累计 Token、峰值日和连续使用天数，导出精美图片分享到 X、LinkedIn 和 Reddit。'

export const metadata: Metadata = {
  metadataBase: new URL('https://codex-activity-card.vercel.app'),
  title: {
    default: siteTitle,
    template: '%s | Codex 活动卡片',
  },
  description: siteDescription,
  applicationName: siteTitle,
  keywords: [
    'Codex',
    'OpenAI Codex',
    '活动卡片',
    'Token 用量',
    '热力图',
    '分享卡片',
    'activity card',
    'contribution graph',
  ],
  authors: [{ name: 'Codex 活动卡片' }],
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    title: siteTitle,
    description: siteDescription,
    siteName: siteTitle,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f2f1ef',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh" className={`${geistSans.variable} ${geistMono.variable} bg-[#f2f1ef]`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
