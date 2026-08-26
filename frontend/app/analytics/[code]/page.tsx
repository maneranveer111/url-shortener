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
      <main>
        <div className="bg-red-900/40 border border-red-700 rounded-2xl p-8 text-center">
          <p className="text-red-400">{error}</p>
          <a href="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300">
            ← Back to home
          </a>
        </div>
      </main>
    )
  }

  if (!analytics) {
    return (
      <main>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <p className="text-gray-400">Short URL not found</p>
          <a href="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300">
            ← Back to home
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="space-y-6">

      <div>
        <a href="/" className="text-gray-400 hover:text-gray-300 text-sm">
          ← Back to home
        </a>
        <h1 className="text-3xl font-bold text-white mt-2">
          Analytics
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total Clicks</p>
          <p className="text-4xl font-bold text-blue-400">
            {analytics.totalClicks}
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Short Code</p>
          <p className="text-2xl font-bold text-white">
            /{analytics.shortCode}
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Created</p>
          <p className="text-lg font-semibold text-white">
            {new Date(analytics.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p className="text-gray-400 text-sm mb-1">Original URL</p>
        <a
          href={analytics.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 break-all"
        >
          {analytics.originalUrl}
        </a>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Clicks
        </h2>

        {analytics.recentClicks.length === 0 ? (
          <p className="text-gray-400">No clicks yet</p>
        ) : (
          <div className="space-y-3">
            {analytics.recentClicks.map((click) => (
              <div
                key={click.id}
                className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
              >
                <p className="text-gray-300 text-sm">
                  {new Date(click.clickedAt).toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs truncate max-w-xs ml-4">
                  {click.userAgent}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  )
}