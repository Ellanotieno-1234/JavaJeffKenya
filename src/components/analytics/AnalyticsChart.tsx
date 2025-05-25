"use client"

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
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
  part_name: string
  quantity: number
  status: string
  order_date: string
  expected_delivery: string
  supplier: string
}

interface ChartData {
  category: string
  demand: number
  supply: number
  backorder: number
  forecast: number
}

export function AnalyticsChart() {
  const [data, setData] = useState<ChartData[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [inventoryData, ordersData] = await Promise.all([
          fetchInventory(),
          fetchOrders()
        ])

        // Group inventory by category
        const categoryMap = new Map<string, ChartData>()

        // Process inventory data
        inventoryData.forEach((item: InventoryItem) => {
          if (!categoryMap.has(item.category)) {
            categoryMap.set(item.category, {
              category: item.category,
              demand: 0,
              supply: 0,
              backorder: 0,
              forecast: 0
            })
          }

          const categoryData = categoryMap.get(item.category)!
          categoryData.supply += item.in_stock
        })

        // Process orders data to calculate demand and backorders
        ordersData.forEach((order: Order) => {
          const item = inventoryData.find((i: InventoryItem) => i.part_number === order.part_number)
          if (item) {
            const categoryData = categoryMap.get(item.category)!
            categoryData.demand += order.quantity
            if (order.status === 'Pending') {
              categoryData.backorder += order.quantity
            }
          }
        })

        // Calculate forecast based on current demand plus 10%
        for (const categoryData of categoryMap.values()) {
          categoryData.forecast = Math.round(categoryData.demand * 1.1)
        }

        setData(Array.from(categoryMap.values()))
      } catch (error) {
        console.error('Failed to fetch analytics data:', error)
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
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="demand" fill="#4f46e5" name="Current Demand" />
          <Bar dataKey="supply" fill="#16a34a" name="Current Supply" />
          <Bar dataKey="forecast" fill="#0891b2" name="Forecasted Demand" />
          <Bar dataKey="backorder" fill="#dc2626" name="Backorder" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
