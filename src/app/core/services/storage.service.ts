import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    @Inject('COOKIES') @Optional() private serverCookies: string | null
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  set(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
      this.setCookie(key, value, 7);
    } else {
      this.setCookie(key, value, 7);
    }
  }

  get(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key) || this.getCookie(key);
    }
    return this.getCookie(key);
  }

  remove(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
      this.deleteCookie(key);
    } else {
      this.deleteCookie(key);
    }
  }

  clear(): void {
    if (this.isBrowser) {
      localStorage.clear();
      this.clearCookies();
    } else {
      this.clearCookies();
    }
  }

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict${
      this.isBrowser ? '' : ';HttpOnly'
    }`;
    this.document.cookie = cookie;
  }

  private getCookie(name: string): string | null {
    const cookies = this.isBrowser ? this.document.cookie : this.serverCookies || '';
    const nameEQ = name + '=';
    const cookieArray = cookies.split(';');
    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  }

  private deleteCookie(name: string): void {
    this.document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
  }

  private clearCookies(): void {
    const cookies = this.isBrowser ? this.document.cookie.split(';') : (this.serverCookies || '').split(';');
    for (const cookie of cookies) {
      const name = cookie.split('=')[0].trim();
      this.deleteCookie(name);
    }
  }
}