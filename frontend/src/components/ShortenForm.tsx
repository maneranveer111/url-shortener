'use client'

import { FormEvent, useState } from 'react'
import { shortenUrl, getOriginalUrl } from '../lib/api'

export default function ShortenForm() {
  const [activeTab, setActiveTab] = useState<'shorten' | 'lookup'>('shorten')
  
  // Shorten state
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [shortenResult, setShortenResult] = useState<string | null>(null)
  
  // Lookup state
  const [lookupCode, setLookupCode] = useState('')
  const [lookupResult, setLookupResult] = useState<{ originalUrl: string } | null>(null)
  
  // Common state
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleShortenSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setShortenResult(null)

    try {
      const data = await shortenUrl(url, customCode)
      setShortenResult(data.shortUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleLookupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setLookupResult(null)

    try {
      // Extract code if user pasted a full short URL
      let code = lookupCode.trim()
      try {
        const parsedUrl = new URL(code)
        code = parsedUrl.pathname.split('/').pop() || code
      } catch (e) {
        // Not a full URL, treat as code
      }

      const data = await getOriginalUrl(code)
      setLookupResult({ originalUrl: data.originalUrl })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card p-6 md:p-8 max-w-lg mx-auto w-full">
      <div className="tabs-container">
        <button
          type="button"
          className={`tab-button ${activeTab === 'shorten' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('shorten')
            setError(null)
          }}
        >
          Shorten URL
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'lookup' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('lookup')
            setError(null)
          }}
        >
          Lookup Original
        </button>
      </div>

      {activeTab === 'shorten' ? (
        <form onSubmit={handleShortenSubmit} className="space-y-4 animate-fade-in">
          <div>
            <label htmlFor="url" className="block text-xs font-semibold text-[#888] mb-2 uppercase tracking-wider">
              Long URL
            </label>
            <input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="customCode" className="block text-xs font-semibold text-[#888] mb-2 uppercase tracking-wider">
              Custom Alias (Optional)
            </label>
            <input
              id="customCode"
              type="text"
              placeholder="my-link"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-accent w-full mt-2">
            {loading ? 'Shortening...' : 'Create Link'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleLookupSubmit} className="space-y-4 animate-fade-in">
          <div>
            <label htmlFor="lookupCode" className="block text-xs font-semibold text-[#888] mb-2 uppercase tracking-wider">
              Shortcode or Link
            </label>
            <input
              id="lookupCode"
              type="text"
              placeholder="e.g. my-link or https://my.domain/my-link"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-accent w-full mt-2">
            {loading ? 'Looking up...' : 'Lookup URL'}
          </button>
        </form>
      )}

      {error && (
        <div className="mt-6 p-4 border border-[#e00]/20 bg-[#e00]/5 rounded-md animate-fade-in">
          <p className="text-[#e00] text-sm">{error}</p>
        </div>
      )}

      {activeTab === 'shorten' && shortenResult && (
        <div className="mt-6 p-4 border border-[#333] bg-[#0a0a0a] rounded-md animate-fade-in">
          <p className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2">
            Your Short URL
          </p>
          <div className="flex items-center gap-3">
            <a href={shortenResult} target="_blank" rel="noopener noreferrer" className="link-accent truncate flex-1 text-sm font-mono">
              {shortenResult}
            </a>
            <button
              onClick={() => handleCopy(shortenResult)}
              className="btn-secondary text-xs py-1 px-3 shrink-0"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-[#333]">
             <a
              href={`/analytics/${shortenResult.split('/').pop()}`}
              className="text-xs text-[#888] hover:text-white transition-colors flex items-center gap-1"
            >
              View Analytics →
            </a>
          </div>
        </div>
      )}

      {activeTab === 'lookup' && lookupResult && (
        <div className="mt-6 p-4 border border-[#333] bg-[#0a0a0a] rounded-md animate-fade-in">
          <p className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2">
            Original URL
          </p>
          <div className="flex flex-col gap-2">
            <a href={lookupResult.originalUrl} target="_blank" rel="noopener noreferrer" className="link-accent text-sm font-mono break-all">
              {lookupResult.originalUrl}
            </a>
            <button
              onClick={() => handleCopy(lookupResult.originalUrl)}
              className="btn-secondary text-xs py-1.5 px-3 self-start mt-2"
            >
              {copied ? 'Copied' : 'Copy URL'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}