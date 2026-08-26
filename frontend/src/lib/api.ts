const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function shortenUrl(url: string, customCode?: string) {
  const response = await fetch(`${API_URL}/api/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      customCode: customCode || undefined,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to shorten URL')
  }

  return data
}

export async function getAnalytics(shortCode: string) {
  console.log('Fetching analytics for:', shortCode)
  console.log('API URL:', API_URL)

  const response = await fetch(`${API_URL}/api/analytics/${shortCode}`)

  console.log('Response status:', response.status)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch analytics')
  }

  return data
}