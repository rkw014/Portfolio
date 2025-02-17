package com.rk.portfolio.blog_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;
import org.hibernate.annotations.UuidGenerator.Style;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "projects")
public class Project implements Serializable{
    @Serial
    @JsonIgnore
    private static final long serialVersionUID = 10L;

    @Id
    @GeneratedValue
    @UuidGenerator(style = Style.RANDOM)
    @Column(columnDefinition = "CHAR(36)", updatable = false, nullable = false)
    private UUID id;
    
    @Column(nullable = false)
    private String title = "";

    @Column(nullable = false)
    private String year = "";

    @Column(name="img_url", nullable = false)
    private String imgUrl = "#";
    
    @Column(nullable = false)
    private String link = "#";

    @Column(columnDefinition = "TEXT")
    private String description = "";

    @Column(nullable = false)
    private String content = "";

    @Column(nullable = false)
    private String category = "";

    @Column(nullable = false)
    private boolean published = false;


    @Column(name = "created_at")
    @JsonIgnore
    private LocalDate createdAt;

    @Column(name = "updated_at")
    @JsonIgnore
    private LocalDate updatedAt;

    
    @Version
    @JsonIgnore
    private Long version;
    
}