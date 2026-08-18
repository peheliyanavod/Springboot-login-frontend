import { Component, signal } from '@angular/core';
import { AuthContent } from './auth-content/auth-content';

@Component({
  selector: 'app-root',
  imports: [AuthContent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
