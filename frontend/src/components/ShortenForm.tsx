'use client'

import { FormEvent, useState } from 'react'
import { shortenUrl } from '../lib/api'

export default function ShortenForm() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await shortenUrl(url, customCode)

      setResult(data.shortUrl)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="url">Long URL</label>

        <input
          id="url"
          type="url"
          placeholder="https://example.com/very/long/url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="customCode">Custom code (optional)</label>

        <input
          id="customCode"
          type="text"
          placeholder="my-link"
          value={customCode}
          onChange={(event) => setCustomCode(event.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Shortening...' : 'Shorten URL'}
      </button>

      {error && <p>{error}</p>}

      {result && (
        <p>
          Short URL:{' '}
          <a href={result} target="_blank" rel="noopener noreferrer">
            {result}
          </a>
        </p>
      )}
    </form>
  )
}