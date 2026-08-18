import { Component, OnInit, ChangeDetectorRef, NgZone, signal } from '@angular/core';
import { Axios } from '../axios';

@Component({
  selector: 'app-auth-content',
  imports: [],
  templateUrl: './auth-content.html',
  styleUrl: './auth-content.css',
})
export class AuthContent implements OnInit {
  data = signal<string[]>([]);
  errorMessage = signal<string>('');

  constructor(
    private axios: Axios,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.axios.request('GET', '/messages')
      .then((response) => {
        this.zone.run(() => {
          this.data.set(response.data);
          this.cdr.detectChanges();
        });
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
        this.zone.run(() => {
          this.errorMessage.set('Failed to load messages from backend.');
          this.cdr.detectChanges();
        });
      });
  }
}
