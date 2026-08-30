import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Axios } from '../axios';

@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './oauth2-redirect.html',
  styleUrls: ['./oauth2-redirect.css']
})
export class Oauth2Redirect implements OnInit {
  status: 'loading' | 'mfa' | 'error' = 'loading';
  message: string = 'Authenticating...';
  
  mfaToken: string = '';
  mfaCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private axios: Axios
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const mfaToken = this.route.snapshot.queryParamMap.get('mfaToken');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error) {
      this.status = 'error';
      this.message = 'Authentication failed. Please try again.';
      return;
    }

    if (token) {
      // Login successful
      this.axios.setAuthToken(token);
      window.location.href = '/'; // Reload to let app.ts handle session
      return;
    }

    if (mfaToken) {
      // MFA required
      this.mfaToken = mfaToken;
      this.status = 'mfa';
      this.message = 'Please enter your 6-digit Authenticator code.';
      return;
    }

    this.status = 'error';
    this.message = 'Invalid authentication response.';
  }

  verifyMfa(): void {
    this.axios.verifyMfa(this.mfaToken, this.mfaCode)
      .then((res) => {
        if (res.data && res.data.token) {
          this.axios.setAuthToken(res.data.token);
          window.location.href = '/';
        }
      })
      .catch((err) => {
        this.status = 'error';
        this.message = 'Invalid Authenticator code. Please reload and try again.';
      });
  }
}
