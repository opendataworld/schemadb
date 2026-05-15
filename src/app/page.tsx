import { ChatUI } from "@/components/chat"
import { auth } from "@/auth"
import Link from "next/link"

export default async function Home() {
  const session = await auth()
  const showChat = session?.user

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Schema.org Agent</h1>
              <p className="text-xs text-slate-400">AI-powered Q&A</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {showChat ? (
              <Link href="/chat" className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                Open Chat
              </Link>
            ) : (
              <Link href="/api/auth/signin" className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm mb-8">
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
          Powered by 12+ AI Providers
        </div>
        
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Ask anything about
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"> schema.org</span>
        </h2>
        
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          An AI assistant trained to answer your questions about schema.org vocabulary, 
          taxonomy, and structured data. Always cites sources from schema.org.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showChat ? (
            <Link href="/chat" className="px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-violet-600 transition-all hover:scale-105">
              Start Chatting →
            </Link>
          ) : (
            <>
              <Link href="/api/auth/signin" className="px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-violet-600 transition-all hover:scale-105">
                Get Started →
              </Link>
              <a href="https://schema.org" target="_blank" className="px-8 py-4 border border-slate-600 text-slate-300 rounded-xl font-semibold hover:border-slate-500 hover:bg-slate-800 transition-all">
                Learn More
              </a>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
            <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Schema Types</h3>
            <p className="text-slate-400">Learn about Thing, Person, Product, Organization, Event, and 1000+ more types.</p>
          </div>
          
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Structured Data</h3>
            <p className="text-slate-400">JSON-LD, Microdata, RDFa examples for your website.</p>
          </div>
          
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Answers</h3>
            <p className="text-slate-400">Streaming responses with citations from official docs.</p>
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-slate-800">
        <h3 className="text-center text-slate-400 mb-8">Supports 12+ AI providers including</h3>
        <div className="flex flex-wrap justify-center gap-6 text-slate-500">
          <span className="px-4 py-2 bg-slate-800 rounded-lg">Groq (free)</span>
          <span className="px-4 py-2 bg-slate-800 rounded-lg">OpenRouter (free)</span>
          <span className="px-4 py-2 bg-slate-800 rounded-lg">OpenAI</span>
          <span className="px-4 py-2 bg-slate-800 rounded-lg">Anthropic</span>
          <span className="px-4 py-2 bg-slate-800 rounded-lg">Google Cloud</span>
          <span className="px-4 py-2 bg-slate-800 rounded-lg">AWS</span>
          <span className="px-4 py-2 bg-slate-800 rounded-lg">Ollama</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-slate-800 text-center text-slate-500">
        <p>Open source at <a href="https://github.com/opendataworld/schemadb" className="text-violet-400 hover:underline">github.com/opendataworld/schemadb</a></p>
        <p className="mt-2 text-sm">Grounded in schema.org, Google, Wikipedia, and W3C documentation</p>
      </footer>
    </main>
  )
}