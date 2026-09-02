import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  success(message: string, durationMs: number = 3000) {
    this.addToast('success', message, durationMs);
  }

  error(message: string, durationMs: number = 4000) {
    this.addToast('error', message, durationMs);
  }

  info(message: string, durationMs: number = 3000) {
    this.addToast('info', message, durationMs);
  }

  remove(id: string) {
    this.toasts.update(currentToasts => currentToasts.filter(t => t.id !== id));
  }

  private addToast(type: 'success' | 'error' | 'info', message: string, durationMs: number) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, message };
    
    this.toasts.update(currentToasts => [...currentToasts, toast]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.remove(id);
      }, durationMs);
    }
  }
}
