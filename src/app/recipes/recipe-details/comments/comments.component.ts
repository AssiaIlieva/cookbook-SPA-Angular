import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Comment } from './comments.model';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent {
  comments = input.required<Comment[]>();
}
