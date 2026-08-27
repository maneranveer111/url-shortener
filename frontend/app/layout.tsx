import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SnipURL — Shorten, Share, Track',
  description: 'Shorten long URLs, create custom aliases, and track click analytics with SnipURL',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="border-b border-white/[0.06] backdrop-blur-xl bg-black/20 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SnipURL</span>
            </a>
            <div className="flex items-center gap-1.5">
              <span className="pulse-dot"></span>
              <span className="text-xs font-medium text-gray-400">Online</span>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {children}
        </div>
      </body>
    </html>
  )
}