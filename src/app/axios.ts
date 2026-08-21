import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class Axios {
  constructor() {
    axios.defaults.baseURL = 'http://localhost:8080/';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  getAuthToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('auth_token');
    }
    return null;
  }

  setAuthToken(token: string | null): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token !== null) {
        window.localStorage.setItem('auth_token', token);
      } else {
        window.localStorage.removeItem('auth_token');
      }
    }
  }

  request(method: string, url: string, data?: any) {
    let headers: any = {};
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return axios.request({
      method,
      url,
      data,
      headers,
    });
  }
}

