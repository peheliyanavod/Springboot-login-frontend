import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password-form.html',
  styleUrl: './reset-password-form.css',
})
export class ResetPasswordForm {
  @Input() serverError: string = '';
  @Output() onSubmitEvent = new EventEmitter<{ password: string }>();
  @Output() onSwitchToLogin = new EventEmitter<void>();

  password: string = '';
  confirmPassword: string = '';
  localError: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.localError = 'Passwords do not match';
      return;
    }
    this.localError = '';
    this.onSubmitEvent.emit({ password: this.password });
  }

  switchToLogin(event: Event): void {
    event.preventDefault();
    this.onSwitchToLogin.emit();
  }
}
