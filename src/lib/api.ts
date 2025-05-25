// API utility functions for interacting with the Python backend
import { API_BASE_URL, API_CONFIG } from './config';

export async function uploadInventoryFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/upload/inventory`, {
    method: 'POST',
    body: formData,
    mode: 'cors',
    credentials: 'omit',
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
    mode: 'cors',
    credentials: 'omit',
  })

  if (!response.ok) {
    throw new Error('Failed to upload orders file')
  }

  return response.json()
}

export async function fetchInventory() {
  const response = await fetch(`${API_BASE_URL}/api/inventory`, {
    method: 'GET',
    ...API_CONFIG,
    mode: 'cors',
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch inventory data')
  }

  return response.json()
}

export async function fetchOrders() {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'GET',
    ...API_CONFIG,
    mode: 'cors',
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch orders data')
  }

  return response.json()
}

export async function fetchAnalyticsSummary() {
  const response = await fetch(`${API_BASE_URL}/api/analytics/summary`, {
    method: 'GET',
    ...API_CONFIG,
    mode: 'cors',
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch analytics summary')
  }

  return response.json()
}
