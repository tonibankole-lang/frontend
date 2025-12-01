const BASE_URL = '';

export async function fetchActivities() {
  const res = await fetch(`${BASE_URL}/api/activities`);
  return await res.json();
}

// Send order with JWT
export async function createOrder(order) {
  const token = localStorage.getItem('token'); // store token after login/signup
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

// Signup
export async function signupRequest({ email, password, name }) {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  const data = await res.json();
  if (!res.ok) throw data;
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

// Login
export async function loginRequest({ email, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw data;
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}
