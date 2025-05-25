// API utility functions for interacting with the Python backend
import { API_BASE_URL } from './config';

export async function uploadInventoryFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/upload/inventory`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload inventory file')
  }

  return response.json()
}

export async function uploadOrdersFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/upload/orders`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload orders file')
  }

  return response.json()
}

export async function fetchInventory() {
  const response = await fetch(`${API_BASE_URL}/api/inventory`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch inventory data')
  }

  return response.json()
}

export async function fetchOrders() {
  const response = await fetch(`${API_BASE_URL}/api/orders`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch orders data')
  }

  return response.json()
}

export async function fetchAnalyticsSummary() {
  const response = await fetch(`${API_BASE_URL}/api/analytics/summary`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch analytics summary')
  }

  return response.json()
}
