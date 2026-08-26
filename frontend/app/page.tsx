import ShortenForm from '../src/components/ShortenForm'

export default function Home() {
  return (
    <main>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Shorten Your URLs
        </h1>
        <p className="text-gray-400 text-lg">
          Create short links, custom aliases, and track every click
        </p>
      </div>

      <ShortenForm />
    </main>
  )
}