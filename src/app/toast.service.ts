import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  remainingSeconds?: number;
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
    const durationSeconds = Math.ceil(durationMs / 1000);
    const toast: Toast = { id, type, message, remainingSeconds: durationSeconds };
    
    this.toasts.update(currentToasts => [...currentToasts, toast]);

    if (durationSeconds > 0) {
      const interval = setInterval(() => {
        this.toasts.update(currentToasts => {
          const index = currentToasts.findIndex(t => t.id === id);
          if (index !== -1) {
            const updatedToast = { ...currentToasts[index] };
            if (updatedToast.remainingSeconds && updatedToast.remainingSeconds > 1) {
              updatedToast.remainingSeconds -= 1;
              const newToasts = [...currentToasts];
              newToasts[index] = updatedToast;
              return newToasts;
            } else {
              clearInterval(interval);
              return currentToasts.filter(t => t.id !== id);
            }
          }
          clearInterval(interval);
          return currentToasts;
        });
      }, 1000);
    }
  }
}
