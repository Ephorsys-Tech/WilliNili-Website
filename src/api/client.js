/**
 * Safe client-side HTTP request wrapper
 */
export async function apiClient(endpoint, options = {}) {
  const { body, headers = {}, ...customConfig } = options;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const config = {
    method: options.method || (body ? 'POST' : 'GET'),
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    credentials: 'same-origin',
    ...customConfig,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(endpoint, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error?.message || response.statusText || 'Request failed';
    const err = new Error(errorMsg);
    err.status = response.status;
    err.code = data?.error?.code;
    err.details = data?.error?.details;
    throw err;
  }

  return data?.data !== undefined ? data.data : data;
}

export default apiClient;
