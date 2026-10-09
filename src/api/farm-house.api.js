import apiClient from './client';

export async function getFarmHouseContent() {
  return apiClient('/api/farm-house');
}

export async function updateFarmHouseContent(data) {
  return apiClient('/api/farm-house', {
    method: 'PUT',
    body: data,
  });
}
