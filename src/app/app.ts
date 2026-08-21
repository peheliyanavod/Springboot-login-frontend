import { Component, signal } from '@angular/core';
import { AuthContent } from './auth-content/auth-content';
import { WelcomeContent } from './welcome-content/welcome-content';
import { LoginForm } from "./login-form/login-form";
import { Axios } from './axios';

@Component({
  selector: 'app-root',
  imports: [AuthContent, WelcomeContent, LoginForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  loginMessage = signal<string>('');

  constructor(private axios: Axios) {}

  handleLogin(input: { username: string; password: string }): void {
    console.log('Login submitted:', input);
    this.axios.request('POST', '/login', input)
      .then((response) => {
        if (response.data && response.data.token) {
          this.axios.setAuthToken(response.data.token);
        }
        this.loginMessage.set('Login successful!');
      })
      .catch((error) => {
        console.error('Login request failed:', error);
        this.loginMessage.set('Login submitted successfully.');
      });
  }
}

