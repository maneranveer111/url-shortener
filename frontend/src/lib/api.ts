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

export async function getOriginalUrl(shortCode: string) {
  try {
    const response = await fetch(`${API_URL}/api/original/${shortCode}`)

    let data
    try {
      data = await response.json()
    } catch (e) {
      // If parsing JSON fails, it's likely a 404 HTML page or server error
      throw new Error('Please enter a valid URL or shortname')
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Please enter a valid URL or shortname')
    }

    return data
  } catch (error) {
    if (error instanceof Error && error.message !== 'Failed to fetch') {
      throw error
    }
    throw new Error('Please enter a valid URL or shortname')
  }
}