package org.example.musicstream.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.parser.mp3.Mp3Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.example.musicstream.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "audio/mpeg",
            "audio/mp3",
            "audio/wav",
            "audio/ogg",
            "audio/x-wav",
            "audio/vnd.wav");

    @Value("${storage.upload-dir:uploads/}")
    private String uploadDir;

    @Override
    public String storeFile(MultipartFile file, Long trackId) throws IOException {
        validateAudioFile(file);

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = trackId + "_" + UUID.randomUUID().toString() + fileExtension;

        // Store file
        Path targetLocation = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        log.info("File stored successfully: {}", uniqueFilename);
        return uniqueFilename;
    }

    @Override
    public void deleteFile(String filePath) throws IOException {
        if (filePath == null || filePath.isEmpty()) {
            return;
        }

        Path path = Paths.get(uploadDir).resolve(filePath);
        if (Files.exists(path)) {
            Files.delete(path);
            log.info("File deleted successfully: {}", filePath);
        }
    }

    @Override
    public Long getAudioDuration(MultipartFile file) throws IOException {
        // For now, return 0 and let the frontend calculate duration from the audio
        // element
        // This prevents potential Tika parsing errors from blocking file uploads
        log.info("Audio duration will be calculated on the frontend");
        return 0L;

        /*
         * TODO: Implement proper duration extraction with Tika
         * try (InputStream inputStream = file.getInputStream()) {
         * BodyContentHandler handler = new BodyContentHandler();
         * Metadata metadata = new Metadata();
         * Parser parser = new Mp3Parser();
         * ParseContext parseContext = new ParseContext();
         * 
         * parser.parse(inputStream, handler, metadata, parseContext);
         * 
         * String duration = metadata.get("xmpDM:duration");
         * if (duration != null) {
         * return (long) (Double.parseDouble(duration) / 1000);
         * }
         * return 0L;
         * } catch (Exception e) {
         * log.error("Error extracting audio duration: {}", e.getMessage());
         * return 0L;
         * }
         */
    }

    @Override
    public void validateAudioFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of 10MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Invalid file type. Only audio files (MP3, WAV, OGG) are allowed");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || filename.contains("..")) {
            throw new IllegalArgumentException("Invalid filename");
        }
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return filename.substring(lastDotIndex);
        }
        return "";
    }
}
