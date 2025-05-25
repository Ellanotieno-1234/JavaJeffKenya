// API utility functions for interacting with the Python backend

export async function uploadInventoryFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('http://localhost:8000/api/upload/inventory', {
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

  const response = await fetch('http://localhost:8000/api/upload/orders', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload orders file')
  }

  return response.json()
}

export async function fetchInventory() {
  const response = await fetch('http://localhost:8000/api/inventory')
  
  if (!response.ok) {
    throw new Error('Failed to fetch inventory data')
  }

  return response.json()
}

export async function fetchOrders() {
  const response = await fetch('http://localhost:8000/api/orders')
  
  if (!response.ok) {
    throw new Error('Failed to fetch orders data')
  }

  return response.json()
}

export async function fetchAnalyticsSummary() {
  const response = await fetch('http://localhost:8000/api/analytics/summary')
  
  if (!response.ok) {
    throw new Error('Failed to fetch analytics summary')
  }

  return response.json()
}
