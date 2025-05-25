"use client"

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { fetchOrders } from '@/lib/api'

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
  date: string
  orders: number
  completed: number
  pending: number
}

export function OrdersChart() {
  const [data, setData] = useState<ChartData[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const ordersData = await fetchOrders()
        
        // Group orders by date and count statuses
        // Process orders data with proper typing
        const dataMap = new Map<string, ChartData>()
        
        ordersData.forEach((order: Order) => {
          const date = order.order_date
          if (!dataMap.has(date)) {
            dataMap.set(date, {
              date,
              orders: 0,
              completed: 0,
              pending: 0
            })
          }
          
          const dayData = dataMap.get(date)!
          dayData.orders++
          if (order.status === 'Completed') {
            dayData.completed++
          } else if (order.status === 'Pending') {
            dayData.pending++
          }
        })

        // Convert to array and sort by date
        const chartData: ChartData[] = Array.from(dataMap.values())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setData(chartData)
      } catch (error) {
        console.error('Failed to fetch orders data:', error)
      }
    }
    
    loadData()
    
    // Refresh data when orders are updated
    window.addEventListener('ordersUpdated', loadData)
    return () => window.removeEventListener('ordersUpdated', loadData)
  }, [])

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#4f46e5"
            name="Total Orders"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#16a34a"
            name="Completed"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#dc2626"
            name="Pending"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
