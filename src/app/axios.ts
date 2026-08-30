import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Axios {
  constructor() {
    axios.defaults.baseURL = environment.backendUrl;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.withCredentials = true;

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/refresh') {
          originalRequest._retry = true;
          try {
            const res = await axios.post('/refresh', {}, { withCredentials: true });
            if (res.data && res.data.token) {
              this.setAuthToken(res.data.token);
              originalRequest.headers['Authorization'] = `Bearer ${res.data.token}`;
              return axios(originalRequest);
            }
          } catch (err) {
            this.setAuthToken(null);
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
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

  logout(): Promise<any> {
    return this.request('POST', '/logout', {}).finally(() => {
      this.setAuthToken(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    });
  }

  request(method: string, url: string, data?: any) {
    let headers: any = {
      'Content-Type': 'application/json'
    };
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

