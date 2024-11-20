import { CanActivateFn,Router } from '@angular/router';
import { inject, Inject } from '@angular/core';
import { GetUserService } from '../services/get-user.service';

export const authGuard: CanActivateFn = (route, state) => {
const userService = inject(GetUserService);
const router = inject(Router);
const token = localStorage.getItem('authToken');
if(userService.isLoggedIn() && token){
  return true;

}else {
  router.navigate(['/login']);
  return false;
}




};
