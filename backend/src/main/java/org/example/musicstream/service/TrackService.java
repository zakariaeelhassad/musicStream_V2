package org.example.musicstream.service;

import org.example.musicstream.dto.TrackCreateDTO;
import org.example.musicstream.dto.TrackResponseDTO;
import org.example.musicstream.dto.TrackUpdateDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface TrackService {

    TrackResponseDTO createTrack(TrackCreateDTO dto);

    TrackResponseDTO getTrackById(Long id);

    List<TrackResponseDTO> getAllTracks();

    TrackResponseDTO updateTrack(Long id, TrackUpdateDTO dto);

    TrackResponseDTO uploadAudioFile(Long id, MultipartFile file) throws IOException;

    void deleteTrack(Long id);
}
