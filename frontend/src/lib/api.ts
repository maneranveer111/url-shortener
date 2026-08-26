const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function shortenUrl(url: string, customeCode ?: string) {
    const response = await fetch(`${API_URL}/api/shorten`, {
        method : 'POST',
        
        headers: {
            'Content-Type' : 'application/json',
        },

        body: JSON.stringify({
            url,
            customeCode: customeCode || undefined,
        }),
    })

    const data = await response.json()

    if(!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL')
    }

    return data
}