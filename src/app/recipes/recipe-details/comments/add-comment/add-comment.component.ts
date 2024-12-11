import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitComment = new EventEmitter<string>();

  commentText: string = '';

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    if (this.commentText.trim()) {
      this.submitComment.emit(this.commentText);
      this.close.emit();
    }
  }
}
