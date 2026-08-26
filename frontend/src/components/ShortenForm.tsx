'use client'

import { FormEvent, useState } from 'react'
import { shortenUrl } from '../lib/api'

export default function ShortenForm() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

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
        error instanceof Error ? error.message : 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Long URL
          </label>
          <input
            id="url"
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="customCode"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Custom code{' '}
            <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <input
            id="customCode"
            type="text"
            placeholder="my-link"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>

      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-900/40 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-900/40 border border-green-700 rounded-lg">
          <p className="text-green-400 text-sm font-medium mb-2">
            Your short URL is ready
          </p>
          <div className="flex items-center gap-3">
            <a
              href={result}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 truncate flex-1"
            >
              {result}
            </a>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors shrink-0"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <a
            href={`/analytics/${result.split('/').pop()}`}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            View Analytics
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  )
}