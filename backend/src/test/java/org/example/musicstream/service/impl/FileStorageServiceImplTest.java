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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

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

        assertThat(filename).isNotNull();
        assertThat(filename).contains("1_");
        assertThat(filename).endsWith(".mp3");
        assertThat(Files.exists(tempDir.resolve(filename))).isTrue();
    }

    @Test
    void storeFile_WithEmptyFile_ShouldThrowException() {
        MultipartFile file = new MockMultipartFile("file", "test.mp3", "audio/mpeg", new byte[0]);

        assertThatThrownBy(() -> fileStorageService.storeFile(file, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("File cannot be empty");
    }

    @Test
    void storeFile_WithInvalidFileType_ShouldThrowException() {
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "test content".getBytes());

        assertThatThrownBy(() -> fileStorageService.storeFile(file, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid file type");
    }

    @Test
    void storeFile_WithOversizedFile_ShouldThrowException() {
        byte[] largeContent = new byte[11 * 1024 * 1024];
        MultipartFile file = new MockMultipartFile(
                "file",
                "large.mp3",
                "audio/mpeg",
                largeContent);

        assertThatThrownBy(() -> fileStorageService.storeFile(file, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("File size exceeds maximum");
    }

    @Test
    void deleteFile_WhenFileExists_ShouldDeleteSuccessfully() throws IOException {
        Path testFile = tempDir.resolve("test-file.mp3");
        Files.createFile(testFile);
        assertThat(Files.exists(testFile)).isTrue();

        fileStorageService.deleteFile("test-file.mp3");

        assertThat(Files.exists(testFile)).isFalse();
    }

    @Test
    void deleteFile_WhenFileDoesNotExist_ShouldNotThrowException() {
        assertThatThrownBy(() -> fileStorageService.deleteFile("non-existent.mp3"))
                .doesNotThrowAnyException();
    }

    @Test
    void deleteFile_WithNullPath_ShouldNotThrowException() {
        assertThatThrownBy(() -> fileStorageService.deleteFile(null))
                .doesNotThrowAnyException();
    }

    @Test
    void getAudioDuration_ShouldReturnZero() throws IOException {
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.mp3",
                "audio/mpeg",
                "test content".getBytes());

        Long duration = fileStorageService.getAudioDuration(file);

        assertThat(duration).isEqualTo(0L);
    }

    @Test
    void validateAudioFile_WithValidFile_ShouldNotThrowException() {
        MultipartFile file = new MockMultipartFile(
                "file",
                "test.mp3",
                "audio/mpeg",
                "test content".getBytes());

        assertThatThrownBy(() -> fileStorageService.validateAudioFile(file))
                .doesNotThrowAnyException();
    }

    @Test
    void validateAudioFile_WithInvalidFilename_ShouldThrowException() {
        MultipartFile file = new MockMultipartFile(
                "file",
                "../test.mp3",
                "audio/mpeg",
                "test content".getBytes());

        assertThatThrownBy(() -> fileStorageService.validateAudioFile(file))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid filename");
    }
}
