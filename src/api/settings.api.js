import apiClient from './client';

export async function getPublicSettings() {
  return apiClient('/api/settings');
}

export async function updateAdminSettings(data) {
  return apiClient('/api/settings', {
    method: 'PUT',
    body: data,
  });
}

export async function getResortContent() {
  return apiClient('/api/resort');
}

export async function updateResortContent(data) {
  return apiClient('/api/resort', {
    method: 'PUT',
    body: data,
  });
}

export async function getDashboardMetrics() {
  return apiClient('/api/dashboard');
}

export async function uploadImage(file, folder = '') {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) formData.append('folder', folder);

  return apiClient('/api/upload', {
    method: 'POST',
    body: formData,
  });
}
