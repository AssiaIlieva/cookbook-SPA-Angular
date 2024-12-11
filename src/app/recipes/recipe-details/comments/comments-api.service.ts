import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { ErrorService } from '../../../shared/error.service';
import { Comment, NewComment } from './comments.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsApiService {
  commentsUrl: string = `/api/data/comments`;

  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);

  constructor() {}

  getComments() {
    return this.fetchComments(
      this.commentsUrl,
      'Something went wrong fetching the comments, please try again later'
    );
  }

  addComment(newComment: NewComment) {
    return this.httpClient.post<Comment>(this.commentsUrl, newComment);
  }

  private fetchComments(url: string, errorMessage: string) {
    return this.httpClient.get<Comment[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.showError(errorMessage);
        console.log(error);

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
