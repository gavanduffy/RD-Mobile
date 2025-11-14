import axios, { AxiosInstance } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_RD_API_URL || 'https://api.real-debrid.com/rest/1.0'

class RealDebridAPI {
  private client: AxiosInstance
  private apiKey: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  setApiKey(key: string) {
    this.apiKey = key
    this.client.defaults.headers.common['Authorization'] = `Bearer ${key}`
  }

  getApiKey(): string | null {
    return this.apiKey
  }

  // User endpoints
  async getUser() {
    return this.client.get('/user')
  }

  // Torrents endpoints
  async getTorrents(offset = 0, limit = 50) {
    return this.client.get('/torrents', {
      params: { offset, limit },
    })
  }

  async getTorrentInfo(id: string) {
    return this.client.get(`/torrents/info/${id}`)
  }

  async addTorrent(magnet: string) {
    const formData = new URLSearchParams()
    formData.append('magnet', magnet)
    return this.client.post('/torrents/addMagnet', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  }

  async selectFiles(id: string, files: string) {
    const formData = new URLSearchParams()
    formData.append('files', files)
    return this.client.post(`/torrents/selectFiles/${id}`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  }

  async deleteTorrent(id: string) {
    return this.client.delete(`/torrents/delete/${id}`)
  }

  // Downloads endpoints
  async getDownloads(offset = 0, limit = 50) {
    return this.client.get('/downloads', {
      params: { offset, limit },
    })
  }

  async deleteDownload(id: string) {
    return this.client.delete(`/downloads/delete/${id}`)
  }

  // Unrestrict endpoints
  async unrestrictLink(link: string, password?: string, remote?: number) {
    const formData = new URLSearchParams()
    formData.append('link', link)
    if (password) formData.append('password', password)
    if (remote !== undefined) formData.append('remote', remote.toString())
    return this.client.post('/unrestrict/link', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  }

  async checkLink(link: string, password?: string) {
    const formData = new URLSearchParams()
    formData.append('link', link)
    if (password) formData.append('password', password)
    return this.client.post('/unrestrict/check', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  }

  // Streaming endpoints
  async getStreamingTranscode(id: string) {
    return this.client.get(`/streaming/transcode/${id}`)
  }

  async getStreamingMediaInfo(id: string) {
    return this.client.get(`/streaming/mediaInfos/${id}`)
  }

  // Torrents file upload endpoint
  async addTorrentFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return this.client.put('/torrents/addTorrent', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  // Get available instant downloads for magnet/hash
  async getInstantAvailability(...hashes: string[]) {
    return this.client.get(`/torrents/instantAvailability/${hashes.join('/')}`)
  }

  // Get available torrent hosts
  async getTorrentActiveCount() {
    return this.client.get('/torrents/activeCount')
  }

  async getTorrentAvailableHosts() {
    return this.client.get('/torrents/availableHosts')
  }

  // Hosts endpoints
  async getHosts() {
    return this.client.get('/hosts')
  }

  async getHostsStatus() {
    return this.client.get('/hosts/status')
  }

  async getHostsRegex() {
    return this.client.get('/hosts/regex')
  }

  async getHostsRegexFolder() {
    return this.client.get('/hosts/regexFolder')
  }

  async getHostsDomains() {
    return this.client.get('/hosts/domains')
  }

  // Settings endpoints
  async getSettings() {
    return this.client.get('/settings')
  }

  async updateSettings(setting_name: string, setting_value: string) {
    const formData = new URLSearchParams()
    formData.append('setting_name', setting_name)
    formData.append('setting_value', setting_value)
    return this.client.post('/settings/update', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  }

  async convertPoints() {
    return this.client.post('/settings/convertPoints')
  }

  async changePassword() {
    return this.client.post('/settings/changePassword')
  }

  async avatarFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return this.client.put('/settings/avatarFile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  async avatarDelete() {
    return this.client.delete('/settings/avatarDelete')
  }

  // Traffic endpoints
  async getTraffic() {
    return this.client.get('/traffic')
  }

  async getTrafficDetails() {
    return this.client.get('/traffic/details')
  }
}

export const rdApi = new RealDebridAPI()
export default rdApi
