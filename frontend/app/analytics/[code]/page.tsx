import { getAnalytics } from '../../../src/lib/api'

interface Click {
  id: number
  clickedAt: string
  userAgent: string
}

interface AnalyticsData {
  shortCode: string
  originalUrl: string
  totalClicks: number
  recentClicks: Click[]
  createdAt: string
}

function parseUserAgent(ua: string): { browser: string; os: string; icon: string } {
  let browser = 'Unknown'
  let os = 'Unknown'
  let icon = '🌐'

  if (ua.includes('Chrome') && !ua.includes('Edg')) { browser = 'Chrome'; icon = '🟢' }
  else if (ua.includes('Firefox')) { browser = 'Firefox'; icon = '🟠' }
  else if (ua.includes('Safari') && !ua.includes('Chrome')) { browser = 'Safari'; icon = '🔵' }
  else if (ua.includes('Edg')) { browser = 'Edge'; icon = '🔷' }

  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

  return { browser, os, icon }
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  let analytics: AnalyticsData | null = null
  let error: string | null = null

  try {
    const data = await getAnalytics(code)
    analytics = data.data
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load analytics'
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="glass-card p-8 text-center max-w-md w-full animate-fade-in">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/" className="link-accent text-sm font-medium inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
            ← Back to home
          </a>
        </div>
      </main>
    )
  }

  if (!analytics) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <div className="glass-card p-8 text-center max-w-md w-full animate-fade-in">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-500/10 border border-gray-500/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-gray-400 mb-4">Short URL not found</p>
          <a href="/" className="link-accent text-sm font-medium inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
            ← Back to home
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="space-y-8">

      {/* Header */}
      <div className="animate-fade-in">
        <a href="/" className="link-accent text-sm font-medium inline-flex items-center gap-1.5 hover:gap-2.5 transition-all mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to home
        </a>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Analytics
            </h1>
            <p className="text-sm text-gray-500">Link performance overview</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in animate-delay-1">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Clicks</p>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-extrabold gradient-text">
            {analytics.totalClicks}
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Short Code</p>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-bold text-white font-mono truncate" title={`/${analytics.shortCode}`}>
            /{analytics.shortCode}
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Created</p>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-semibold text-white">
            {new Date(analytics.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Original URL */}
      <div className="glass-card p-6 animate-fade-in animate-delay-2">
        <div className="flex items-center gap-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Original URL</p>
        </div>
        <a
          href={analytics.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-accent text-sm break-all font-mono leading-relaxed"
        >
          {analytics.originalUrl}
        </a>
      </div>

      {/* Recent Clicks */}
      <div className="glass-card p-6 animate-fade-in animate-delay-3">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h2 className="text-base font-semibold text-white">
              Recent Clicks
            </h2>
          </div>
          <span className="badge badge-indigo">
            {analytics.recentClicks.length} {analytics.recentClicks.length === 1 ? 'click' : 'clicks'}
          </span>
        </div>

        {analytics.recentClicks.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-500/10 border border-gray-500/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No clicks yet</p>
            <p className="text-gray-600 text-xs mt-1">Share your link to start tracking</p>
          </div>
        ) : (
          <div className="space-y-1">
            {analytics.recentClicks.map((click) => {
              const { browser, os, icon } = parseUserAgent(click.userAgent)
              return (
                <div
                  key={click.id}
                  className="click-row flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-base shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-200">
                        {browser} on {os}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(click.clickedAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 shrink-0">
                    {formatTimeAgo(click.clickedAt)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </main>
  )
}