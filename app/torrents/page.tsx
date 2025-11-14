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
        <form onSubmit={handleAddTorrent} className="space-y-4">
          <input
            type="text"
            placeholder="Paste magnet link here..."
            value={magnetLink}
            onChange={(e) => setMagnetLink(e.target.value)}
            className="input-field"
            disabled={addingTorrent}
          />
          <button
            type="submit"
            disabled={addingTorrent || !magnetLink.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingTorrent ? 'Adding...' : 'Add Torrent'}
          </button>
        </form>
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
                <button
                  onClick={() => handleDeleteTorrent(torrent.id)}
                  className="btn-secondary whitespace-nowrap"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
