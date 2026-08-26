import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'URL Shortener',
  description: 'Shorten long URLs, create custom aliases, and track click analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-white">
        <nav className="border-b border-gray-800 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-400">
              SnipURL
            </a>
            <p className="text-gray-400 text-sm">
              Fast · Reliable · Trackable
            </p>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-10">
          {children}
        </div>
      </body>
    </html>
  )
}