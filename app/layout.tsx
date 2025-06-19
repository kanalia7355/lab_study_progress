import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RPI4 YOLO最適化学習進捗トラッカー',
  description: 'ラズパイ4でのYOLO最適化学習の進捗を管理するダッシュボード',
  keywords: 'YOLO, Raspberry Pi, 機械学習, 最適化, 進捗管理',
  authors: [{ name: 'RPI Research Team' }],
  themeColor: '#667eea',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-inter antialiased selection:bg-primary-100 selection:text-primary-900">
        <div className="relative min-h-screen">
          {/* Background decorative elements */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-primary-400/20 to-accent-400/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-accent-400/20 to-primary-400/20 blur-3xl" />
            <div className="absolute top-1/3 left-1/4 h-60 w-60 rounded-full bg-gradient-to-br from-success-400/10 to-primary-400/10 blur-2xl animate-pulse" />
          </div>
          
          {/* Main content */}
          <main className="relative z-10">
            {children}
          </main>
          
          {/* Noise texture overlay */}
          <div 
            className="pointer-events-none fixed inset-0 z-20 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>
      </body>
    </html>
  )
}