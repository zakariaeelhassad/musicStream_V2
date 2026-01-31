import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Track, TrackCreate, TrackUpdate } from '../models/track.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TrackApiService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/tracks`;

    getAllTracks(): Observable<Track[]> {
        return this.http.get<Track[]>(this.apiUrl);
    }

    getTrackById(id: number): Observable<Track> {
        return this.http.get<Track>(`${this.apiUrl}/${id}`);
    }

    createTrack(track: TrackCreate): Observable<Track> {
        return this.http.post<Track>(this.apiUrl, track);
    }

    updateTrack(id: number, track: TrackUpdate): Observable<Track> {
        return this.http.put<Track>(`${this.apiUrl}/${id}`, track);
    }

    deleteTrack(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    uploadAudioFile(trackId: number, file: File): Observable<Track> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<Track>(`${this.apiUrl}/${trackId}/upload`, formData);
    }

    getStreamUrl(trackId: number): string {
        return `${this.apiUrl}/${trackId}/stream`;
    }
}
