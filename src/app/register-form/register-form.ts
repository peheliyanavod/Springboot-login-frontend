import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  @Input() serverError: string = '';
  
  backendUrl = environment.backendUrl;
  @Output() onSubmitEventRegister = new EventEmitter<{ name: string; email: string; password: string; confirmPassword: string }>();
  @Output() onSwitchToLogin = new EventEmitter<void>();

  name: string = '';

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.name.trim() === '' ) {
      this.errorMessage = 'Name is required';
      return;
    }
    if (this.email.trim() === '' ) {
      this.errorMessage = 'Email is required';
      return;
    }
    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    this.errorMessage = '';
    this.onSubmitEventRegister.emit({ name: this.name, email: this.email, password: this.password, confirmPassword: this.confirmPassword });
  }

  switchToLogin(event: Event): void {
    event.preventDefault();
    this.onSwitchToLogin.emit();
  }
}
