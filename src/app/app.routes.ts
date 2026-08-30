import { Routes } from '@angular/router';
import { VerifyEmailComponent } from './verify-email/verify-email';
import { Oauth2Redirect } from './oauth2-redirect/oauth2-redirect';

export const routes: Routes = [
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'oauth2/redirect', component: Oauth2Redirect },
  { path: 'register', redirectTo: '/?tab=register', pathMatch: 'full' },
  { path: 'login', redirectTo: '/?tab=login', pathMatch: 'full' },
  { path: '', children: [] },
  { path: '**', redirectTo: '/' }
];
