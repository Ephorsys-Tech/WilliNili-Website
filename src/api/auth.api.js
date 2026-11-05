import apiClient from './client';

export async function loginAdmin({ email, password }) {
  return apiClient('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function logoutAdmin() {
  return apiClient('/api/auth/logout', {
    method: 'POST',
  });
}

export async function getAdminSession() {
  return apiClient('/api/auth/session', {
    method: 'GET',
  });
}

export async function requestPasswordReset({ email }) {
  return apiClient('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

export async function resetPassword({ token, password, confirmPassword }) {
  return apiClient('/api/auth/reset-password', {
    method: 'POST',
    body: { token, password, confirmPassword },
  });
}
