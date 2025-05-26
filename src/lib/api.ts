// API utility functions for interacting with the Python backend
import { API_BASE_URL } from './config';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

async function fetchWithCORS(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'omit',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error(`API request failed: ${response.statusText}`);
      // Return empty data structures instead of throwing
      return { data: [] };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request error:', error);
    // Return empty data structures on error
    return { data: [] };
  }
}

export async function uploadInventoryFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return fetchWithCORS(`${API_BASE_URL}/api/upload/inventory`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  });
}

export async function uploadOrdersFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return fetchWithCORS(`${API_BASE_URL}/api/upload/orders`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  });
}

export async function fetchInventory() {
  return fetchWithCORS(`${API_BASE_URL}/api/inventory`);
}

export async function fetchOrders() {
  return fetchWithCORS(`${API_BASE_URL}/api/orders`);
}

export async function fetchAnalyticsSummary() {
  return fetchWithCORS(`${API_BASE_URL}/api/analytics/summary`);
}
