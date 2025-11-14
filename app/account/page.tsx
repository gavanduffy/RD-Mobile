'use client'

import { useState, useEffect } from 'react'
import rdApi from '@/lib/realDebridApi'
import { formatBytes, formatDate } from '@/utils/formatters'

interface UserInfo {
  id: number
  username: string
  email: string
  points: number
  locale: string
  avatar: string
  type: string
  premium: number
  expiration: string
}

interface TrafficInfo {
  left: number
  bytes: number
  links: number
  limit: number
  type: string
  extra: number
  reset: string
}

export default function AccountPage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [traffic, setTraffic] = useState<TrafficInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const apiKey = localStorage.getItem('rd_api_key')
    if (apiKey) {
      rdApi.setApiKey(apiKey)
      loadAccountData()
    } else {
      setError('Please configure your API key on the home page')
      setLoading(false)
    }
  }, [])

  const loadAccountData = async () => {
    try {
      setLoading(true)
      const [userResponse, trafficResponse] = await Promise.all([
        rdApi.getUser(),
        rdApi.getTraffic(),
      ])
      setUser(userResponse.data)
      setTraffic(trafficResponse.data)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load account data')
    } finally {
      setLoading(false)
    }
  }

  const isPremium = user && user.premium > 0

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-400">Loading account info...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Account</h1>
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Account</h1>
        <button onClick={loadAccountData} className="btn-secondary">
          🔄 Refresh
        </button>
      </div>

      {/* User Info Card */}
      {user && (
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            {user.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.username}
                className="w-20 h-20 rounded-full border-2 border-rd-primary"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Account Type</label>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-semibold ${isPremium ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {isPremium ? '⭐ Premium' : 'Free'}
                </span>
              </div>
            </div>

            {isPremium && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Expires</label>
                <p className="text-lg font-semibold">{formatDate(user.expiration)}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Fidelity Points</label>
              <p className="text-lg font-semibold">{user.points.toLocaleString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">User ID</label>
              <p className="text-lg font-semibold">#{user.id}</p>
            </div>
          </div>
        </div>
      )}

      {/* Traffic Info Card */}
      {traffic && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Traffic Information</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-400">Traffic Used</label>
                <span className="text-sm text-gray-400">
                  {formatBytes(traffic.bytes)} / {formatBytes(traffic.limit)}
                </span>
              </div>
              <div className="w-full bg-rd-dark rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-rd-primary to-blue-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((traffic.bytes / traffic.limit) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Remaining</label>
                <p className="text-lg font-semibold text-green-400">{formatBytes(traffic.left)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Links Downloaded</label>
                <p className="text-lg font-semibold">{traffic.links.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Extra Traffic</label>
                <p className="text-lg font-semibold">{formatBytes(traffic.extra)}</p>
              </div>
            </div>

            {traffic.reset && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Traffic Resets</label>
                <p className="text-lg font-semibold">{formatDate(traffic.reset)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="https://real-debrid.com/account"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-center"
          >
            🔗 Manage Account on Real-Debrid
          </a>
          <a
            href="https://real-debrid.com/premium"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center"
          >
            ⭐ Upgrade to Premium
          </a>
        </div>
      </div>
    </div>
  )
}
