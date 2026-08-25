import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  @Input() serverError: string = '';
  @Output() onSubmitEventLogin = new EventEmitter<{ username: string; password: string }>();
  @Output() onSwitchToRegister = new EventEmitter<void>();

  username: string = '';
  password: string = '';

  onSubmit(): void {
    this.onSubmitEventLogin.emit({ username: this.username, password: this.password });
  }

  switchToRegister(event: Event): void {
    event.preventDefault();
    this.onSwitchToRegister.emit();
  }
}
