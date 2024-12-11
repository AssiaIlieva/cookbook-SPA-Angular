import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthApiService } from '../auth/auth-api.service';

export const UserGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthApiService);
  const router = inject(Router);

  if (authService.isLogged) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
