import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Recipe } from '../../recipes/recipe.model';
import { LoggedUser } from '../user.model'; 
import { AuthApiService } from '../auth-api.service';
import { ApiRecipesService } from '../../recipes/recipes-api.service';
import { RecipeCardComponent } from '../../recipes/recipe-card/recipe-card.component';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RecipeCardComponent, LoaderComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private apiService = inject(ApiRecipesService);
  private userService = inject(AuthApiService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthApiService);

  user = signal<LoggedUser | null>(null);
  recipes = signal<Recipe[]>([]);
  isFetching = signal<boolean>(false);
  error = signal<string>('');

  user$: Observable<LoggedUser | null> = this.authService.user$;

  ngOnInit(): void {
    const user = this.userService.getLoggedUserFromStorage();
    if (user) {
      this.isFetching.set(true);
      const userId = user._id;

      const subscription = this.apiService
        .getRecipesByUserId(userId, 'Failed to fetch your recipes')
        .subscribe({
          next: (recipes) => {
            this.recipes.set(recipes);
          },
          error: (error: Error) => {
            console.log(error);
            this.error.set(error.message);
          },
          complete: () => {
            this.isFetching.set(false);
          },
        });

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }
}
