import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  @Output() onSubmitEventLogin = new EventEmitter<{ username: string; password: string }>();

  username: string = '';
  password: string = '';

  onSubmit(): void {
    this.onSubmitEventLogin.emit({ username: this.username, password: this.password });
  }
}

