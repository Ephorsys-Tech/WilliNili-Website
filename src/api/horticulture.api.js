import apiClient from './client';

export async function getPublicPlants({ category = '', search = '' } = {}) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  const q = params.toString() ? `?${params.toString()}` : '';
  return apiClient(`/api/horticulture${q}`);
}

export async function getPublicPlantById(id) {
  return apiClient(`/api/horticulture/${id}`);
}

export async function getAdminPlants({ page = 1, limit = 20, includeArchived = false } = {}) {
  const params = new URLSearchParams({ admin: 'true', page, limit });
  if (includeArchived) params.append('includeArchived', 'true');
  return apiClient(`/api/horticulture?${params.toString()}`);
}

export async function createPlant(data) {
  return apiClient('/api/horticulture', {
    method: 'POST',
    body: data,
  });
}

export async function updatePlant(id, data) {
  return apiClient(`/api/horticulture/${id}`, {
    method: 'PATCH',
    body: data,
  });
}

export async function archivePlant(id) {
  return apiClient(`/api/horticulture/${id}`, {
    method: 'DELETE',
  });
}
