import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  @Input() serverError: string = '';
  @Input() isMfaStep: boolean = false;
  
  backendUrl = environment.backendUrl;
  
  @Output() onSubmitEventLogin = new EventEmitter<{ username: string; password: string }>();
  @Output() onSubmitEventMfa = new EventEmitter<string>();
  @Output() onSwitchToRegister = new EventEmitter<void>();
  @Output() onSwitchToForgotPassword = new EventEmitter<void>();

  username: string = '';
  password: string = '';
  mfaCode: string = '';
  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.isMfaStep) {
      this.onSubmitEventMfa.emit(this.mfaCode);
    } else {
      this.onSubmitEventLogin.emit({ username: this.username, password: this.password });
    }
  }

  switchToRegister(event: Event): void {
    event.preventDefault();
    this.onSwitchToRegister.emit();
  }

  switchToForgotPassword(event: Event): void {
    event.preventDefault();
    this.onSwitchToForgotPassword.emit();
  }
}
