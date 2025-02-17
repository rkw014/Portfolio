package com.rk.portfolio.blog_service.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rk.portfolio.blog_service.model.Project;
import com.rk.portfolio.blog_service.repository.ProjectRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ProjectService {
  private static final String REDIS_KEY_PREFIX = "PortfolioProjects:";

  @Autowired
  private ProjectRepository projectRepository;

  @Autowired
  private RedisTemplate<String, Object> redisTemplate;

  @Transactional
  public Project save(Project project) {
    Project saved = projectRepository.save(project);
    evictRelatedCache(saved.getId());
    return saved;
  }

  @Transactional
  public Project update(UUID id, Project updated) {
    return projectRepository.findById(id)
        .map(existing -> {
          updateProjectFields(existing, updated);
          Project saved = projectRepository.save(existing);
          evictRelatedCache(id);
          return saved;
        })
        .orElse(null);
  }

  public Optional<Project> findById(UUID id) {
    String key = getRedisKey(id);
    Project cached = (Project) redisTemplate.opsForValue().get(key);

    if (cached != null) {
      return Optional.of(cached);
    }

    Optional<Project> project = projectRepository.findById(id);
    project.ifPresent(p -> redisTemplate.opsForValue().set(key, p));
    return project;
  }

  public List<Project> findAll() {
    String key = getRedisKey("all");
    List<Project> cached = (List<Project>) redisTemplate.opsForValue().get(key);

    if (cached == null || cached.isEmpty()) {
      List<Project> projects = projectRepository.findAll();
      redisTemplate.opsForValue().set(key, projects);
      return projects;
    }
    return cached;
  }

  @Transactional
  public void delete(UUID id) {
    projectRepository.deleteById(id);
    evictRelatedCache(id);
  }

  private void updateProjectFields(Project existing, Project updated) {
    existing.setTitle(updated.getTitle());
    existing.setYear(updated.getYear());
    existing.setImgUrl(updated.getImgUrl());
    existing.setLink(updated.getLink());
    existing.setDescription(updated.getDescription());
    existing.setContent(updated.getContent());
    existing.setCategory(updated.getCategory());
    existing.setPublished(updated.isPublished());
    existing.setUpdatedAt(LocalDate.now());
  }

  private void evictRelatedCache(UUID id) {
    redisTemplate.delete(getRedisKey(id));
    redisTemplate.delete(getRedisKey("all"));
  }

  private String getRedisKey(UUID id) {
    return REDIS_KEY_PREFIX + id.toString();
  }

  private String getRedisKey(String type) {
    return REDIS_KEY_PREFIX + type;
  }
}