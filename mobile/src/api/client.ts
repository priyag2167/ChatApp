import { API_BASE_URL } from '../helpers/constants/config';

const DEFAULT_BASE = API_BASE_URL;

let authToken: string | null = null;
let baseUrl: string = DEFAULT_BASE;

export const api = {
  setToken(token: string | null) {
    authToken = token;
  },
  setBase(url: string) {
    baseUrl = url;
  },
  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      }
    });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  },
  async post<T>(path: string, body?: any): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  }
};


