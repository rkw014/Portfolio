package com.rk.portfolio.blog_service.service;

import com.rk.portfolio.blog_service.model.BlogPost;
import com.rk.portfolio.blog_service.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class BlogService {

    private static final String BLOG_CACHE_KEY = "BLOG_POST::";

    @Autowired
    private BlogPostRepository blogPostRepository;

//    @Autowired
//    private RedisTemplate<String, Object> redisTemplate;

    @CachePut(value = "blog", key = "#result.id")
    public BlogPost saveOrUpdate(BlogPost blogPost) {
        BlogPost saved = blogPostRepository.save(blogPost);
        return saved;
    }

    @Cacheable(value = "blog", key = "#id")
    public Optional<BlogPost> findById(Long id) {
        Optional<BlogPost> post = blogPostRepository.findById(id);
        return post;
    }

    @CacheEvict(value = "blog", key = "#id")
    public void delete(Long id) {
        blogPostRepository.deleteById(id);
    }
}
