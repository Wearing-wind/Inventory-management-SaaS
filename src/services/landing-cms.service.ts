import { DEFAULT_LANDING_CMS } from '@/config/landing-cms-defaults'
import { LandingCMSData } from '@/types/landing-cms'

const LOCAL_STORAGE_KEY = 'inventory_lite_landing_cms'

class LandingCMSService {
  private cache: LandingCMSData | null = null

  getCachedData(): LandingCMSData {
    if (this.cache) return this.cache

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          this.cache = { ...DEFAULT_LANDING_CMS, ...parsed }
          return this.cache!
        }
      } catch (e) {
        console.warn('[LandingCMSService] localStorage read error:', e)
      }
    }

    return DEFAULT_LANDING_CMS
  }

  async fetchCMSData(): Promise<LandingCMSData> {
    try {
      const res = await fetch('/api/landing-cms', {
        method: 'GET',
        cache: 'no-store',
      })
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const json = await res.json()
      if (json.success && json.data) {
        this.cache = json.data
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data))
          } catch {}
        }
        return json.data
      }
    } catch (err) {
      console.warn('[LandingCMSService] Fetch failed, using cached or default:', err)
    }
    return this.getCachedData()
  }

  async updateCMSData(data: Partial<LandingCMSData>): Promise<LandingCMSData> {
    const payload = {
      ...this.getCachedData(),
      ...data,
      lastUpdated: new Date().toISOString(),
    }

    // Update in-memory and localStorage immediately
    this.cache = payload as LandingCMSData
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))
        window.dispatchEvent(new CustomEvent('landing-cms-updated', { detail: payload }))
      } catch {}
    }

    // Persist to server API
    try {
      const res = await fetch('/api/landing-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      const json = await res.json()
      if (json.success && json.data) {
        this.cache = json.data
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data))
        }
        return json.data
      }
    } catch (e) {
      console.warn('[LandingCMSService] API save error, local changes retained:', e)
    }

    return payload as LandingCMSData
  }

  async resetToDefaults(): Promise<LandingCMSData> {
    this.cache = DEFAULT_LANDING_CMS
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_LANDING_CMS))
        window.dispatchEvent(new CustomEvent('landing-cms-updated', { detail: DEFAULT_LANDING_CMS }))
      } catch {}
    }

    try {
      await fetch('/api/landing-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      })
    } catch (e) {
      console.warn('[LandingCMSService] API reset error:', e)
    }

    return DEFAULT_LANDING_CMS
  }
}

export const landingCMSService = new LandingCMSService()
