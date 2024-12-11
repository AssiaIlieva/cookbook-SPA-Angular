import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TruncatePipe } from '../../shared/truncate.pipe';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink, TruncatePipe],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent {
  recipe = input.required<Recipe>();
}
