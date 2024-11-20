import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserType } from '../../interface/user-type';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
private currentUserSubject = new BehaviorSubject<UserType | null>(this.getCurrentUser())

  constructor() { 
    window.addEventListener('storage', (event) => {
      if (event.key === 'currentUser') {
        this.currentUserSubject.next(this.getCurrentUser());
      }
    });
  }

  private getCurrentUser (){
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user): null
  }
get currentUser$(){
  return this.currentUserSubject.asObservable();
}
setCurrentUser(user: any) {
  localStorage.setItem('currentUser', JSON.stringify(user));
  this.currentUserSubject.next(user);
}
logoutUser():void{
  localStorage.removeItem('currentUser');
  this.currentUserSubject.next(null)
  
 }




}
