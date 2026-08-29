import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface ThemePreset {
  name: string;
  primary: string;
  primaryHover: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public presets: ThemePreset[] = [
    { name: 'Sage Green', primary: '#5b8c85', primaryHover: '#4a756f' },
    { name: 'Ocean Blue', primary: '#3b82f6', primaryHover: '#2563eb' },
    { name: 'Sunset Orange', primary: '#f97316', primaryHover: '#ea580c' },
    { name: 'Amethyst Purple', primary: '#8b5cf6', primaryHover: '#7c3aed' }
  ];

  public isDarkMode = false;
  public currentPreset = this.presets[0];
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  initTheme() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('app-theme-preset');
      const savedDark = localStorage.getItem('app-theme-dark');
      
      if (savedTheme) {
        const preset = this.presets.find(p => p.name === savedTheme);
        if (preset) {
          this.currentPreset = preset;
        }
      }
      
      if (savedDark === 'true') {
        this.isDarkMode = true;
      }
      
      this.applyCurrentTheme();
    }
  }

  setPreset(presetName: string) {
    const preset = this.presets.find(p => p.name === presetName);
    if (preset && this.isBrowser) {
      this.currentPreset = preset;
      localStorage.setItem('app-theme-preset', presetName);
      this.applyCurrentTheme();
    }
  }

  toggleDarkMode() {
    if (this.isBrowser) {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('app-theme-dark', String(this.isDarkMode));
      this.applyCurrentTheme();
    }
  }

  private applyCurrentTheme() {
    if (!this.isBrowser) return;
    const root = document.documentElement;
    
    // Apply primary colors
    root.style.setProperty('--primary-color', this.currentPreset.primary);
    root.style.setProperty('--primary-hover', this.currentPreset.primaryHover);

    // Apply dark/light mode
    if (this.isDarkMode) {
      root.style.setProperty('--bg-color', '#0f172a');
      root.style.setProperty('--card-bg', '#1e293b');
      root.style.setProperty('--text-dark', '#f8fafc');
      root.style.setProperty('--text-muted', '#94a3b8');
      root.style.setProperty('--border-color', '#334155');
    } else {
      root.style.setProperty('--bg-color', '#f4f7f6');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--text-dark', '#334155');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--border-color', '#e2e8f0');
    }
  }
}
