package org.example.musicstream.service.impl;

import org.example.musicstream.service.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileStorageServiceImplTest {

    private FileStorageService fileStorageService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageServiceImpl();
        ReflectionTestUtils.setField(fileStorageService, "uploadDir", tempDir.toString() + "/");
    }

    @Test
    void storeFile_WithValidAudioFile_ShouldStoreSuccessfully() throws IOException {
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.mp3",
                "audio/mpeg",
                "test audio content".getBytes());

        String filename = fileStorageService.storeFile(file, 1L);

        assertNotNull(filename);
        assertTrue(filename.contains("1_"));
        assertTrue(filename.endsWith(".mp3"));
        assertTrue(Files.exists(tempDir.resolve(filename)));
    }

    @Test
    void storeFile_WithEmptyFile_ShouldThrowException() {
        MultipartFile file = new MockMultipartFile("file", "test.mp3", "audio/mpeg", new byte[0]);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            fileStorageService.storeFile(file, 1L);
        });

        assertTrue(exception.getMessage().contains("File cannot be empty"));
    }

    @Test
    void storeFile_WithInvalidFileType_ShouldThrowException() {
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "test content".getBytes());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            fileStorageService.storeFile(file, 1L);
        });

        assertTrue(exception.getMessage().contains("Invalid file type"));
    }

    @Test
    void deleteFile_WhenFileExists_ShouldDeleteSuccessfully() throws IOException {
        Path testFile = tempDir.resolve("test-file.mp3");
        Files.createFile(testFile);
        assertTrue(Files.exists(testFile));

        fileStorageService.deleteFile("test-file.mp3");

        assertFalse(Files.exists(testFile));
    }

    @Test
    void deleteFile_WhenFileDoesNotExist_ShouldNotThrowException() throws IOException {
        assertDoesNotThrow(() -> fileStorageService.deleteFile("non-existent.mp3"));
    }

    @Test
    void deleteFile_WithNullPath_ShouldNotThrowException() throws IOException {
        assertDoesNotThrow(() -> fileStorageService.deleteFile(null));
    }

    @Test
    void getAudioDuration_ShouldReturnZero() throws IOException {
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.mp3",
                "audio/mpeg",
                "test content".getBytes());

        Long duration = fileStorageService.getAudioDuration(file);

        assertEquals(0L, duration);
    }

    @Test
    void validateAudioFile_WithValidFile_ShouldNotThrowException() {
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.mp3",
                "audio/mpeg",
                "test content".getBytes());

        assertDoesNotThrow(() -> fileStorageService.validateAudioFile(file));
    }

    @Test
    void validateAudioFile_WithInvalidFilename_ShouldThrowException() {
        MultipartFile file = new MockMultipartFile(
                "file",
                "../test.mp3",
                "audio/mpeg",
                "test content".getBytes());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            fileStorageService.validateAudioFile(file);
        });

        assertTrue(exception.getMessage().contains("Invalid filename"));
    }
}
