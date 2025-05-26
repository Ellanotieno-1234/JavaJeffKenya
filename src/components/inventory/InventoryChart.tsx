"use client"

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchInventory } from '@/lib/api'

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

export default function InventoryChart() {
  const [data, setData] = useState<InventoryItem[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchInventory()
        const inventoryData = Array.isArray(response) ? response : response.data || []
        setData(inventoryData)
      } catch (error) {
        console.error('Failed to fetch inventory data:', error)
      }
    }
    
    loadData()
    
    // Refresh data when inventory is updated
    window.addEventListener('inventoryUpdated', loadData)
    return () => window.removeEventListener('inventoryUpdated', loadData)
  }, [])

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="in_stock" name="In Stock" fill="#4f46e5" />
          <Bar dataKey="min_required" name="Min Required" fill="#ef4444" />
          <Bar dataKey="on_order" name="On Order" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
