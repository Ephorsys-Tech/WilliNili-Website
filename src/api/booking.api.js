import apiClient from './client';

export async function submitBookingRequest(data) {
  return apiClient('/api/bookings', {
    method: 'POST',
    body: data,
  });
}

export async function getAdminBookings({ page = 1, limit = 20, status = '', search = '' } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  return apiClient(`/api/bookings?${params.toString()}`);
}

export async function getAdminBookingById(id) {
  return apiClient(`/api/bookings/${id}`);
}

export async function updateBookingStatus(id, { status, adminNotes }) {
  return apiClient(`/api/bookings/${id}`, {
    method: 'PATCH',
    body: { status, adminNotes },
  });
}
