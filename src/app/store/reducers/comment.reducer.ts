import { createReducer, on } from '@ngrx/store';
import { loginStart, loginSuccess, loginFailure } from '../actions/comment.actions';
import { UserType } from '../../interface/user-type';

export interface AuthState {
  currentUser: UserType | null;
  authToken: string | null;
  error: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  currentUser: null,
  authToken: null,
  error: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(loginStart, state => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { user, token }) => ({
    ...state,
    currentUser: user,
    authToken: token,
    loading: false,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
