import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserType } from '../interface/user-type';
@Injectable({
  providedIn: 'root'
})
export class GetUserService {
  private apiUrl = 'http://localhost:3001';



  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserType[]> {
    return this.http.get<{ DUMMY_Users: UserType[] }>(this.apiUrl).pipe(
      map(response => response.DUMMY_Users)
    );
  }

isLoggedIn():boolean{
  return !!localStorage.getItem('currentUser');
}
getCurrentUser(): UserType | null {
  const localItem = localStorage.getItem('currentUser');
  if (localItem) {
    return JSON.parse(localItem) as UserType;
  }
  return null;
}

loginuser(user:UserType):void{
localStorage.setItem('currentUser',JSON.stringify(user));
}


logoutUser():void{
  localStorage.removeItem('currentUser');
}



}
