import ShortenForm  from "@/src/components/ShortenForm";


export default function Home() {
  return (
    <main>
      <h1>Distributed URL Shotener</h1>

      <p>
        Shorten long URLs, create custom aliases, and track click analytics.
      </p>

      <ShortenForm />
    </main>
  )
}