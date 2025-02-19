package com.rk.portfolio.blog_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.time.Duration;

@Service
public class S3Service {

    @Autowired
    private S3Presigner s3Presigner;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public URL generatePresignedUploadUrl(String objectKey) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName.trim())
                .key(objectKey.trim())
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .putObjectRequest(putObjectRequest)
                .signatureDuration(Duration.ofMinutes(15)) // 15 minutes
                .build();

        return s3Presigner.presignPutObject(presignRequest).url();

    }
}
