import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }
  return router.parseUrl('/login');
};

// Usage: { path: 'admin', canActivate: [authGuard, roleGuard(['Admin'])], ... }
export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const role = auth.role();

    if (role && allowedRoles.includes(role)) {
      return true;
    }
    return router.parseUrl('/dashboard');
  };
}
