"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { fetchAnalyticsSummary } from "@/lib/api"

interface AnalyticsSummary {
  total_parts: number
  total_value: number
  low_stock: number
  backorders: number
  turnover_rate: number
  accuracy_rate: number
}

export function AnalyticsSummary() {
  const [summaryData, setSummaryData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await fetchAnalyticsSummary()
        setSummaryData(data)
      } catch (err) {
        setError('Failed to load analytics data')
        console.error('Error loading analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading analytics data...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  if (!summaryData) {
    return null
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{summaryData.total_parts}</div>
          <div className="text-sm text-muted-foreground">Total Parts</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Across all categories
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            ${(summaryData.total_value / 1000000).toFixed(2)}M
          </div>
          <div className="text-sm text-muted-foreground">Total Inventory Value</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Current market value
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-yellow-600">
            {summaryData.low_stock}
          </div>
          <div className="text-sm text-muted-foreground">Low Stock Alerts</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Parts below minimum threshold
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-red-600">
            {summaryData.backorders}
          </div>
          <div className="text-sm text-muted-foreground">Backorders</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Pending fulfillment
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            {summaryData.turnover_rate.toFixed(1)}x
          </div>
          <div className="text-sm text-muted-foreground">Inventory Turnover</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Annual average
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-600">
            {summaryData.accuracy_rate}%
          </div>
          <div className="text-sm text-muted-foreground">Inventory Accuracy</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Based on last audit
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
