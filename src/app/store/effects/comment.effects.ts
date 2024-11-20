import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { loginStart, loginSuccess, loginFailure } from '../actions/comment.actions';
import { GetUserService } from '../../services/get-user.service'; // Replace with actual user service
import { UserType } from '../../interface/user-type';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private userService: GetUserService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginStart),
      mergeMap(action =>
        this.userService.getUsers().pipe(
          map(users => {
            const user = users.find(
              (u: UserType) => u.emailAddress === action.email && u.password === action.password
            );
            if (user) {
              const fakeToken = this.generateFakeJWT(user);
              return loginSuccess({ user, token: fakeToken });
            } else {
              return loginFailure({ error: 'Invalid email or password' });
            }
          }),
          catchError(error => of(loginFailure({ error: error.message })))
        )
      )
    )
  );

  private generateFakeJWT(user: UserType): string {
    return btoa(JSON.stringify({ id: user.id, email: user.emailAddress }));
  }
}
