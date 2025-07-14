import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data?.['roles'] as string[];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  
  const user = authService.currentUserValue;
  const hasRequiredRole = user && requiredRoles.some(role => user.roles.includes(role));
  
  if (hasRequiredRole) {
    return true;
  }
  
  // Redirect to unauthorized page or home
  router.navigate(['/']);
  return false;
};
