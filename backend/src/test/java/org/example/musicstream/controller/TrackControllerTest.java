package org.example.musicstream.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.musicstream.dto.TrackCreateDTO;
import org.example.musicstream.dto.TrackResponseDTO;
import org.example.musicstream.dto.TrackUpdateDTO;
import org.example.musicstream.service.TrackService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TrackController.class)
class TrackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TrackService trackService;

    @Test
    void createTrack_ShouldReturnCreatedTrack() throws Exception {
        TrackCreateDTO createDTO = new TrackCreateDTO("Test Track", "Test Artist", "Rock", "Description");
        TrackResponseDTO responseDTO = new TrackResponseDTO(1L, "Test Track", "Test Artist", "Rock", "Description", 0L,
                null, null);

        when(trackService.createTrack(any(TrackCreateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(post("/api/tracks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Track"))
                .andExpect(jsonPath("$.artist").value("Test Artist"));

        verify(trackService).createTrack(any(TrackCreateDTO.class));
    }

    @Test
    void getAllTracks_ShouldReturnListOfTracks() throws Exception {
        List<TrackResponseDTO> tracks = Arrays.asList(
                new TrackResponseDTO(1L, "Track 1", "Artist 1", "Rock", "Desc 1", 180L, null, null),
                new TrackResponseDTO(2L, "Track 2", "Artist 2", "Pop", "Desc 2", 200L, null, null));

        when(trackService.getAllTracks()).thenReturn(tracks);

        mockMvc.perform(get("/api/tracks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Track 1"))
                .andExpect(jsonPath("$[1].title").value("Track 2"));

        verify(trackService).getAllTracks();
    }

    @Test
    void getTrackById_ShouldReturnTrack() throws Exception {
        TrackResponseDTO responseDTO = new TrackResponseDTO(1L, "Test Track", "Test Artist", "Rock", "Description",
                180L, null, null);

        when(trackService.getTrackById(1L)).thenReturn(responseDTO);

        mockMvc.perform(get("/api/tracks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Track"));

        verify(trackService).getTrackById(1L);
    }

    @Test
    void updateTrack_ShouldReturnUpdatedTrack() throws Exception {
        TrackUpdateDTO updateDTO = new TrackUpdateDTO("Updated Track", "Updated Artist", "Pop", "Updated desc", 200L);
        TrackResponseDTO responseDTO = new TrackResponseDTO(1L, "Updated Track", "Updated Artist", "Pop",
                "Updated desc", 200L, null, null);

        when(trackService.updateTrack(eq(1L), any(TrackUpdateDTO.class))).thenReturn(responseDTO);

        mockMvc.perform(put("/api/tracks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Track"));

        verify(trackService).updateTrack(eq(1L), any(TrackUpdateDTO.class));
    }

    @Test
    void deleteTrack_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/tracks/1"))
                .andExpect(status().isNoContent());

        verify(trackService).deleteTrack(1L);
    }

    @Test
    void uploadAudio_ShouldReturnUpdatedTrack() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.mp3",
                "audio/mpeg",
                "test content".getBytes());

        TrackResponseDTO responseDTO = new TrackResponseDTO(1L, "Test Track", "Test Artist", "Rock", "Description",
                180L, "test.mp3", "http://localhost/api/tracks/1/stream");

        when(trackService.uploadAudioFile(eq(1L), any())).thenReturn(responseDTO);

        mockMvc.perform(multipart("/api/tracks/1/upload")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.filePath").value("test.mp3"));

        verify(trackService).uploadAudioFile(eq(1L), any());
    }
}
