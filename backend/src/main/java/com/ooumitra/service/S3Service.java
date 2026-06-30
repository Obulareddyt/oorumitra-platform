package com.ooumitra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Uploads to real S3 when AWS credentials are configured; otherwise falls
 * back to local disk storage (served by UploadController) so image upload
 * works out of the box without an AWS account.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.access-key}")
    private String accessKey;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.cdn-url}")
    private String cdnUrl;

    @Value("${app.upload.local-dir:uploads}")
    private String localDir;

    private boolean isS3Configured() {
        return !"your-access-key".equals(accessKey);
    }

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        return isS3Configured() ? uploadToS3(file, folder) : uploadToLocalDisk(file, folder);
    }

    public List<String> uploadFiles(List<MultipartFile> files, String folder) throws IOException {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(uploadFile(file, folder));
        }
        return urls;
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl.startsWith("/api/uploads/")) {
            try {
                Files.deleteIfExists(Path.of(localDir, fileUrl.replace("/api/uploads/", "")));
            } catch (IOException e) {
                log.warn("Failed to delete local file {}: {}", fileUrl, e.getMessage());
            }
            return;
        }
        String key = fileUrl.replace(cdnUrl + "/", "");
        s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucketName).key(key).build());
    }

    private String uploadToS3(MultipartFile file, String folder) throws IOException {
        String key = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType())
                        .contentLength(file.getSize())
                        .build(),
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        return cdnUrl + "/" + key;
    }

    private String uploadToLocalDisk(MultipartFile file, String folder) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path dir = Path.of(localDir, folder);
        Files.createDirectories(dir);
        Files.copy(file.getInputStream(), dir.resolve(filename));
        return "/api/uploads/" + folder + "/" + filename;
    }
}
