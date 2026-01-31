import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from './features/player/audio-player/audio-player.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, AudioPlayerComponent],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header class="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div class="container mx-auto px-4 py-4">
          <h1 class="text-3xl font-bold text-white">
            <span class="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              MusicStream
            </span>
          </h1>
        </div>
      </header>

      <main class="container mx-auto px-4 py-8">
        <router-outlet />
      </main>

      <app-audio-player class="fixed bottom-0 left-0 right-0" />
    </div>
  `,
    styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
    title = 'MusicStream';
}
