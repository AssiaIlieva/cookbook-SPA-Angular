import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ApiRecipesService } from '../recipes-api.service';
import { NewRecipeData } from '../recipe.model';

@Component({
  selector: 'app-recipe-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.css',
})
export class RecipeCreateComponent {
  private apiService = inject(ApiRecipesService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  error = signal<string>('');

  form = new FormGroup({
    recipeName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    recipeType: new FormControl('', {
      validators: [Validators.required],
    }),
    preparationTime: new FormControl(0, {
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(480),
      ],
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

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const {
      recipeName,
      recipeType,
      preparationTime,
      imageURL,
      description,
      ingredients,
      instructions,
    } = this.form.value;
    const subscription = this.apiService
      .createRecipe(
        recipeName!,
        recipeType!,
        preparationTime!,
        imageURL!,
        description!,
        ingredients!,
        instructions!
      )
      .subscribe({
        next: () => {
          console.log('The new recipe is created successfully');
          this.router.navigate(['/recipes']);
        },
        error: (error: Error) => {
          console.log(error);
          this.error.set(error.message);
        },
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
