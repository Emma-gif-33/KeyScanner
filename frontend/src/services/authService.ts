import { request, setAuthToken, removeAuthToken } from '../core/apiClient';
import { User, AuthTokens } from '../types';

export const authService = {
  async register(email: string, password: string, fullName?: string): Promise<User> {
    return request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName || null,
      }),
    });
  },

  async login(email: string, password: string): Promise<AuthTokens> {
    const tokens = await request<AuthTokens>('/auth/login/json', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(tokens.access_token);
    return tokens;
  },

  async getMe(): Promise<User> {
    return request<User>('/auth/me');
  },

  logout(): void {
    removeAuthToken();
  },
};
