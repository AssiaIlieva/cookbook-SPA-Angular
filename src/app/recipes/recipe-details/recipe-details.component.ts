import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ApiRecipesService } from '../recipes-api.service';
import { Recipe } from '../recipe.model';
import { AuthApiService } from '../../auth/auth-api.service';
import { CommentsComponent } from './comments/comments.component';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { CommentsApiService } from './comments/comments-api.service';
import { Comment, NewComment } from './comments/comments.model';
import { AddCommentComponent } from './comments/add-comment/add-comment.component';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [
    RouterLink,
    CommentsComponent,
    LoaderComponent,
    AddCommentComponent,
  ],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css',
})
export class RecipeDetailsComponent implements OnInit {
  private apiService = inject(ApiRecipesService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthApiService);
  private router = inject(Router);
  private commentsApiService = inject(CommentsApiService);

  recipeId = input.required<string>();
  recipe = signal<Recipe>({
    _ownerId: '',
    recipeName: '',
    recipeType: '',
    preparationTime: 0,
    imageURL: '',
    description: '',
    ingredients: '',
    instructions: '',
    _createdOn: 0,
    _id: '',
  });
  isFetching = signal<boolean>(false);
  error = signal<string>('');

  user = signal(this.authService.getLoggedUserFromStorage());

  isAuthenticated = computed(() => {
    return this.user() !== null;
  });

  isOwner = computed(() => {
    const currentUser = this.user();
    return currentUser ? currentUser._id === this.recipe()._ownerId : false;
  });

  commentsReady = signal<boolean>(false);
  comments = signal<Comment[]>([]);
  isCommentFormVisible = signal<boolean>(false);

  ngOnInit(): void {
    this.isFetching.set(true);

    const recipeSubscription = this.apiService
      .getOneRecipe(
        this.recipeId(),
        'Something went wrong fetching the recipe, please try again later'
      )
      .subscribe({
        next: (recipe) => {
          this.recipe.set(recipe);
          this.fetchComments();
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
      recipeSubscription.unsubscribe();
    });
  }

  private fetchComments() {
    const subscription = this.commentsApiService.getComments().subscribe({
      next: (comments) => {
        const filteredComments = comments
          .filter((comment) => comment.recipeId === this.recipe()._id)
          .sort((a, b) => a._createdOn - b._createdOn);
        this.comments.set(filteredComments);
        this.commentsReady.set(true);
      },
      error: (error) => {
        console.log(error);
        this.error.set('Failed to load comments');
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  toggleCommentForm() {
    this.isCommentFormVisible.set(!this.isCommentFormVisible());
  }

  deleteRecipe() {
    if (confirm('Are you sure you want to delete this recipe?')) {
      const subscription = this.apiService
        .removeRecipe(this.recipe()._id)
        .subscribe({
          next: () => {
            this.router.navigate(['/recipes']);
          },
          error: (error) => {
            console.error('Failed to delete recipe:', error);
          },
        });
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }

  onCommentSubmit(commentText: string) {
    const user = this.user();
    if (user && commentText.trim()) {
      const newComment: NewComment = {
        recipeId: this.recipe()._id,
        text: commentText,
        author: {
          email: user.email,
          username: user.username,
          _id: user._id,
        },
      };

      const subscription = this.commentsApiService
        .addComment(newComment)
        .subscribe({
          next: (comment: Comment) => {
            this.comments.update((comments) => [...comments, comment]);
            this.isCommentFormVisible.set(false);
          },
          error: (error) => {
            console.log('Failed to submit comment:', error);
          },
        });
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }
}
