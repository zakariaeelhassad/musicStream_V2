import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app/app.routes';
import { reducers } from './app/store';
import { TrackEffects } from './app/store/track/track.effects';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideStore(reducers),
        provideEffects([TrackEffects]),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: false,
        }),
    ]
}).catch(err => console.error(err));
