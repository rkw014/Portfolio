package com.rk.portfolio.blog_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
public class S3Config {


    // Creating a bean for Amazon S3 presigner
    @Bean
    public S3Presigner s3Client() {
        S3Presigner s3 = S3Presigner.builder()
            .build();
            
        return s3;
    }
}