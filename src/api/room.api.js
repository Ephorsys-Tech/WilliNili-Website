import apiClient from './client';

export async function getPublicRooms() {
  return apiClient('/api/rooms');
}

export async function getPublicRoomById(id) {
  return apiClient(`/api/rooms/${id}`);
}

export async function getAdminRooms({ page = 1, limit = 20, includeArchived = false } = {}) {
  const params = new URLSearchParams({ admin: 'true', page, limit });
  if (includeArchived) params.append('includeArchived', 'true');
  return apiClient(`/api/rooms?${params.toString()}`);
}

export async function createRoom(data) {
  return apiClient('/api/rooms', {
    method: 'POST',
    body: data,
  });
}

export async function updateRoom(id, data) {
  return apiClient(`/api/rooms/${id}`, {
    method: 'PATCH',
    body: data,
  });
}

export async function archiveRoom(id) {
  return apiClient(`/api/rooms/${id}`, {
    method: 'DELETE',
  });
}
