import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  @Output() onSubmitEventRegister = new EventEmitter<{ email: string; password: string }>();
  @Output() onSwitchToLogin = new EventEmitter<void>();

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    this.errorMessage = '';
    this.onSubmitEventRegister.emit({ email: this.email, password: this.password });
  }

  switchToLogin(event: Event): void {
    event.preventDefault();
    this.onSwitchToLogin.emit();
  }
}
