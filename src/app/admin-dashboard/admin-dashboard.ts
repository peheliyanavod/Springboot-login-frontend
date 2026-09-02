import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme.service';
import { Axios } from '../axios';
import { UserDto, SystemLogDto, PageResponse } from '../user.model';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  users: UserDto[] = [];
  isLoadingUsers: boolean = false;
  updatingUserIds: Set<number> = new Set();
  activeMenu: string = 'users';

  // System Logs state
  systemLogs: SystemLogDto[] = [];
  isLoadingLogs: boolean = false;
  logsCurrentPage: number = 0;
  logsTotalPages: number = 0;
  logsPageSize: number = 10;
  
  // Filters
  filterUserName: string = '';
  filterIpAddress: string = '';
  filterDate: string = '';
  filterLogMessage: string = '';
  
  // Debounce timer for filtering
  private filterTimeout: any;

  constructor(
    public themeService: ThemeService, 
    private axios: Axios,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.fetchUsers();
    this.fetchSystemLogs();
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
  }

  fetchUsers() {
    this.isLoadingUsers = true;
    this.axios.request('GET', '/admin/users', {})
      .then((response) => {
        this.users = response.data;
        this.isLoadingUsers = false;
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        this.toastService.error('Failed to load users list.');
        this.isLoadingUsers = false;
        this.cdr.detectChanges();
      });
  }

  toggleUserStatus(user: UserDto) {
    if (this.updatingUserIds.has(user.id)) return;
    this.updatingUserIds.add(user.id);
    
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    this.axios.request('PUT', `/admin/users/${user.id}/status`, { status: newStatus })
      .then((response) => {
        user.status = newStatus;
        this.toastService.success(`User status updated to ${newStatus}.`);
        this.updatingUserIds.delete(user.id);
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        this.toastService.error('Failed to update user status.');
        this.updatingUserIds.delete(user.id);
        this.cdr.detectChanges();
      });
  }

  // System Logs Methods
  fetchSystemLogs() {
    this.isLoadingLogs = true;
    let url = `/admin/logs?page=${this.logsCurrentPage}&size=${this.logsPageSize}`;
    
    if (this.filterUserName) url += `&userName=${encodeURIComponent(this.filterUserName)}`;
    if (this.filterIpAddress) url += `&ipAddress=${encodeURIComponent(this.filterIpAddress)}`;
    if (this.filterDate) url += `&dateFilter=${encodeURIComponent(this.filterDate)}`;
    if (this.filterLogMessage) url += `&logMessage=${encodeURIComponent(this.filterLogMessage)}`;

    this.axios.request('GET', url, {})
      .then((response) => {
        const pageData: PageResponse<SystemLogDto> = response.data;
        this.systemLogs = pageData.content;
        this.logsTotalPages = pageData.totalPages;
        this.isLoadingLogs = false;
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error fetching logs:', error);
        this.toastService.error('Failed to load system logs.');
        this.isLoadingLogs = false;
        this.cdr.detectChanges();
      });
  }

  onFilterChange(event: any, field: string) {
    const value = event.target.value;
    
    if (field === 'userName') this.filterUserName = value;
    if (field === 'ipAddress') this.filterIpAddress = value;
    if (field === 'dateFilter') this.filterDate = value;
    if (field === 'logMessage') this.filterLogMessage = value;
    
    // Reset to first page when filtering
    this.logsCurrentPage = 0;
    
    // Debounce the API call
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    
    this.filterTimeout = setTimeout(() => {
      this.fetchSystemLogs();
    }, 500); // 500ms delay
  }

  nextPage() {
    if (this.logsCurrentPage < this.logsTotalPages - 1) {
      this.logsCurrentPage++;
      this.fetchSystemLogs();
    }
  }

  prevPage() {
    if (this.logsCurrentPage > 0) {
      this.logsCurrentPage--;
      this.fetchSystemLogs();
    }
  }
}
