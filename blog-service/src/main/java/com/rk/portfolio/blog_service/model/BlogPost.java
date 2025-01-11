package com.rk.portfolio.blog_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost implements Serializable {
    @Serial
    private static final long serialVersionUID = 10L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String contentMarkdown; // store markdown

    // reference an S3 URL or object key
    private String coverImageUrl;

    private boolean published;

    @Version
    @JsonIgnore
    private Long version;
}

