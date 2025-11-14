'use client'

import { useState, useEffect } from 'react'
import rdApi from '@/lib/realDebridApi'
import { formatBytes, formatDate } from '@/utils/formatters'

interface Download {
  id: string
  filename: string
  download: string
  bytes: number
  generated: string
  host: string
  mimeType?: string
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [streamingLinks, setStreamingLinks] = useState<{[key: string]: string}>({})

  useEffect(() => {
    const apiKey = localStorage.getItem('rd_api_key')
    if (apiKey) {
      rdApi.setApiKey(apiKey)
      loadDownloads()
    } else {
      setError('Please configure your API key on the home page')
      setLoading(false)
    }
  }, [])

  const loadDownloads = async () => {
    try {
      setLoading(true)
      const response = await rdApi.getDownloads()
      setDownloads(response.data || [])
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load downloads')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDownload = async (id: string) => {
    if (!confirm('Are you sure you want to delete this download?')) return

    try {
      await rdApi.deleteDownload(id)
      await loadDownloads()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete download')
    }
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleGenerateStreamingLink = async (downloadId: string) => {
    try {
      const streamingData = await rdApi.getStreamingTranscode(downloadId)
      
      if (streamingData.data && streamingData.data.apple && streamingData.data.apple.full) {
        setStreamingLinks({
          ...streamingLinks,
          [downloadId]: streamingData.data.apple.full
        })
      } else {
        setError('No streaming link available for this file')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate streaming link')
    }
  }

  const handleCopyStreamingLink = (link: string) => {
    navigator.clipboard.writeText(link)
    alert('Streaming link copied to clipboard!')
  }

  const isVideoFile = (mimeType?: string, filename?: string) => {
    if (mimeType && mimeType.startsWith('video/')) return true
    if (filename) {
      const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v']
      return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext))
    }
    return false
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-400">Loading downloads...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Downloads</h1>
        <button onClick={loadDownloads} className="btn-secondary">
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Downloads List */}
      <div className="space-y-4">
        {downloads.length === 0 ? (
          <div className="card text-center text-gray-400">
            <p className="text-lg">No downloads yet</p>
            <p className="text-sm">Your unrestricted files will appear here</p>
          </div>
        ) : (
          downloads.map((download) => (
            <div key={download.id} className="card hover:border-rd-primary transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2 truncate">{download.filename}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>Size: {formatBytes(download.bytes)}</span>
                    <span>Host: {download.host}</span>
                    <span>Generated: {formatDate(download.generated)}</span>
                    {download.mimeType && (
                      <span>Type: {download.mimeType}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isVideoFile(download.mimeType, download.filename) && (
                    <button
                      onClick={() => handleGenerateStreamingLink(download.id)}
                      className="btn-primary whitespace-nowrap"
                    >
                      🎬 Stream
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(download.download, download.filename)}
                    className="btn-primary whitespace-nowrap"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => handleDeleteDownload(download.id)}
                    className="btn-secondary whitespace-nowrap"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Streaming Link Display */}
              {streamingLinks[download.id] && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Streaming Link (HLS)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={streamingLinks[download.id]}
                      readOnly
                      className="input-field flex-1 text-sm"
                    />
                    <button
                      onClick={() => handleCopyStreamingLink(streamingLinks[download.id])}
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
          ))
        )}
      </div>
    </div>
  )
}
