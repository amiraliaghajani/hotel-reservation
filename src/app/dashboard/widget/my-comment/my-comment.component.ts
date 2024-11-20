import { Component, inject } from '@angular/core';
import { UserType } from '../../../interface/user-type';
import { CommentService } from '../../../services/comment.service';
import { CommentInterface } from '../../../interface/comment';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-my-comment',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule

  ],
  templateUrl: './my-comment.component.html',
  styleUrl: './my-comment.component.css'
})
export class MyCommentComponent {
  commentService=inject(CommentService)
  currentUser:UserType|null=null
  userComments: CommentInterface[] = [];

  ngOnInit(): void {
    const userFromStorage = localStorage.getItem('currentUser');
    if (userFromStorage) {
      this.currentUser = JSON.parse(userFromStorage) as UserType;
    }
   this.getCommentsForUser()
  }




    getCommentsForUser(): void {
      this.commentService.getComments().subscribe({
        next: (comments) => {
          if (this.currentUser) {
            this.userComments = comments.filter(comment => {
              return comment.userId === this.currentUser?.id;
            });
          }
        },
        error: (err) => {
          console.error('Error fetching comments:', err);
        }
      });
    }
}
