import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RegisterComponent } from './auth/register/register.component';
import { RecipeCreateComponent } from './recipes/recipe-create/recipe-create.component';
import { RecipeDetailsComponent } from './recipes/recipe-details/recipe-details.component';
import { HomeComponent } from './home/home.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { UserGuard } from './guards/user.guard';
import { GuestGuard } from './guards/guest.guard';
import { OwnerGuard } from './guards/owner.guard';
import { ProfileComponent } from './auth/profile/profile.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'recipes', component: RecipesComponent },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  {
    path: 'recipe-create',
    component: RecipeCreateComponent,
    canActivate: [UserGuard],
  },
  { path: 'recipe/:recipeId', component: RecipeDetailsComponent },
  {
    path: 'recipe-edit/:recipeId',
    component: RecipeEditComponent,
    canActivate: [OwnerGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [UserGuard] },
  { path: '**', component: NotFoundComponent },
];
