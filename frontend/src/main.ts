import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { playerReducer } from './app/store/player/player.reducer';
import { trackReducer } from './app/store/tracks/track.reducer';
import { TrackEffects } from './app/store/tracks/track.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    provideStore({
      player: playerReducer,
      tracks: trackReducer
    }),

    provideEffects([
      TrackEffects
    ])
  ]
}).catch(err => console.error(err));
