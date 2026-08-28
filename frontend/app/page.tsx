import ShortenForm from '../src/components/ShortenForm'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
      
      {/* Abstract geometric background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="z-10 text-center mb-10 w-full max-w-2xl animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[#333] bg-[#111]">
          <div className="pulse-dot" />
          <span className="text-xs font-medium text-[#aaa] uppercase tracking-widest">System Online</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight leading-tight">
          Link Management <br />
          <span className="text-[#888]">Built for Speed.</span>
        </h1>
        
        <p className="text-[#888] text-base md:text-lg max-w-md mx-auto leading-relaxed">
          Create, track, and manage short links with a minimal, high-performance interface.
        </p>
      </div>

      <div className="z-10 w-full animate-fade-in animate-delay-1">
        <ShortenForm />
      </div>

      <div className="z-10 mt-16 text-center animate-fade-in animate-delay-2">
        <p className="text-xs text-[#555] uppercase tracking-widest">
          Powered by Antigravity
        </p>
      </div>
    </main>
  )
}