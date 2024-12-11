import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ApiRecipesService } from '../recipes-api.service';
import { NewRecipeData } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css',
})
export class RecipeEditComponent implements OnInit {
  private apiService = inject(ApiRecipesService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  error = signal<string>('');

  recipeId!: string; // ID на рецептата
  form = new FormGroup({
    recipeName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    recipeType: new FormControl('', {
      validators: [Validators.required],
    }),
    preparationTime: new FormControl(0, {
      validators: [Validators.required, Validators.min(1), Validators.max(480)],
    }),
    imageURL: new FormControl('', {
      validators: [Validators.required, Validators.pattern(/^https?:\/\//)],
    }),
    description: new FormControl('', {
      validators: [Validators.required, Validators.minLength(10)],
    }),
    ingredients: new FormControl('', {
      validators: [Validators.required, Validators.minLength(10)],
    }),
    instructions: new FormControl('', {
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  get recipeNameIsInvalid() {
    return (
      this.form.controls.recipeName.touched &&
      this.form.controls.recipeName.dirty &&
      this.form.controls.recipeName.invalid
    );
  }
  get recipeTypeIsInvalid() {
    return (
      this.form.controls.recipeType.touched &&
      this.form.controls.recipeType.dirty &&
      this.form.controls.recipeType.invalid
    );
  }
  get preparationTimeIsInvalid() {
    return (
      this.form.controls.preparationTime.touched &&
      this.form.controls.preparationTime.dirty &&
      this.form.controls.preparationTime.invalid
    );
  }
  get imageURLIsInvalid() {
    return (
      this.form.controls.imageURL.touched &&
      this.form.controls.imageURL.dirty &&
      this.form.controls.imageURL.invalid
    );
  }
  get descriptionIsInvalid() {
    return (
      this.form.controls.description.touched &&
      this.form.controls.description.dirty &&
      this.form.controls.description.invalid
    );
  }
  get ingredientsIsInvalid() {
    return (
      this.form.controls.ingredients.touched &&
      this.form.controls.ingredients.dirty &&
      this.form.controls.ingredients.invalid
    );
  }
  get instructionsIsInvalid() {
    return (
      this.form.controls.instructions.touched &&
      this.form.controls.instructions.dirty &&
      this.form.controls.instructions.invalid
    );
  }

  ngOnInit() {
    this.recipeId = this.route.snapshot.paramMap.get('recipeId')!;
    this.apiService
      .getOneRecipe(
        this.recipeId,
        'Something went wrong fetching the recipe, please try again later'
      )
      .subscribe({
        next: (recipe) => {
          console.log(recipe);
          this.form.patchValue(recipe);
        },
        error: (err) => {
          this.error.set(
            'Could not fetch recipe details. Please try again later.'
          );
          console.error(err);
        },
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    if (confirm('Are you sure you want to update this recipe?')) {
      const updatedRecipe = this.form.value as NewRecipeData;
      const subscription = this.apiService
        .updateRecipe(this.recipeId, updatedRecipe)
        .subscribe({
          next: () => {
            console.log('The recipe was updated successfully.');
            this.router.navigate(['/recipes']);
          },
          error: (error) => {
            console.error(error);
            this.error.set(error.message);
          },
        });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }
}
