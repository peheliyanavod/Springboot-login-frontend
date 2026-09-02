import { Component, signal, OnInit } from '@angular/core';
import { WelcomeContent } from './welcome-content/welcome-content';
import { LoginForm } from "./login-form/login-form";
import { RegisterForm } from "./register-form/register-form";
import { ForgotPasswordForm } from "./forgot-password-form/forgot-password-form";
import { ResetPasswordForm } from "./reset-password-form/reset-password-form";
import { AdminDashboard } from "./admin-dashboard/admin-dashboard";
import { Axios } from './axios';
import { ThemeService } from './theme.service';
import { RouterModule } from '@angular/router';
import { ToastComponent } from './toast/toast';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WelcomeContent, LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, AdminDashboard, RouterModule, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  activeTab = signal<'login' | 'register' | 'auth' | 'admin' | 'forgot-password' | 'reset-password' | 'router'>('login');
  message = signal<string>('');
  errorMessage = signal<string>('');
  userName = signal<string>('');

  resetToken: string | null = null;
  resetEmail: string | null = null;

  constructor(private axios: Axios, private themeService: ThemeService, private toastService: ToastService) {}

  ngOnInit() {
    this.themeService.initTheme();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const email = urlParams.get('email');
      if (token && email) {
        this.resetToken = token;
        this.resetEmail = email;
        this.activeTab.set('reset-password');
        return;
      }

      const tab = urlParams.get('tab');
      const verified = urlParams.get('verified');

      if (verified === 'true') {
        this.toastService.success('Email verified successfully! You can now log in.');
      }

      if (tab === 'register') {
        this.activeTab.set('register');
        window.history.replaceState({}, document.title, '/');
      } else if (tab === 'login') {
        this.activeTab.set('login');
        window.history.replaceState({}, document.title, '/');
      }

      if (window.location.pathname !== '/' && window.location.pathname !== '/register' && window.location.pathname !== '/login') {
        this.activeTab.set('router');
        return; // Let Angular Router handle it
      }

      // Check if session token exists
      const savedToken = this.axios.getAuthToken();
      if (savedToken) {
        this.axios.setAuthToken(savedToken);
        this.axios.request('GET', '/me', {})
          .then((response) => {
            if (response.data) {
              this.userName.set(response.data.name || '');
              if (response.data.userType === 'Super Admin') {
                this.activeTab.set('admin');
              } else {
                this.activeTab.set('auth');
              }
            }
          })
          .catch((error) => {
            console.error('Session validation failed:', error);
            this.axios.setAuthToken(null);
            this.activeTab.set('login');
          });
      }
    }
  }

  showLogin(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.mfaStep.set(false);
    this.mfaToken.set('');
    this.activeTab.set('login');
  }

  showRegister(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.activeTab.set('register');
  }

  mfaStep = signal<boolean>(false);
  mfaToken = signal<string>('');

  handleLogin(input: { username: string; password: string; rememberMe: boolean }): void {
    this.message.set('');
    this.errorMessage.set('');
    this.axios.request('POST', '/login', { email: input.username, password: input.password })
      .then((response) => {
        if (response.data && response.data.mfaRequired) {
          this.mfaStep.set(true);
          this.mfaToken.set(response.data.mfaToken);
          this.toastService.info('Please enter your 6-digit Authenticator code.');
          return;
        }

        if (response.data && response.data.token) {
          this.axios.setAuthToken(response.data.token, input.rememberMe);
        }
        this.toastService.success('Login successful!');
        
        if (response.data) {
          this.userName.set(response.data.name || '');
          if (response.data.userType === 'Super Admin') {
            this.activeTab.set('admin');
          } else {
            this.activeTab.set('auth');
          }
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        const msg = error.response?.data?.message || error.response?.data || 'Login failed. Invalid email or password.';
        this.errorMessage.set(msg);
      });
  }

  handleVerifyMfa(code: string): void {
    this.message.set('');
    this.errorMessage.set('');
    this.axios.verifyMfa(this.mfaToken(), code)
      .then((response) => {
        if (response.data && response.data.token) {
          this.axios.setAuthToken(response.data.token);
        }
        this.mfaStep.set(false);
        this.mfaToken.set('');
        this.toastService.success('Login successful!');
        
        if (response.data) {
          this.userName.set(response.data.name || '');
          if (response.data.userType === 'Super Admin') {
            this.activeTab.set('admin');
          } else {
            this.activeTab.set('auth');
          }
        }
      })
      .catch((error) => {
        console.error('MFA error:', error);
        this.errorMessage.set('Invalid Authenticator code.');
      });
  }

  handleRegister(input: { name: string; email: string; password: string; confirmPassword: string }): void {
    this.message.set('');
    this.errorMessage.set('');
    this.axios.request('POST', '/register', input)
      .then((response) => {
        this.toastService.success('Registration successful! Please check your email to verify your account before logging in.', 5000);
        this.activeTab.set('login');
      })
      .catch((error) => {
        console.error('Register error:', error);
        const msg = error.response?.data?.message || 'Registration failed. Email may already be registered.';
        this.errorMessage.set(msg);
      });
  }

  logout(): void {
    this.axios.setAuthToken(null);
    this.toastService.success('Logged out successfully.');
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
        this.toastService.success(response.data || 'Password reset link sent.');
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
        this.toastService.success('Password has been successfully reset. You can now login.');
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
