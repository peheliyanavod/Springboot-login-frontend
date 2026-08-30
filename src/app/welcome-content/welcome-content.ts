import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, ThemePreset } from '../theme.service';
import { Axios } from '../axios';

@Component({
  selector: 'app-welcome-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './welcome-content.html',
  styleUrl: './welcome-content.css',
})
export class WelcomeContent {
  @Input() userName: string = '';
  
  mfaSetupStep: 'none' | 'qr' | 'success' | 'error' = 'none';
  mfaQrUrl: string = '';
  mfaCode: string = '';
  mfaMessage: string = '';

  constructor(public themeService: ThemeService, private axios: Axios) {}

  startMfaSetup(): void {
    this.mfaSetupStep = 'none';
    this.mfaMessage = '';
    this.axios.setupMfa()
      .then(res => {
        if (res.data && res.data.qrCodeUrl) {
          this.mfaQrUrl = res.data.qrCodeUrl;
          this.mfaSetupStep = 'qr';
        }
      })
      .catch(err => {
        this.mfaSetupStep = 'error';
        this.mfaMessage = err.response?.data?.message || 'Failed to initiate MFA setup.';
      });
  }

  verifyMfaSetup(): void {
    this.mfaMessage = '';
    this.axios.verifyMfaSetup(this.mfaCode)
      .then(res => {
        this.mfaSetupStep = 'success';
        this.mfaMessage = 'MFA has been successfully enabled on your account.';
      })
      .catch(err => {
        this.mfaMessage = err.response?.data?.message || 'Invalid code. Please try again.';
      });
  }
}
