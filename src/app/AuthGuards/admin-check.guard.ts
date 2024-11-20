import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GetUserService } from '../services/get-user.service';
import { UserType } from '../interface/user-type';

export const adminCheckGuard: CanActivateFn = (route, state) => {
const userService = inject(GetUserService);
const router = inject(Router);
if(userService.isLoggedIn()){

const currentUser:UserType |null= userService.getCurrentUser()

  if(currentUser && currentUser.accessType === 'admin' ){

  return true;

    }else {
        router.navigate(['/login']);
        return false;
    }}
else{
  router.navigate(['/login']);
  return false;
}

};
