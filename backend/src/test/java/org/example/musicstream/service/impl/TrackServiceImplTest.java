package org.example.musicstream.service.impl;

import org.example.musicstream.dto.TrackCreateDTO;
import org.example.musicstream.dto.TrackResponseDTO;
import org.example.musicstream.dto.TrackUpdateDTO;
import org.example.musicstream.entity.Track;
import org.example.musicstream.exception.ResourceNotFoundException;
import org.example.musicstream.mapper.TrackMapper;
import org.example.musicstream.repository.TrackRepository;
import org.example.musicstream.service.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrackServiceImplTest {

    @Mock
    private TrackRepository trackRepository;

    @Mock
    private TrackMapper trackMapper;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private TrackServiceImpl trackService;

    private Track track;
    private TrackCreateDTO createDTO;
    private TrackUpdateDTO updateDTO;
    private TrackResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        track = new Track();
        track.setId(1L);
        track.setTitle("Test Track");
        track.setArtist("Test Artist");
        track.setCategory("Rock");
        track.setDuration(180L);

        createDTO = new TrackCreateDTO("Test Track", "Test Artist", "Rock", "Test description");
        updateDTO = new TrackUpdateDTO("Updated Track", "Updated Artist", "Pop", "Updated description", 200L);
        responseDTO = new TrackResponseDTO(1L, "Test Track", "Test Artist", "Rock", "Test description", 180L, null,
                null);
    }

    @Test
    void createTrack_ShouldReturnCreatedTrack() {
        when(trackMapper.toEntity(any(TrackCreateDTO.class))).thenReturn(track);
        when(trackRepository.save(any(Track.class))).thenReturn(track);
        when(trackMapper.toResponseDTO(any(Track.class))).thenReturn(responseDTO);

        TrackResponseDTO result = trackService.createTrack(createDTO);

        assertThat(result).isNotNull();
        assertThat(result.title()).isEqualTo("Test Track");
        verify(trackRepository).save(any(Track.class));
    }

    @Test
    void getAllTracks_ShouldReturnListOfTracks() {
        List<Track> tracks = Arrays.asList(track);
        when(trackRepository.findAll()).thenReturn(tracks);
        when(trackMapper.toResponseDTO(any(Track.class))).thenReturn(responseDTO);

        List<TrackResponseDTO> result = trackService.getAllTracks();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("Test Track");
        verify(trackRepository).findAll();
    }

    @Test
    void getTrackById_WhenExists_ShouldReturnTrack() {
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));
        when(trackMapper.toResponseDTO(any(Track.class))).thenReturn(responseDTO);

        TrackResponseDTO result = trackService.getTrackById(1L);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        verify(trackRepository).findById(1L);
    }

    @Test
    void getTrackById_WhenNotExists_ShouldThrowException() {
        when(trackRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> trackService.getTrackById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Track not found");
    }

    @Test
    void updateTrack_WhenExists_ShouldReturnUpdatedTrack() {
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));
        when(trackRepository.save(any(Track.class))).thenReturn(track);
        when(trackMapper.toResponseDTO(any(Track.class))).thenReturn(responseDTO);

        TrackResponseDTO result = trackService.updateTrack(1L, updateDTO);

        assertThat(result).isNotNull();
        verify(trackRepository).save(any(Track.class));
    }

    @Test
    void deleteTrack_WhenExists_ShouldDeleteTrack() throws IOException {
        track.setFilePath("test-file.mp3");
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));

        trackService.deleteTrack(1L);

        verify(trackRepository).delete(track);
        verify(fileStorageService).deleteFile("test-file.mp3");
    }

    @Test
    void uploadAudioFile_WhenTrackExists_ShouldUploadAndReturnTrack() throws IOException {
        MultipartFile file = mock(MultipartFile.class);
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));
        when(fileStorageService.storeFile(any(), anyLong())).thenReturn("new-file.mp3");
        when(fileStorageService.getAudioDuration(any())).thenReturn(200L);
        when(trackRepository.save(any(Track.class))).thenReturn(track);
        when(trackMapper.toResponseDTO(any(Track.class))).thenReturn(responseDTO);

        TrackResponseDTO result = trackService.uploadAudioFile(1L, file);

        assertThat(result).isNotNull();
        verify(fileStorageService).storeFile(file, 1L);
        verify(trackRepository).save(any(Track.class));
    }
}
