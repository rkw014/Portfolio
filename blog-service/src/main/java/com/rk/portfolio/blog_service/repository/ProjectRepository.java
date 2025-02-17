package com.rk.portfolio.blog_service.repository;

import com.rk.portfolio.blog_service.model.Project;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
}
