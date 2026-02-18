

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-10 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-6">
          Vite + React + Tailwind v4
        </h1>
        
        <p className="text-xl text-slate-700 mb-8">
          Modern setup • 2026 style • zero config pain
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
            Get Started
          </button>
          <button className="px-8 py-4 bg-white border-2 border-slate-300 hover:border-slate-400 font-semibold rounded-xl transition-all hover:shadow-lg">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default App