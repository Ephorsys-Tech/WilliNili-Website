import apiClient from './client';

export async function getPublicShops() {
  return apiClient('/api/shop-rental');
}

export async function getPublicShopById(id) {
  return apiClient(`/api/shop-rental/${id}`);
}

export async function getAdminShops({ page = 1, limit = 20, includeArchived = false } = {}) {
  const params = new URLSearchParams({ admin: 'true', page, limit });
  if (includeArchived) params.append('includeArchived', 'true');
  return apiClient(`/api/shop-rental?${params.toString()}`);
}

export async function toggleShopRentalModule(active) {
  return apiClient('/api/shop-rental/toggle', {
    method: 'POST',
    body: { active },
  });
}

export async function createShop(data) {
  return apiClient('/api/shop-rental', {
    method: 'POST',
    body: data,
  });
}

export async function updateShop(id, data) {
  return apiClient(`/api/shop-rental/${id}`, {
    method: 'PATCH',
    body: data,
  });
}

export async function archiveShop(id) {
  return apiClient(`/api/shop-rental/${id}`, {
    method: 'DELETE',
  });
}
