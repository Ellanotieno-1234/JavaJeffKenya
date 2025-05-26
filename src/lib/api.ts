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
      return [];
    }

    const data = await response.json();
    // Handle both direct array responses and {data: []} responses
    return Array.isArray(data) ? data : (data?.data || []);
  } catch (error) {
      console.error('API request error:', error);
      console.debug('API URL:', url);
      console.debug('API Options:', options);
      return [];
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
  try {
    const response = await fetchWithCORS(`${API_BASE_URL}/api/analytics/summary`);
    // Analytics summary is not an array, it's an object
    console.debug('Analytics response:', response);
    return typeof response === 'object' && response !== null ? response : {
      total_parts: 0,
      total_value: 0,
      low_stock: 0,
      backorders: 0,
      turnover_rate: 0,
      accuracy_rate: 0
    };
  } catch (error) {
    console.error('Failed to fetch analytics summary:', error);
    return null;
  }
}
