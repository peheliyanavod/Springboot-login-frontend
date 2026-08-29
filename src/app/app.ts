import { Component, signal, OnInit } from '@angular/core';
import { WelcomeContent } from './welcome-content/welcome-content';
import { LoginForm } from "./login-form/login-form";
import { RegisterForm } from "./register-form/register-form";
import { ForgotPasswordForm } from "./forgot-password-form/forgot-password-form";
import { ResetPasswordForm } from "./reset-password-form/reset-password-form";
import { Axios } from './axios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WelcomeContent, LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  activeTab = signal<'login' | 'register' | 'auth' | 'forgot-password' | 'reset-password'>('login');
  message = signal<string>('');
  errorMessage = signal<string>('');

  resetToken: string | null = null;
  resetEmail: string | null = null;

  constructor(private axios: Axios) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const email = urlParams.get('email');
      if (token && email) {
        this.resetToken = token;
        this.resetEmail = email;
        this.activeTab.set('reset-password');
      }
    }
  }

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

  showForgotPassword(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.activeTab.set('forgot-password');
  }

  handleForgotPassword(input: { email: string }): void {
    this.message.set('');
    this.errorMessage.set('');
    this.axios.request('POST', '/forgot-password', input)
      .then((response) => {
        this.message.set(response.data || 'Password reset link sent.');
      })
      .catch((error) => {
        console.error('Forgot password error:', error);
        const msg = error.response?.data?.message || 'Failed to send password reset link.';
        this.errorMessage.set(msg);
      });
  }

  handleResetPassword(input: { password: string }): void {
    if (!this.resetToken || !this.resetEmail) {
        this.errorMessage.set('Missing token or email.');
        return;
    }
    
    this.message.set('');
    this.errorMessage.set('');
    this.axios.request('POST', '/reset-password', {
      token: this.resetToken,
      email: this.resetEmail,
      newPassword: input.password
    })
      .then((response) => {
        this.message.set('Password has been successfully reset. You can now login.');
        this.resetToken = null;
        this.resetEmail = null;
        this.activeTab.set('login');
        if (typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
      })
      .catch((error) => {
        console.error('Reset password error:', error);
        const msg = error.response?.data?.message || error.response?.data || 'Failed to reset password.';
        this.errorMessage.set(msg);
      });
  }
}
