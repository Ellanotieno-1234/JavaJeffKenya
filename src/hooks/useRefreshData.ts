import { useState, useCallback, useRef } from 'react'
import { fetchInventory, fetchOrders } from '@/lib/api'

interface CachedData {
  data: any
  timestamp: number
}

const CACHE_DURATION = 30000 // 30 seconds cache

export function useRefreshData() {
  const inventoryCache = useRef<CachedData | null>(null)
  const ordersCache = useRef<CachedData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshInventory = useCallback(async (forceFetch = false) => {
    try {
      setIsRefreshing(true)
      setError(null)

      // Check cache if not forcing fetch
      if (!forceFetch && inventoryCache.current) {
        const age = Date.now() - inventoryCache.current.timestamp
        if (age < CACHE_DURATION) {
          return inventoryCache.current.data
        }
      }

      // Fetch fresh data
      const data = await fetchInventory()
      
      // Update cache
      inventoryCache.current = {
        data,
        timestamp: Date.now()
      }
      
      return data
    } catch (err) {
      setError('Failed to refresh inventory data')
      console.error('Refresh error:', err)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const refreshOrders = useCallback(async (forceFetch = false) => {
    try {
      setIsRefreshing(true)
      setError(null)

      // Check cache if not forcing fetch
      if (!forceFetch && ordersCache.current) {
        const age = Date.now() - ordersCache.current.timestamp
        if (age < CACHE_DURATION) {
          return ordersCache.current.data
        }
      }

      // Fetch fresh data
      const data = await fetchOrders()
      
      // Update cache
      ordersCache.current = {
        data,
        timestamp: Date.now()
      }
      
      return data
    } catch (err) {
      setError('Failed to refresh orders data')
      console.error('Refresh error:', err)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  return {
    refreshInventory,
    refreshOrders,
    isRefreshing,
    error
  }
}
