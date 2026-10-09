import apiClient from './client';

export async function submitEnquiry(data) {
  return apiClient('/api/enquiries', {
    method: 'POST',
    body: data,
  });
}

export async function getAdminEnquiries({ page = 1, limit = 20, type = '', status = '', search = '' } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (type) params.append('type', type);
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  return apiClient(`/api/enquiries?${params.toString()}`);
}

export async function getAdminEnquiryById(id) {
  return apiClient(`/api/enquiries/${id}`);
}

export async function updateEnquiryStatus(id, { status, adminNotes }) {
  return apiClient(`/api/enquiries/${id}`, {
    method: 'PATCH',
    body: { status, adminNotes },
  });
}
