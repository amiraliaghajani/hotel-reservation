import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';
import { CommentInterface } from '../interface/comment';
import { HttpClient } from '@angular/common/http';
import { UserType } from '../interface/user-type';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private hotelIdSubject = new BehaviorSubject<number | null>(null);
  private userIdSubject = new BehaviorSubject<number | null>(null)
  private apiUrl = 'http://localhost:3002';
  
  hotelId$ = this.hotelIdSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();

  
  constructor(private http: HttpClient) {}

  setHotelId(hotelId: number): void {
    this.hotelIdSubject.next(hotelId);
  }
  setUserId(userId: number): void {
    this.userIdSubject.next(userId);
  }

  addComment(comment: CommentInterface): Observable<CommentInterface> {
    return this.http.post<CommentInterface>(this.apiUrl, comment);
  }
  getCommentsByHotelId(hotelId: number): Observable<CommentInterface[]> {
    return this.http.get<{ DUMMY_Users: CommentInterface[] }>(this.apiUrl).pipe(
      map(response => response.DUMMY_Users.filter(comment => comment.hotelId === hotelId))
    );
  }

  getComments(): Observable<CommentInterface[]> {
    return this.http.get<{ DUMMY_Users: CommentInterface[] }>(this.apiUrl).pipe(
      map(response => response.DUMMY_Users) // Extract DUMMY_Users array
    );}
  // updateComment(comment: CommentInterface): Observable<CommentInterface> {
  //   return this.http.put<CommentInterface>(`${this.apiUrl}/comments/${comment.commentId}`, comment);
  // }
  updateComment(comment: CommentInterface): Observable<CommentInterface> {
    return this.http.get<{ DUMMY_Users: CommentInterface[] }>(this.apiUrl).pipe(
      map(response => {
        const index = response.DUMMY_Users.findIndex(c => c.commentId === comment.commentId);
        if (index !== -1) {
          response.DUMMY_Users[index] = comment;
  
          return this.http.put(`${this.apiUrl}/comments/${comment.commentId}`, { DUMMY_Users: response.DUMMY_Users });
        } else {
          throw new Error('Comment not found');
        }
      }),
      switchMap(() => of(comment))
    );
  }
  
}
