"use client"

import { useState, useEffect } from "react"

interface Provider {
  id: string
  name: string
  available: boolean
}

interface ProviderSelectorProps {
  onSelect: (provider: string) => void
  current: string
}

export function ProviderSelector({ onSelect, current }: ProviderSelectorProps) {
  const [providers, setProviders] = useState<Provider[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProviders()
  }, [])

  async function fetchProviders() {
    try {
      const res = await fetch("/api/chat")
      const data = await res.json()
      setProviders(data.providers || [])
      
      // Auto-show popup if local only and no good options
      const hasGoodProvider = (data.providers || []).some((p: Provider) => p.id !== "local" && p.available)
      if (!hasGoodProvider) {
        setShowPopup(true)
      }
    } catch (e) {
      setError("Could not load providers")
    } finally {
      setLoading(false)
    }
  }

  const available = providers.filter(p => p.available)
  const currentProvider = providers.find(p => p.id === current)

  function handleSelect(id: string) {
    onSelect(id)
    setShowPopup(false)
  }

  if (loading) return <div className="text-sm text-gray-500">Loading providers...</div>

  return (
    <div className="relative">
      {/* Current display + button */}
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
      >
        <span className="text-green-500">●</span>
        <span>{currentProvider?.name || current}</span>
        <span className="text-gray-400">▼</span>
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-lg shadow-lg border p-2 z-50">
          <div className="text-xs font-medium text-gray-500 px-2 py-1">
            Select AI Provider
          </div>
          
          {available.length === 0 ? (
            <div className="px-2 py-3 text-sm text-gray-500">
              No providers available. Set an API key in your environment.
            </div>
          ) : (
            <div className="space-y-1">
              {providers.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className={`w-full text-left px-2 py-2 rounded text-sm flex items-center justify-between ${
                    p.id === current ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                  }`}
                >
                  <span>{p.name}</span>
                  {p.available ? (
                    <span className="text-green-500 text-xs">✓</span>
                  ) : (
                    <span className="text-gray-400 text-xs">Setup</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="border-t mt-2 pt-2">
            <div className="text-xs text-gray-500 px-2">Free options:</div>
            <a
              href="https://openrouter.ai/settings"
              target="_blank"
              className="block px-2 py-1 text-xs text-blue-500 hover:underline"
            >
              Get OpenRouter key
            </a>
            <a
              href="https://console.groq.com"
              target="_blank"
              className="block px-2 py-1 text-xs text-blue-500 hover:underline"
            >
              Get Groq key (free)
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// Error message with retry button
export function ProviderError({ 
  error, 
  available,
  onRetry 
}: { 
  error: string
  available: string[]
  onRetry: () => void
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <div className="text-red-600 text-sm font-medium">Provider failed</div>
      <div className="text-red-500 text-xs mt-1">{error}</div>
      
      <div className="mt-2 text-xs text-gray-500">
        Available: {available.join(", ")}
      </div>
      
      <button
        onClick={onRetry}
        className="mt-2 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        Try another
      </button>
    </div>
  )
}