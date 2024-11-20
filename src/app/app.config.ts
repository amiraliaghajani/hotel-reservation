import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore, StoreModule } from '@ngrx/store';
 import { EffectsModule, provideEffects } from '@ngrx/effects';
  import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './store/reducers/comment.reducer';
import { AuthEffects } from './store/effects/comment.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(),
   
     provideStoreDevtools({
       maxAge: 25 ,
       logOnly:!isDevMode(),
       autoPause:true,
       trace:false,
       traceLimit:75,
      })
]
};
