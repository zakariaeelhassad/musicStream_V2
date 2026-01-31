import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Track, TrackCreateDTO, TrackUpdateDTO } from '../models/track.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TrackService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/tracks`;

    getAllTracks(): Observable<Track[]> {
        return this.http.get<Track[]>(this.apiUrl);
    }

    getTrackById(id: number): Observable<Track> {
        return this.http.get<Track>(`${this.apiUrl}/${id}`);
    }

    createTrack(dto: TrackCreateDTO): Observable<Track> {
        return this.http.post<Track>(this.apiUrl, dto);
    }

    updateTrack(id: number, dto: TrackUpdateDTO): Observable<Track> {
        return this.http.put<Track>(`${this.apiUrl}/${id}`, dto);
    }

    deleteTrack(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    uploadAudio(id: number, file: File): Observable<Track> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<Track>(`${this.apiUrl}/${id}/upload`, formData);
    }

    getStreamUrl(id: number): string {
        return `${this.apiUrl}/${id}/stream`;
    }
}
