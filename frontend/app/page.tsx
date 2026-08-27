import ShortenForm from '../src/components/ShortenForm'

export default function Home() {
  return (
    <main>
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span className="text-xs font-medium text-indigo-300">Fast & Reliable URL Shortener</span>
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Shorten Your <span className="gradient-text">URLs</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
          Create short links with custom aliases and track every click in real-time.
        </p>
      </div>

      <div className="animate-fade-in animate-delay-2">
        <ShortenForm />
      </div>
    </main>
  )
}