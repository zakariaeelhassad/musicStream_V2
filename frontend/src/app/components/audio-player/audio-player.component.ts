import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerService } from '../../core/services/audio-player.service';

@Component({
    selector: 'app-audio-player',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './audio-player.component.html',
    styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent {
    playerService = inject(AudioPlayerService);

    onProgressClick(event: MouseEvent): void {
        const progressBar = event.currentTarget as HTMLElement;
        const rect = progressBar.getBoundingClientRect();
        const percent = ((event.clientX - rect.left) / rect.width) * 100;
        this.playerService.seekToPercent(percent);
    }

    onVolumeChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.playerService.setVolume(parseFloat(input.value));
    }
}
