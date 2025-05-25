import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { authReducer } from './auth/state/auth.reducers';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './auth/state/auth.efffects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts } from 'ng2-charts';
import { BarController, BarElement, CategoryScale, Colors, Legend, LinearScale, LineController, LineElement, PointElement } from 'chart.js';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideMarkdown(),
    provideStore({ authState: authReducer }),
    provideEffects(AuthEffects),
    provideAnimations(),
    provideCharts({ registerables: [BarController, Legend, Colors, CategoryScale, LinearScale, BarElement, LineController, LineElement, PointElement] }),
  ]
};
