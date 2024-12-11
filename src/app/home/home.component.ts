import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { RecipeCardComponent } from '../recipes/recipe-card/recipe-card.component';
import { ApiRecipesService } from '../recipes/recipes-api.service';
import { Recipe } from '../recipes/recipe.model';
import { LoaderComponent } from '../shared/loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipeCardComponent, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiRecipesService);
  private destroyRef = inject(DestroyRef);

  recipes = signal<Recipe[]>([]);
  isFetching = signal<boolean>(false);
  error = signal<string>('');

  ngOnInit(): void {
    this.isFetching.set(true);

    const subscription = this.apiService
      .getLast4Recipes(
        'Something went wrong fetching the recipes, please try again later'
      )
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
