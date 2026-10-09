import apiClient from './client';

export async function getPublicGallery(album = '') {
  const query = album && album !== 'All' ? `?album=${encodeURIComponent(album)}` : '';
  return apiClient(`/api/gallery${query}`);
}

export async function getAdminGallery({ page = 1, limit = 50, album = '' } = {}) {
  const params = new URLSearchParams({ admin: 'true', page, limit });
  if (album && album !== 'All') params.append('album', album);
  return apiClient(`/api/gallery?${params.toString()}`);
}

export async function createGalleryItem(data) {
  return apiClient('/api/gallery', {
    method: 'POST',
    body: data,
  });
}

export async function updateGalleryItem(id, data) {
  return apiClient(`/api/gallery/${id}`, {
    method: 'PATCH',
    body: data,
  });
}

export async function deleteGalleryItem(id) {
  return apiClient(`/api/gallery/${id}`, {
    method: 'DELETE',
  });
}
