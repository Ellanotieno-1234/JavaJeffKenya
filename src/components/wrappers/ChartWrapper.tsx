"use client"

import dynamic from 'next/dynamic'

// Dynamically import chart components with loading optimization
export const DynamicInventoryChart = dynamic(
  () => import('../inventory/InventoryChart').then(mod => mod.default),
  {
    ssr: false,
    loading: () => <ChartLoading />
  }
)

export const DynamicOrdersChart = dynamic(
  () => import('../orders/OrdersChart').then(mod => mod.OrdersChart),
  {
    ssr: false,
    loading: () => <ChartLoading />
  }
)

export const DynamicAnalyticsChart = dynamic(
  () => import('../analytics/AnalyticsChart').then(mod => mod.AnalyticsChart),
  {
    ssr: false,
    loading: () => <ChartLoading />
  }
)

export const DynamicTrendChart = dynamic(
  () => import('../analytics/TrendChart').then(mod => mod.TrendChart),
  {
    ssr: false,
    loading: () => <ChartLoading />
  }
)

// Enhanced loading component with skeleton animation
const ChartLoading = () => (
  <div className="w-full h-[300px] rounded-lg overflow-hidden">
    <div className="w-full h-full bg-slate-800/50 animate-pulse flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md p-4">
        <div className="h-4 bg-slate-700/50 rounded w-3/4 mx-auto"></div>
        <div className="h-32 bg-slate-700/50 rounded"></div>
        <div className="h-4 bg-slate-700/50 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  </div>
)

// Optimized wrapper components
export const InventoryChartWrapper = DynamicInventoryChart
export const OrdersChartWrapper = DynamicOrdersChart
export const AnalyticsChartWrapper = DynamicAnalyticsChart
export const TrendChartWrapper = DynamicTrendChart
