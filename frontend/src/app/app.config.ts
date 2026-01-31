import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { trackReducer } from './store/tracks/track.reducer';
import { playerReducer } from './store/player/player.reducer';
import { TrackEffects } from './store/tracks/track.effects';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(),
        provideStore({
            tracks: trackReducer,
            player: playerReducer
        }),
        provideEffects([TrackEffects]),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: false,
            traceLimit: 75
        })
    ]
};
