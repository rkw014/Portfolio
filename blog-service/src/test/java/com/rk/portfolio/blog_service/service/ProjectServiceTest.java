package com.rk.portfolio.blog_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;

import com.rk.portfolio.blog_service.model.Project;
import com.rk.portfolio.blog_service.repository.ProjectRepository;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

  @Mock
  private ProjectRepository projectRepository;

  @Mock
  private RedisTemplate<String, Object> redisTemplate;

  @InjectMocks
  private ProjectService projectService;

  @Test
  void findById_shouldReturnCachedProject() {
    // Mock数据
    Project mockProject = new Project();
    UUID uuid = UUID.randomUUID();
    mockProject.setId(uuid);
    when(
        redisTemplate
            .opsForValue()
            .get("PortfolioProjects:" + uuid.toString()))
        .thenReturn(mockProject);

    Optional<Project> result = projectService.findById(uuid);
    assertTrue(result.isPresent());
    assertEquals(uuid, result.get().getId());
  }

  @Test
  void shouldGenerateUUIDWhenSaving() {
    Project project = new Project();
    project.setTitle("Test Project");

    Project saved = projectService.save(project);

    assertNotNull(saved.getId());
    assertEquals(36, saved.getId().toString().length());
  }
}