import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserType } from '../interface/user-type';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedIn.asObservable();
  private userId: number | null = null;
  private userIdsSubject = new BehaviorSubject<number | null>(null);
  userId$ = this.userIdsSubject.asObservable();
  private apiUrl = 'http://localhost:3001/'; 

  constructor(private http: HttpClient) {}

  submitForm(user: UserType): Observable<UserType> {
    return this.http.post<UserType>(this.apiUrl, user);
    
  }



  setLoginStatus(status: boolean): void {
    this.isLoggedIn.next(status);
  }
  getLoginStatus(): boolean {
    return this.isLoggedIn.getValue();
  }
  logoutUser():void{
    localStorage.removeItem('currentUser');
    this.isLoggedIn.next(false);
   }



   setUserId(id: number): void {
    this.userIdsSubject.next(id);
    console.log('Selected User ID:', id);
  }



  getUserId(): number | null {
    return this.userId;
  }


}
