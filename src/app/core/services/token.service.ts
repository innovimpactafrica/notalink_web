// core/services/token.service.ts
import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/user.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private storage: StorageService) {}

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  setTokens(accessToken: string, refreshToken: string): void {
    this.storage.set(this.ACCESS_TOKEN_KEY, accessToken);
    this.storage.set(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getAccessToken(): string | null {
    return this.storage.get(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.storage.get(this.REFRESH_TOKEN_KEY);
  }

  setUser(user: User): void {
    this.storage.set(this.USER_KEY, JSON.stringify(user));
  }

  getStoredUser(): User | null {
    const userStr = this.storage.get(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.storage.remove(this.USER_KEY);
        return null;
      }
    }
    return null;
  }

  clearTokens(): void {
    this.storage.remove(this.ACCESS_TOKEN_KEY);
    this.storage.remove(this.REFRESH_TOKEN_KEY);
    this.storage.remove(this.USER_KEY);
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = this.getTokenPayload(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  private getTokenPayload(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  getTokenExpirationDate(token: string): Date | null {
    try {
      const payload = this.getTokenPayload(token);
      if (payload.exp) {
        return new Date(payload.exp * 1000);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getAccessToken();
    if (!tokenToCheck) return true;

    const expirationDate = this.getTokenExpirationDate(tokenToCheck);
    if (!expirationDate) return true;

    return expirationDate <= new Date();
  }
}
