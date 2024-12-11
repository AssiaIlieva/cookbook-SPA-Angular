import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthApiService } from '../auth/auth-api.service';
import { ApiRecipesService } from '../recipes/recipes-api.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const OwnerGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthApiService);
  const recipeService = inject(ApiRecipesService);
  const router = inject(Router);

  const recipeId = route.paramMap.get('recipeId');

  if (!recipeId) {
    router.navigate(['/recipes']);
    return of(false);
  }

  if (!authService.isLogged) {
    router.navigate(['/login']);
    return of(false);
  }

  const userId = authService.getLoggedUserFromStorage()?._id;

  return recipeService.getOneRecipe(recipeId, 'Error fetching recipe').pipe(
    map((recipe) => {
      if (recipe._ownerId === userId) {
        return true;
      } else {
        router.navigate(['/recipes']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/recipes']);
      return of(false);
    })
  );
};
