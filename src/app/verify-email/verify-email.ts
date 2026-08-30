import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Axios } from '../axios';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css']
})
export class VerifyEmailComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  message: string = 'Verifying your email...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private axios: Axios
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.verify(token);
    } else {
      this.status = 'error';
      this.message = 'Verification token is missing.';
    }
  }

  verify(token: string): void {
    this.axios.verifyEmail(token)
      .then((res) => {
        this.status = 'success';
        this.message = 'Email verified successfully! You can now log in.';
      })
      .catch((err) => {
        this.status = 'error';
        this.message = err.response?.data?.message || err.response?.data || 'Failed to verify email. The link may have expired.';
      });
  }
}
