import { api } from './client';
import { AuthResponse, User } from '../types';
import { MOCK_USER } from '../utils/mockData';

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  if (api.getMockMode()) {
    // Simulated mock authentication
    await new Promise((r) => setTimeout(r, 600));
    const token = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
    api.setToken(token);
    return {
      access_token: token,
      token_type: 'bearer',
      user: { ...MOCK_USER, email },
    };
  }

  try {
    // Attempt standard JSON login first
    const data = await api.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (data.access_token) {
      api.setToken(data.access_token);
    }
    return data;
  } catch (err: any) {
    // If backend uses OAuth2PasswordRequestForm (username/password form-encoded)
    try {
      const formBody = new URLSearchParams();
      formBody.append('username', email);
      formBody.append('password', password);

      const formRes = await api.request<AuthResponse>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
      });
      if (formRes.access_token) {
        api.setToken(formRes.access_token);
      }
      return formRes;
    } catch {
      // Re-throw original error
      throw err;
    }
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  if (api.getMockMode()) {
    await new Promise((r) => setTimeout(r, 600));
    const token = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
    api.setToken(token);
    return {
      access_token: token,
      token_type: 'bearer',
      user: { id: 'usr_' + Date.now(), name, email },
    };
  }

  const data = await api.request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (data.access_token) {
    api.setToken(data.access_token);
  }
  return data;
}

export async function getCurrentUser(): Promise<User> {
  if (api.getMockMode()) {
    return MOCK_USER;
  }
  return api.request<User>('/auth/me');
}
