import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component')
      .then((m) => m.RegisterPage)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardPage)
  },
  {
    path: 'rewards',
    loadComponent: () => import('./features/reward/reward.component').then(m => m.RewardComponent)
  },
  {
    path: 'admin/record-transaction',
    canActivate: [roleGuard(['Admin'])],
    loadComponent: () => import('./features/admin/record-transaction/record-transaction.component').then(m => m.RecordTransactionComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./features/transaction/transaction.component').then(m => m.TransactionComponent)
  },
  {
    path: 'admin/record-transaction',
    canActivate: [authGuard, roleGuard(['Admin'])],
    loadComponent: () => import('./features/admin/record-transaction/record-transaction.component').then(m => m.RecordTransactionComponent)
  },
  {
    path: 'admin/create-reward',
    canActivate: [authGuard, roleGuard(['Admin'])],
    loadComponent: () => import('./features/admin/create-reward/create-reward.component').then(m => m.CreateRewardComponent)
  },
  {
    path: 'admin/create-reward',
    canActivate: [roleGuard(['Admin'])], 
    loadComponent: () => import('./features/admin/create-reward/create-reward.component').then(m => m.CreateRewardComponent)
  },
  { path: '**', redirectTo: 'login' }
];
