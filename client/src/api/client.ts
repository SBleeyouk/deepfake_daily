const BASE_URL = (import.meta.env.VITE_API_URL || '') + '/api';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (email: string) => request<{ token: string; email: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  // Entries
  getEntries: (params?: { category?: string; tag?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.tag) searchParams.set('tag', params.tag);
    const qs = searchParams.toString();
    return request<any[]>(`/entries${qs ? `?${qs}` : ''}`);
  },

  getEntry: (id: string) => request<any>(`/entries/${id}`),

  createEntry: (data: any) => request<any>('/entries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateEntry: (id: string, data: any) => request<any>(`/entries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  getTags: () => request<string[]>('/entries/tags'),

  // AI
  generateHeadline: (data: any) => request<{ headline: string }>('/ai/generate-headline', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getCorrelations: () => request<any>('/ai/correlations', { method: 'POST' }),

  refreshCorrelations: () => request<any>('/ai/correlations/refresh', { method: 'POST' }),

  // Thumbnail
  extractThumbnail: (url: string) => request<{ thumbnailUrl: string | null }>('/uploads/thumbnail', {
    method: 'POST',
    body: JSON.stringify({ url }),
  }),

  // File upload
  uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/uploads`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};
