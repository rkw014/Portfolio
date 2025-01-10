package com.rk.portfolio.blog_service.repository;

import com.rk.portfolio.blog_service.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
}
