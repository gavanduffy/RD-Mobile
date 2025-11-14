'use client'

import { useState, useEffect } from 'react'
import rdApi from '@/lib/realDebridApi'
import { formatBytes } from '@/utils/formatters'

interface UnrestrictedLink {
  id: string
  filename: string
  download: string
  filesize: number
  host: string
  mimeType?: string
}

export default function UnrestrictPage() {
  const [link, setLink] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<UnrestrictedLink | null>(null)
  const [checkResult, setCheckResult] = useState<any>(null)
  const [apiConfigured, setApiConfigured] = useState(false)
  const [streamingLink, setStreamingLink] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = localStorage.getItem('rd_api_key')
    if (apiKey) {
      rdApi.setApiKey(apiKey)
      setApiConfigured(true)
    } else {
      setError('Please configure your API key on the home page')
    }
  }, [])

  const handleCheckLink = async () => {
    if (!link.trim()) return

    try {
      setChecking(true)
      setError('')
      setCheckResult(null)
      
      const response = await rdApi.checkLink(link, password || undefined)
      setCheckResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to check link')
      setCheckResult(null)
    } finally {
      setChecking(false)
    }
  }

  const handleUnrestrict = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!link.trim()) return

    try {
      setLoading(true)
      setError('')
      setResult(null)
      setStreamingLink(null)
      
      const response = await rdApi.unrestrictLink(link, password || undefined)
      setResult(response.data)
      
      // Try to get streaming link if it's a video file
      if (response.data.id) {
        try {
          const streamingData = await rdApi.getStreamingTranscode(response.data.id)
          if (streamingData.data && streamingData.data.apple && streamingData.data.apple.full) {
            setStreamingLink(streamingData.data.apple.full)
          }
        } catch {
          // Streaming not available, continue without it
        }
      }
      
      setLink('')
      setPassword('')
      setCheckResult(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to unrestrict link')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (url: string, filename: string) => {
    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = filename
    downloadLink.target = '_blank'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  const handleCopyLink = () => {
    if (result?.download) {
      navigator.clipboard.writeText(result.download)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Unrestrict Link</h1>

      <div className="card">
        <p className="text-gray-400 mb-6">
          Enter a link from a supported file hoster to generate a premium download link. 
          Supported hosters include Rapidgator, 1fichier, Uptobox, and many more.
        </p>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleUnrestrict} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">File Hoster Link</label>
            <input
              type="url"
              placeholder="https://example.com/file/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="input-field"
              disabled={loading || !apiConfigured}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Password (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter password if required..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              disabled={loading || !apiConfigured}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCheckLink}
              disabled={checking || !link.trim() || !apiConfigured}
              className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checking ? 'Checking...' : '🔍 Check Link'}
            </button>
            <button
              type="submit"
              disabled={loading || !link.trim() || !apiConfigured}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : '🔓 Unrestrict Link'}
            </button>
          </div>
        </form>
      </div>

      {/* Check Link Result */}
      {checkResult && (
        <div className="card border-blue-500">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">ℹ️ Link Check Result</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Host</label>
              <p className="text-white">{checkResult.host}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Supported</label>
              <p className={checkResult.supported ? 'text-green-400' : 'text-red-400'}>
                {checkResult.supported ? '✓ Yes' : '✗ No'}
              </p>
            </div>

            {checkResult.filename && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Filename</label>
                <p className="text-white break-all">{checkResult.filename}</p>
              </div>
            )}

            {checkResult.filesize && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">File Size</label>
                <p className="text-white">{formatBytes(checkResult.filesize)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="card border-rd-primary">
          <h2 className="text-xl font-semibold mb-4 text-green-400">✓ Link Unrestricted Successfully</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Filename</label>
              <p className="text-white break-all">{result.filename}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">File Size</label>
                <p className="text-white">{formatBytes(result.filesize)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Host</label>
                <p className="text-white">{result.host}</p>
              </div>
            </div>

            {result.mimeType && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">File Type</label>
                <p className="text-white">{result.mimeType}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Download Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={result.download}
                  readOnly
                  className="input-field flex-1"
                />
                <button
                  onClick={handleCopyLink}
                  className="btn-secondary whitespace-nowrap"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(result.download, result.filename)}
                className="btn-primary flex-1"
              >
                📥 Download File
              </button>
            </div>

            {/* Streaming Link */}
            {streamingLink && (
              <div className="pt-4 border-t border-gray-700">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Streaming Link (HLS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={streamingLink}
                    readOnly
                    className="input-field flex-1 text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(streamingLink)
                      alert('Streaming link copied!')
                    }}
                    className="btn-secondary whitespace-nowrap"
                  >
                    📋 Copy
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Use this link in any HLS-compatible video player
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Supported Hosters Info */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Supported File Hosters</h2>
        <p className="text-gray-400 text-sm mb-4">
          Real-Debrid supports over 70 file hosters. Some of the most popular include:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-300">
          <div>• 1fichier.com</div>
          <div>• Rapidgator.net</div>
          <div>• Uptobox.com</div>
          <div>• Nitroflare.com</div>
          <div>• Uploaded.net</div>
          <div>• FileFactory.com</div>
          <div>• Turbobit.net</div>
          <div>• Keep2Share.cc</div>
          <div>• Mega.nz</div>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          Visit{' '}
          <a 
            href="https://real-debrid.com/compare" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-rd-primary hover:underline"
          >
            Real-Debrid&apos;s website
          </a>
          {' '}for the complete list of supported hosters.
        </p>
      </div>
    </div>
  )
}
