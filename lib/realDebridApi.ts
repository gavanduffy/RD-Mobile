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
  async unrestrictLink(link: string) {
    const formData = new URLSearchParams()
    formData.append('link', link)
    return this.client.post('/unrestrict/link', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
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
