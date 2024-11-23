import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';






import { HttpClientModule } from '@angular/common/http';
import { CommentInterface } from '../../interface/comment';
import { CommentService } from '../../services/comment.service';
import { forkJoin, map } from 'rxjs';
import { GetAllDataService } from '../../services/get-all-data.service';
import { JalaliMomentPipe } from '../../pipe/jalali-moment.pipe';
@Component({
  selector: 'app-pending-comment',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    CommonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSortModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
   JalaliMomentPipe
],
  templateUrl: './pending-comment.component.html',
  styleUrl: './pending-comment.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PendingCommentComponent {
  displayedColumns: string[] = ['userId', 'hotelId', 'date', 'status', 'stars', 'description','title', 'actions'];
  dataSource = new MatTableDataSource<{ comment: CommentInterface; hotelName: string; userFirstName: string;userLastName:string }>([]);
  originalData: { comment: CommentInterface; hotelName: string; userFirstName: string;userLastName:string }[] = [];
private getAllDataService = inject(GetAllDataService)
commentsWithDetails: { comment: CommentInterface; hotelName: string; userFirstName: string;userLastName:string }[] = [];


  constructor(private commentService: CommentService) {}

  ngOnInit() {
    // this.commentService.getComments().subscribe({
    //   next: (response: any) => {
    //     console.log('API Response:', response);
    //     // this.originalData = response; 
    //     // this.dataSource.data = this.originalData; 
    //   },
    //   error: (error) => {
    //     console.error('Error fetching comments:', error);
    //   }
    // });
    this.getCombinedDataForComments()
  }

getCombinedDataForComments(){
  forkJoin({
    comments: this.commentService.getComments(),
    hotels: this.getAllDataService.fetchDataFromHotel(),
    users: this.getAllDataService.getUsers(),
  })
  .pipe(
    map(
      ({comments , hotels , users }) =>{
        return comments.map( comment => 
        {
          console.log(users)
          const hotel = hotels.find(hotel => hotel.id === comment.hotelId);
          const user = users.find(user => user.id === comment.userId);
          console.log(user)
          return {
            comment,
            hotelName: hotel ? hotel.name : "unkonwn hotel",
            userFirstName: user ? user.persianFirstName : "unkown",
            userLastName: user ? user.persianLastName : "unknown"
          }
        }
        )
      }
    )
  ).subscribe(
    (combinedData) => {
      this.commentsWithDetails = combinedData;
      this.dataSource.data =combinedData;
      this.originalData = combinedData;
      console.log('API Response:', combinedData);
    },
    (error) => {
      console.log("error fetching data:", error)
    }
  )
}




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const filteredComments = this.originalData.filter(commentObj =>
      commentObj.comment.description.toLowerCase().includes(filterValue)
    );
    this.dataSource.data = filteredComments;
  }

 
  sortData(status: string) {
    if (!status) {
    
      this.dataSource.data = this.originalData;
    } else {
     
      const filteredComments = this.originalData.filter(commentObj => 
        commentObj.comment.status.toLowerCase() === status.toLowerCase()
      );
      this.dataSource.data = filteredComments; 
    }
  }
  rejectComment(comment: CommentInterface) {
    comment.status = 'rejected'; 
    this.updateComment(comment); 
  }

  approveComment(comment: CommentInterface) {
    comment.status = 'approved'; 
    this.updateComment(comment); 
  }


  updateComment(comment: CommentInterface) {
    this.commentService.updateComment(comment).subscribe({
      next: (response) => {
        console.log('Comment updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating comment:', error);
      }
    });
  }

}
