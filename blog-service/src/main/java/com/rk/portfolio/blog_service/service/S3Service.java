package com.rk.portfolio.blog_service.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.time.Duration;

@Service
public class S3Service {

    @Value("${app.s3.bucket}")
    private String bucketName;

    public URL generatePresignedUploadUrl(String objectKey) {
        // S3Presigner can use the default credential provider chain (e.g., env vars, instance profile)
        try (S3Presigner presigner = S3Presigner.create()) {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    // Content type, ACL, etc. can be specified
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .putObjectRequest(putObjectRequest)
                    .signatureDuration(Duration.ofMinutes(15)) // 15 minutes
                    .build();

            return presigner.presignPutObject(presignRequest).url();
        }
    }
}
