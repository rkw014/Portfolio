package com.rk.portfolio.blog_service.controller;

import com.rk.portfolio.blog_service.model.Project;
import com.rk.portfolio.blog_service.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

  @Autowired
  private ProjectService projectService;

  @PostMapping
  public ResponseEntity<Project> createProject(@RequestBody Project project) {
    if (project.getId() != null) {
      return ResponseEntity.badRequest().build();
    }
    project.setCreatedAt(LocalDate.now());
    return ResponseEntity.ok(projectService.save(project));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Project> updateProject(
      @PathVariable UUID id,
      @RequestBody Project updated) {
    if (!id.equals(updated.getId())) {
      return ResponseEntity.badRequest().build();
    }
    Project result = projectService.update(id, updated);
    return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Project> getProject(@PathVariable UUID id) {
    return projectService.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/all")
  public ResponseEntity<List<Project>> getAllProjects() {
    return ResponseEntity.ok(projectService.findAll());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
    projectService.delete(id);
    return ResponseEntity.noContent().build();
  }
}