package com.ooumitra.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Serves images uploaded via the local-disk fallback in S3Service
 * (used when no AWS credentials are configured).
 */
@RestController
public class UploadController {

    @Value("${app.upload.local-dir:uploads}")
    private String localDir;

    @GetMapping("/api/uploads/{folder}/{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable String folder, @PathVariable String filename) throws MalformedURLException {
        Path path = Path.of(localDir, folder, filename);
        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }
        Resource resource = new UrlResource(path.toUri());
        String contentType = "application/octet-stream";
        try {
            String probed = Files.probeContentType(path);
            if (probed != null) contentType = probed;
        } catch (Exception ignored) {
            // fall back to octet-stream
        }
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
    }
}
