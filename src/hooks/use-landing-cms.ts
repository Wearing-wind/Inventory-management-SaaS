"use client"

import { useState, useEffect, useCallback } from 'react'
import { LandingCMSData } from '@/types/landing-cms'
import { landingCMSService } from '@/services/landing-cms.service'
import { DEFAULT_LANDING_CMS } from '@/config/landing-cms-defaults'

export function useLandingCMS() {
  const [data, setData] = useState<LandingCMSData>(() => landingCMSService.getCachedData())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const fetched = await landingCMSService.fetchCMSData()
        if (isMounted) {
          setData(fetched)
          setIsLoading(false)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load landing page data')
          setIsLoading(false)
        }
      }
    }

    loadData()

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setData(e.detail)
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'inventory_lite_landing_cms' && e.newValue) {
        try {
          setData(JSON.parse(e.newValue))
        } catch {}
      }
    }

    window.addEventListener('landing-cms-updated', handleUpdate)
    window.addEventListener('storage', handleStorage)

    return () => {
      isMounted = false
      window.removeEventListener('landing-cms-updated', handleUpdate)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const updateData = useCallback(async (partial: Partial<LandingCMSData>) => {
    setIsSaving(true)
    setError(null)
    try {
      const updated = await landingCMSService.updateCMSData(partial)
      setData(updated)
      return updated
    } catch (err: any) {
      setError(err?.message || 'Failed to update CMS data')
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [])

  const resetToDefaults = useCallback(async () => {
    setIsSaving(true)
    setError(null)
    try {
      const def = await landingCMSService.resetToDefaults()
      setData(def)
      return def
    } catch (err: any) {
      setError(err?.message || 'Failed to reset CMS data')
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [])

  return {
    cms: data || DEFAULT_LANDING_CMS,
    isLoading,
    isSaving,
    error,
    updateData,
    resetToDefaults,
  }
}
