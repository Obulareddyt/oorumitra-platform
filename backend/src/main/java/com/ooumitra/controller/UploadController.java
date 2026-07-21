package com.ooumitra.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Serves media files (images & voice notes) uploaded via local-disk fallback in S3Service.
 * Supports multi-level folder paths and proper audio streaming content types.
 */
@RestController
public class UploadController {

    @Value("${app.upload.local-dir:uploads}")
    private String localDir;

    @GetMapping("/api/uploads/**")
    public ResponseEntity<Resource> getFile(HttpServletRequest request) throws MalformedURLException {
        String fullPath = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String relativePath = fullPath != null ? fullPath.replaceFirst("^/api/uploads/?", "") : "";
        
        Path path = Path.of(localDir, relativePath);
        if (!Files.exists(path) || Files.isDirectory(path)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(path.toUri());
        String filename = path.getFileName().toString().toLowerCase();
        
        String contentType = "application/octet-stream";

        // Explicit audio mime-type resolution for audio playback
        if (filename.endsWith(".webm")) {
            contentType = "audio/webm";
        } else if (filename.endsWith(".wav")) {
            contentType = "audio/wav";
        } else if (filename.endsWith(".mp3")) {
            contentType = "audio/mpeg";
        } else if (filename.endsWith(".m4a") || filename.endsWith(".mp4")) {
            contentType = "audio/mp4";
        } else if (filename.endsWith(".ogg")) {
            contentType = "audio/ogg";
        } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            contentType = "image/jpeg";
        } else if (filename.endsWith(".png")) {
            contentType = "image/png";
        } else if (filename.endsWith(".webp")) {
            contentType = "image/webp";
        } else {
            try {
                String probed = Files.probeContentType(path);
                if (probed != null) contentType = probed;
            } catch (Exception ignored) {}
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + path.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
