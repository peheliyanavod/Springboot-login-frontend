import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password-form.html',
  styleUrl: './forgot-password-form.css',
})
export class ForgotPasswordForm {
  @Input() serverError: string = '';
  @Input() message: string = '';
  @Output() onSubmitEvent = new EventEmitter<{ email: string }>();
  @Output() onSwitchToLogin = new EventEmitter<void>();

  email: string = '';

  onSubmit(): void {
    this.onSubmitEvent.emit({ email: this.email });
  }

  switchToLogin(event: Event): void {
    event.preventDefault();
    this.onSwitchToLogin.emit();
  }
}
