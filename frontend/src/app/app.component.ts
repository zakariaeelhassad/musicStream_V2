import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { AudioPlayerService } from './core/services/audio-player.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioPlayerComponent],
  template: `
    <router-outlet></router-outlet>
    <app-audio-player></app-audio-player>
  `
})
export class AppComponent {
  // Initialize audio player service to start syncing with store
  private audioPlayerService = inject(AudioPlayerService);
}
