import { Component, HostBinding, inject, input, OnInit, signal } from '@angular/core';
import { Widget } from '../../interface/widget';
import { NgComponentOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WidgetsOptionsComponent } from './widgets-options/widgets-options.component';
import { UserType } from '../../interface/user-type';
import { CommentInterface } from '../../interface/comment';
import { CommentService } from '../../services/comment.service';
@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [NgComponentOutlet,
    MatButtonModule,
    MatIcon,
    WidgetsOptionsComponent,
  ],
  
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.css',
  // host:{
  //   '[style.grid-area]': '"span" + (data().rows ?? 1) + "/ span" + (data().columns ?? 1)'
  // }
 
})
export class WidgetComponent implements OnInit{
  data = input.required<Widget>();
  loggedUser= input.required<UserType>()
  showOptions = signal(false)
  currentUser: UserType | null = null; // Holds the current user
  userComments: CommentInterface[] = [];
  commentService = inject(CommentService)
  @HostBinding('style.grid-area')
  get gridArea(): string {
    const rows = this.data().rows ?? 1;
    const columns = this.data().columns ?? 1;
    return `span ${rows} / span ${columns}`;
  }
  ngOnInit(): void {
    const userFromStorage = localStorage.getItem('currentUser');
    if (userFromStorage) {
      this.currentUser = JSON.parse(userFromStorage) as UserType;
    }

    
    console.log(this.currentUser)
    console.log("logged user is ",this.loggedUser)
    console.log(this.userComments)
  }

  
}
