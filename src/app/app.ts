import { Component, signal } from '@angular/core';
import { WelcomeContent } from './welcome-content/welcome-content';
import { LoginForm } from "./login-form/login-form";
import { RegisterForm } from "./register-form/register-form";
import { Axios } from './axios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WelcomeContent, LoginForm, RegisterForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  activeTab = signal<'login' | 'register' | 'auth'>('login');
  message = signal<string>('');
  errorMessage = signal<string>('');

  constructor(private axios: Axios) {}

  showLogin(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.activeTab.set('login');
  }

  showRegister(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.activeTab.set('register');
  }

  handleLogin(input: { username: string; password: string }): void {
    this.message.set('');
    this.errorMessage.set('');
    this.axios.request('POST', '/login', { email: input.username, password: input.password })
      .then((response) => {
        if (response.data && response.data.token) {
          this.axios.setAuthToken(response.data.token);
        }
        this.message.set('Login successful!');
        this.activeTab.set('auth');
      })
      .catch((error) => {
        console.error('Login error:', error);
        const msg = error.response?.data?.message || 'Login failed. Invalid email or password.';
        this.errorMessage.set(msg);
      });
  }

  handleRegister(input: { email: string; password: string; confirmPassword: string }): void {
    this.message.set('');
    this.errorMessage.set('');
    this.axios.request('POST', '/register', input)
      .then((response) => {
        if (response.data && response.data.token) {
          this.axios.setAuthToken(response.data.token);
        }
        this.message.set('Registration successful! You are now logged in.');
        this.activeTab.set('auth');
      })
      .catch((error) => {
        console.error('Register error:', error);
        const msg = error.response?.data?.message || 'Registration failed. Email may already be registered.';
        this.errorMessage.set(msg);
      });
  }

  logout(): void {
    this.axios.setAuthToken(null);
    this.message.set('Logged out successfully.');
    this.activeTab.set('login');
  }
}
