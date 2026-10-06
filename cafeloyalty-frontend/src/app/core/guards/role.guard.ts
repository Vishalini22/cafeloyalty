import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const userRole = authService.role();
    if (!userRole || !allowedRoles.includes(userRole)) {
      router.navigate(['/dashboard']);
      return false;
    }

    return true;
  };
}