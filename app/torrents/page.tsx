'use client'

import { useState, useEffect } from 'react'
import rdApi from '@/lib/realDebridApi'
import { formatBytes, formatDate, getStatusColor } from '@/utils/formatters'

interface Torrent {
  id: string
  filename: string
  bytes: number
  status: string
  added: string
  progress: number
  speed?: number
  seeders?: number
}

export default function TorrentsPage() {
  const [torrents, setTorrents] = useState<Torrent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [magnetLink, setMagnetLink] = useState('')
  const [addingTorrent, setAddingTorrent] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [selectedTorrent, setSelectedTorrent] = useState<string | null>(null)
  const [streamingLinks, setStreamingLinks] = useState<{[key: string]: string}>({})

  useEffect(() => {
    const apiKey = localStorage.getItem('rd_api_key')
    if (apiKey) {
      rdApi.setApiKey(apiKey)
      loadTorrents()
    } else {
      setError('Please configure your API key on the home page')
      setLoading(false)
    }
  }, [])

  const loadTorrents = async () => {
    try {
      setLoading(true)
      const response = await rdApi.getTorrents()
      setTorrents(response.data || [])
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load torrents')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTorrent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!magnetLink.trim()) return

    try {
      setAddingTorrent(true)
      await rdApi.addTorrent(magnetLink)
      setMagnetLink('')
      await loadTorrents()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add torrent')
    } finally {
      setAddingTorrent(false)
    }
  }

  const handleDeleteTorrent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this torrent?')) return

    try {
      await rdApi.deleteTorrent(id)
      await loadTorrents()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete torrent')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingFile(true)
      await rdApi.addTorrentFile(file)
      e.target.value = '' // Reset file input
      await loadTorrents()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload torrent file')
    } finally {
      setUploadingFile(false)
    }
  }

  const handleGenerateStreamingLink = async (torrentId: string) => {
    try {
      const torrentInfo = await rdApi.getTorrentInfo(torrentId)
      if (torrentInfo.data.links && torrentInfo.data.links.length > 0) {
        // Unrestrict the first link to get streaming access
        const unrestrictedLink = await rdApi.unrestrictLink(torrentInfo.data.links[0])
        
        if (unrestrictedLink.data.id) {
          // Get streaming transcode link
          const streamingData = await rdApi.getStreamingTranscode(unrestrictedLink.data.id)
          
          if (streamingData.data && streamingData.data.apple && streamingData.data.apple.full) {
            setStreamingLinks({
              ...streamingLinks,
              [torrentId]: streamingData.data.apple.full
            })
            setSelectedTorrent(torrentId)
          } else {
            setError('No streaming link available for this file')
          }
        }
      } else {
        setError('Torrent must be downloaded first. Try selecting files if not done already.')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate streaming link')
    }
  }

  const handleCopyStreamingLink = (link: string) => {
    navigator.clipboard.writeText(link)
    alert('Streaming link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-400">Loading torrents...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Torrents</h1>
        <button onClick={loadTorrents} className="btn-secondary">
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add Torrent Form */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Add New Torrent</h2>
        
        {/* Magnet Link */}
        <form onSubmit={handleAddTorrent} className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Magnet Link</label>
            <input
              type="text"
              placeholder="magnet:?xt=urn:btih:..."
              value={magnetLink}
              onChange={(e) => setMagnetLink(e.target.value)}
              className="input-field"
              disabled={addingTorrent}
            />
          </div>
          <button
            type="submit"
            disabled={addingTorrent || !magnetLink.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingTorrent ? 'Adding...' : '🧲 Add Magnet Link'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-rd-dark text-gray-400">OR</span>
          </div>
        </div>

        {/* Torrent File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Torrent File</label>
          <input
            type="file"
            accept=".torrent"
            onChange={handleFileUpload}
            disabled={uploadingFile}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-rd-primary file:text-white
              hover:file:bg-rd-primary/80
              file:cursor-pointer cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {uploadingFile && (
            <p className="mt-2 text-sm text-gray-400">Uploading torrent file...</p>
          )}
        </div>
      </div>

      {/* Torrents List */}
      <div className="space-y-4">
        {torrents.length === 0 ? (
          <div className="card text-center text-gray-400">
            <p className="text-lg">No active torrents</p>
            <p className="text-sm">Add a magnet link to get started</p>
          </div>
        ) : (
          torrents.map((torrent) => (
            <div key={torrent.id} className="card hover:border-rd-primary transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2 truncate">{torrent.filename}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className={getStatusColor(torrent.status)}>
                      Status: {torrent.status.replace(/_/g, ' ')}
                    </span>
                    <span>Size: {formatBytes(torrent.bytes)}</span>
                    <span>Added: {formatDate(torrent.added)}</span>
                    {torrent.progress > 0 && (
                      <span>Progress: {torrent.progress}%</span>
                    )}
                  </div>
                  {torrent.progress > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-rd-dark rounded-full h-2">
                        <div
                          className="bg-rd-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${torrent.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {torrent.status === 'downloaded' && (
                    <button
                      onClick={() => handleGenerateStreamingLink(torrent.id)}
                      className="btn-primary whitespace-nowrap"
                    >
                      🎬 Stream
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTorrent(torrent.id)}
                    className="btn-secondary whitespace-nowrap"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* Streaming Link Display */}
              {streamingLinks[torrent.id] && selectedTorrent === torrent.id && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Streaming Link (HLS)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={streamingLinks[torrent.id]}
                      readOnly
                      className="input-field flex-1 text-sm"
                    />
                    <button
                      onClick={() => handleCopyStreamingLink(streamingLinks[torrent.id])}
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
