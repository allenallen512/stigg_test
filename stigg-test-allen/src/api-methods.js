const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

/**
 * Hits: GET /api/entitlements/:customerId
 */
export async function getUsage(customerId) {
  if (!customerId) throw new Error('customerId is required');
  const res = await fetch(`${API_BASE}/api/entitlements/${customerId}`);
  if (!res.ok) throw new Error(`getUsage failed: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Report an event to the server.
 */
export async function addTaskEvent(customerId, dimensions = {}) {
  if (!customerId) throw new Error('customerId is required');
  const res = await fetch(`${API_BASE}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, dimensions }),
  });
  if (!res.ok) throw new Error(`addEvent failed: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Report usage with a random value.
 */
export async function reportAPIUsage(customerId, featureId = 'feature-ai-summaries') {
  if (!customerId) throw new Error('customerId is required');
  const value = 10
  const res = await fetch(`${API_BASE}/api/usage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, featureId, value }),
  });
  if (!res.ok) throw new Error(`reportUsage failed: ${res.status} ${res.statusText}`);
  return { ok: true, value, ...(await res.json()) };
}
