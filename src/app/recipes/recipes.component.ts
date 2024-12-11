import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ApiRecipesService } from './recipes-api.service';
import { Recipe } from './recipe.model';
import { LoaderComponent } from '../shared/loader/loader.component';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [LoaderComponent, RecipeCardComponent, FormsModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent implements OnInit {
  private apiService = inject(ApiRecipesService);
  private destroyRef = inject(DestroyRef);

  recipes = signal<Recipe[]>([]);
  isFetching = signal<boolean>(false);
  error = signal<string>('');
  recipeType = signal<string>('');

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes() {
    this.isFetching.set(true);
    const subcription = this.apiService
      .getRecipesByType(this.recipeType())
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
      subcription.unsubscribe();
    });
  }

  onSearch(recipeType: string) {
    this.recipeType.set(recipeType);
    this.fetchRecipes();
  }
}
