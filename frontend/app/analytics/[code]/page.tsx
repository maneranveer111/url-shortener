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

interface PageProps {
  params: {
    code: string
  }
}

export default async function AnalyticsPage({ params, }: {
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
        <h1>Analytics</h1>
        <p>{error}</p>
      </main>
    )
  }

  if (!analytics) {
    return (
      <main>
        <h1>Analytics</h1>
        <p>Short URL not found</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Analytics for /{analytics.shortCode}</h1>

      <p>Original URL: {analytics.originalUrl}</p>

      <p>Total Clicks: {analytics.totalClicks}</p>

      <p>Created: {new Date(analytics.createdAt).toLocaleDateString()}</p>

      <h2>Recent Clicks</h2>

      {analytics.recentClicks.length === 0 ? (
        <p>No clicks yet</p>
      ) : (
        <ul>
          {analytics.recentClicks.map((click) => (
            <li key={click.id}>
              {new Date(click.clickedAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}