package org.example.musicstream.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.musicstream.dto.TrackCreateDTO;
import org.example.musicstream.dto.TrackResponseDTO;
import org.example.musicstream.dto.TrackUpdateDTO;
import org.example.musicstream.entity.Track;
import org.example.musicstream.exception.ResourceNotFoundException;
import org.example.musicstream.mapper.TrackMapper;
import org.example.musicstream.repository.TrackRepository;
import org.example.musicstream.service.FileStorageService;
import org.example.musicstream.service.TrackService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TrackServiceImpl implements TrackService {

    private final TrackRepository trackRepository;
    private final TrackMapper trackMapper;
    private final FileStorageService fileStorageService;

    @Override
    public TrackResponseDTO createTrack(TrackCreateDTO dto) {

        Track track = Track.builder()
                .title(dto.title())
                .artist(dto.artist())
                .description(dto.description() != null ? dto.description() : "")
                .category(dto.category())
                .duration(0L)
                .fileName("")
                .filePath("")
                .mimeType("")
                .fileSize(0L)
                .createdAt(LocalDateTime.now())
                .build();

        return trackMapper.toDto(trackRepository.save(track));
    }

    @Override
    @Transactional(readOnly = true)
    public TrackResponseDTO getTrackById(Long id) {
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id " + id));

        return trackMapper.toDto(track);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrackResponseDTO> getAllTracks() {
        return trackRepository.findAll()
                .stream()
                .map(trackMapper::toDto)
                .toList();
    }

    @Override
    public TrackResponseDTO updateTrack(Long id, TrackUpdateDTO dto) {

        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id " + id));

        track.setTitle(dto.title());
        track.setArtist(dto.artist());
        track.setDescription(dto.description());
        track.setCategory(dto.category());

        return trackMapper.toDto(trackRepository.save(track));
    }

    @Override
    public TrackResponseDTO uploadAudioFile(Long id, MultipartFile file) throws IOException {
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id " + id));

        // Delete old file if exists
        if (track.getFilePath() != null) {
            fileStorageService.deleteFile(track.getFilePath());
        }

        // Validate and store new file
        fileStorageService.validateAudioFile(file);
        String filePath = fileStorageService.storeFile(file, id);
        Long duration = fileStorageService.getAudioDuration(file);

        // Update track with file information
        track.setFilePath(filePath);
        track.setFileName(file.getOriginalFilename());
        track.setFileSize(file.getSize());
        track.setMimeType(file.getContentType());
        track.setDuration(duration);

        return trackMapper.toDto(trackRepository.save(track));
    }

    @Override
    public void deleteTrack(Long id) {

        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id " + id));

        // Delete associated file if exists
        if (track.getFilePath() != null) {
            try {
                fileStorageService.deleteFile(track.getFilePath());
            } catch (IOException e) {
                // Log error but continue with track deletion
                System.err.println("Failed to delete file: " + e.getMessage());
            }
        }

        trackRepository.deleteById(id);
    }
}
