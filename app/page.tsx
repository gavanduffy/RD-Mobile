'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [apiKey, setApiKey] = useState('')
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const storedKey = localStorage.getItem('rd_api_key')
    if (storedKey) {
      setApiKey(storedKey)
      setIsConfigured(true)
    }
  }, [])

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('rd_api_key', apiKey.trim())
      setIsConfigured(true)
    }
  }

  const handleClearApiKey = () => {
    localStorage.removeItem('rd_api_key')
    setApiKey('')
    setIsConfigured(false)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-rd-primary to-blue-400 bg-clip-text text-transparent">
          RD-Mobile
        </h1>
        <p className="text-xl text-gray-300">
          Modern Real-Debrid Manager with PWA Support
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Manage your Real-Debrid account with a beautiful, responsive interface 
          optimized for both desktop and mobile devices.
        </p>
      </div>

      {/* API Configuration */}
      <div className="card max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">
          {isConfigured ? '✓ API Key Configured' : 'Configure API Key'}
        </h2>
        <p className="text-gray-400 mb-4">
          Get your API key from{' '}
          <a 
            href="https://real-debrid.com/apitoken" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-rd-primary hover:underline"
          >
            Real-Debrid API Token page
          </a>
        </p>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Enter your Real-Debrid API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="input-field"
            disabled={isConfigured}
          />
          <div className="flex gap-2">
            {!isConfigured ? (
              <button onClick={handleSaveApiKey} className="btn-primary flex-1">
                Save API Key
              </button>
            ) : (
              <button onClick={handleClearApiKey} className="btn-secondary flex-1">
                Update API Key
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      {isConfigured && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/torrents" className="card hover:border-rd-primary transition-colors cursor-pointer">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold mb-2">Torrents</h3>
            <p className="text-gray-400">
              Add and manage your torrents. View active downloads and torrent history.
            </p>
          </Link>

          <Link href="/downloads" className="card hover:border-rd-primary transition-colors cursor-pointer">
            <div className="text-4xl mb-4">📥</div>
            <h3 className="text-xl font-semibold mb-2">Downloads</h3>
            <p className="text-gray-400">
              Access your download history and manage cached files.
            </p>
          </Link>

          <Link href="/unrestrict" className="card hover:border-rd-primary transition-colors cursor-pointer">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-2">Unrestrict Link</h3>
            <p className="text-gray-400">
              Generate premium download links from supported hosters.
            </p>
          </Link>

          <Link href="/account" className="card hover:border-rd-primary transition-colors cursor-pointer">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">Account</h3>
            <p className="text-gray-400">
              View your account information, subscription status, and usage statistics.
            </p>
          </Link>

          <div className="card hover:border-rd-primary transition-colors">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">PWA Support</h3>
            <p className="text-gray-400">
              Install as an app on your device for offline access and native experience.
            </p>
          </div>

          <div className="card hover:border-rd-primary transition-colors">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Modern Design</h3>
            <p className="text-gray-400">
              Beautiful, responsive interface built with the latest web technologies.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
