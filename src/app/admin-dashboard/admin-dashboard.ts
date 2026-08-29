import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme.service';
import { Axios } from '../axios';
import { UserDto } from '../user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  users: UserDto[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    public themeService: ThemeService, 
    private axios: Axios,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.errorMessage = '';
    this.axios.request('GET', '/admin/users', {})
      .then((response) => {
        this.users = response.data;
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Failed to load users list.';
        this.cdr.detectChanges();
      });
  }

  toggleUserStatus(user: UserDto) {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    this.axios.request('PUT', `/admin/users/${user.id}/status`, { status: newStatus })
      .then((response) => {
        user.status = newStatus;
        this.successMessage = `User status updated to ${newStatus}.`;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        this.errorMessage = 'Failed to update user status.';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      });
  }
}
