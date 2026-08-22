export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('razorgrow_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  // If uploading file via FormData, remove Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete (headers as any)['Content-Type'];
  }
  
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem('razorgrow_token');
    window.location.href = '/login';
  }
  return response;
};

// Auth
export const loginApi = async (credentials: any) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) throw new Error('Failed to login');
  return response.json();
};

export const signupApi = async (data: any) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to signup');
  return response.json();
};

// Analytics
export const fetchDashboardMetrics = async () => {
  const response = await fetchWithAuth(`${API_URL}/analytics/metrics`);
  if (!response.ok) throw new Error('Failed to fetch metrics');
  return response.json();
};

export const fetchPaymentIntelligence = async () => {
  const response = await fetchWithAuth(`${API_URL}/analytics/payment-intelligence`);
  if (!response.ok) throw new Error('Failed to fetch payment intelligence');
  return response.json();
};

// AI Agent
export const runAIGrowthAnalysis = async () => {
  const response = await fetchWithAuth(`${API_URL}/ai/analyze`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to run analysis');
  return response.json();
};

export const fetchAuditLogs = async () => {
  const response = await fetchWithAuth(`${API_URL}/ai/audit`);
  if (!response.ok) throw new Error('Failed to fetch audit logs');
  return response.json();
};

// Actions & Guardrails
export const fetchPendingActions = async () => {
  const response = await fetchWithAuth(`${API_URL}/ai/actions/pending`);
  if (!response.ok) throw new Error('Failed to fetch pending actions');
  return response.json();
};

export const respondToAction = async (actionId: string, approved: boolean, reason?: string) => {
  const response = await fetchWithAuth(`${API_URL}/ai/actions/${actionId}/respond`, {
    method: 'POST',
    body: JSON.stringify({ approved, reason })
  });
  if (!response.ok) throw new Error('Failed to respond to action');
  return response.json();
};

export const approveAiAction = async (actionId: string) => {
  const response = await fetchWithAuth(`${API_URL}/ai/actions/${actionId}/approve`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to approve action');
  return response.json();
};

export const rejectAiAction = async (actionId: string, reason?: string) => {
  const response = await fetchWithAuth(`${API_URL}/ai/actions/${actionId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  });
  if (!response.ok) throw new Error('Failed to reject action');
  return response.json();
};

export const fetchGuardrails = async () => {
  const response = await fetchWithAuth(`${API_URL}/ai/guardrails`);
  if (!response.ok) throw new Error('Failed to fetch guardrails');
  return response.json();
};

export const updateGuardrails = async (data: any) => {
  const response = await fetchWithAuth(`${API_URL}/ai/guardrails`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update guardrails');
  return response.json();
};

// Customers
export const fetchCustomers = async () => {
  const response = await fetchWithAuth(`${API_URL}/customers`);
  if (!response.ok) throw new Error('Failed to fetch customers');
  return response.json();
};

export const fetchCustomerProfile = async (id: string) => {
  const response = await fetchWithAuth(`${API_URL}/customers/${id}`);
  if (!response.ok) throw new Error('Failed to fetch customer profile');
  return response.json();
};

export const fetchCustomerInsights = async (id: string) => {
  const response = await fetchWithAuth(`${API_URL}/customers/${id}/insights`);
  if (!response.ok) throw new Error('Failed to fetch customer insights');
  return response.json();
};

// Products
export const fetchProducts = async () => {
  const response = await fetchWithAuth(`${API_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const fetchProductInsights = async () => {
  const response = await fetchWithAuth(`${API_URL}/products/insights`);
  if (!response.ok) throw new Error('Failed to fetch product insights');
  return response.json();
};

export const draftCrossSellCampaign = async (data: any) => {
  const response = await fetchWithAuth(`${API_URL}/products/draft-campaign`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to draft campaign');
  return response.json();
};

// Campaigns
export const generateCampaign = async (goal: string) => {
  const response = await fetchWithAuth(`${API_URL}/campaigns/generate`, {
    method: 'POST',
    body: JSON.stringify({ goal })
  });
  if (!response.ok) throw new Error('Failed to generate campaign');
  return response.json();
};

// Onboarding
export const fetchDataSourceStatus = async () => {
  const response = await fetchWithAuth(`${API_URL}/onboarding/status`);
  if (!response.ok) throw new Error('Failed to fetch status');
  return response.json();
};

export const setupStore = async (data: any) => {
  const response = await fetchWithAuth(`${API_URL}/onboarding/setup`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to setup store');
  return response.json();
};

export const connectRazorpay = async () => {
  const response = await fetchWithAuth(`${API_URL}/onboarding/razorpay`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to connect Razorpay');
  return response.json();
};

export const connectDemo = async () => {
  const response = await fetchWithAuth(`${API_URL}/onboarding/demo`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to connect Demo');
  return response.json();
};

export const uploadCsv = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetchWithAuth(`${API_URL}/onboarding/csv`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Failed to upload CSV');
  return response.json();
};
