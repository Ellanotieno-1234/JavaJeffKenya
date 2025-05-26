"use client"

import { useEffect, useState } from 'react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts'
import { fetchInventory, fetchOrders } from '@/lib/api'

interface InventoryItem {
  id: number
  part_number: string
  name: string
  category: string
  in_stock: number
  min_required: number
  on_order: number
  last_updated: string
}

interface Order {
  id: number
  order_number: string
  part_number: string
  quantity: number
  status: string
  order_date: string
}

interface TrendData {
  month: string
  inventory: number
  turnover: number
  reorderPoint: number
}

export function TrendChart() {
  const [data, setData] = useState<TrendData[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [inventoryData, ordersData] = await Promise.all([
          fetchInventory(),
          fetchOrders()
        ])

        // Group orders by month
        const monthlyOrders = new Map<string, number>()
        ordersData.forEach((order: Order) => {
          const month = new Date(order.order_date).toLocaleString('default', { month: 'short' })
          monthlyOrders.set(month, (monthlyOrders.get(month) || 0) + order.quantity)
        })

        // Calculate metrics by month
        const trendData: TrendData[] = []
        const months = Array.from(monthlyOrders.keys()).sort()
        
        months.forEach(month => {
          const orderQuantity = monthlyOrders.get(month) || 0
          const totalInventory = inventoryData?.reduce((sum: number, item: InventoryItem) => sum + (item.in_stock || 0), 0) || 0
          const totalMinRequired = inventoryData?.reduce((sum: number, item: InventoryItem) => sum + (item.min_required || 0), 0) || 0
          const avgReorderPoint = inventoryData?.length ? totalMinRequired / inventoryData.length : 0

          // Calculate turnover rate (monthly orders / average inventory)
          const turnoverRate = totalInventory > 0 ? orderQuantity / totalInventory : 0

          trendData.push({
            month,
            inventory: totalInventory,
            turnover: Number(turnoverRate.toFixed(2)),
            reorderPoint: avgReorderPoint
          })
        })

        setData(trendData)
      } catch (error) {
        console.error('Failed to fetch trend data:', error)
      }
    }

    loadData()

    // Refresh when either inventory or orders are updated
    window.addEventListener('inventoryUpdated', loadData)
    window.addEventListener('ordersUpdated', loadData)
    return () => {
      window.removeEventListener('inventoryUpdated', loadData)
      window.removeEventListener('ordersUpdated', loadData)
    }
  }, [])

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="inventory"
            fill="#818cf8"
            stroke="#4f46e5"
            yAxisId="left"
            name="Inventory Level"
          />
          <Line
            type="monotone"
            dataKey="turnover"
            stroke="#16a34a"
            yAxisId="right"
            name="Inventory Turnover"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="reorderPoint"
            stroke="#dc2626"
            strokeDasharray="5 5"
            yAxisId="left"
            name="Reorder Point"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
