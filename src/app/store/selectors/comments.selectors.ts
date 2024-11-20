import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '../reducers/comment.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  state => state.currentUser
);

export const selectAuthError = createSelector(
  selectAuthState,
  state => state.error
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  state => state.loading
);
