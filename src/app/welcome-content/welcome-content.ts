import { Component } from '@angular/core';
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
  constructor(public themeService: ThemeService) {}
}
