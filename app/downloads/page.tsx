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
            </div>
          ))
        )}
      </div>
    </div>
  )
}
