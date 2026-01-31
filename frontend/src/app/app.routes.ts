import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/tracks',
        pathMatch: 'full'
    },
    {
        path: 'tracks',
        loadComponent: () =>
            import('./features/tracks/track-list/track-list.component').then(m => m.TrackListComponent)
    },
    {
        path: 'tracks/new',
        loadComponent: () =>
            import('./features/tracks/track-form/track-form.component').then(m => m.TrackFormComponent)
    },
    {
        path: 'tracks/:id/edit',
        loadComponent: () =>
            import('./features/tracks/track-form/track-form.component').then(m => m.TrackFormComponent)
    },
    {
        path: '**',
        redirectTo: '/tracks'
    }
];
