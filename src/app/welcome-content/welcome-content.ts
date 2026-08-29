import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemePreset } from '../theme.service';

@Component({
  selector: 'app-welcome-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-content.html',
  styleUrl: './welcome-content.css',
})
export class WelcomeContent {
  @Input() userName: string = '';
  constructor(public themeService: ThemeService) {}
}
