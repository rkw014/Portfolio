package com.rk.portfolio.blog_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String contentMarkdown; // store markdown

    // reference an S3 URL or object key
    private String coverImageUrl;

    private boolean published;
}

