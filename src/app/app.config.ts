import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { authReducer } from './auth/state/auth.reducers';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './auth/state/auth.efffects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideMarkdown(),
    provideStore({ authState: authReducer }),
    provideEffects(AuthEffects)
  ]
};
