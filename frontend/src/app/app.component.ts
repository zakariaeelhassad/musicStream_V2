import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, AudioPlayerComponent],
    template: `
    <div class="app-container">
      <router-outlet></router-outlet>
      <app-audio-player></app-audio-player>
    </div>
  `,
    styles: [`
    .app-container {
      min-height: 100vh;
      padding-bottom: 80px;
    }
  `]
})
export class AppComponent {
    title = 'MusicStream';
}
