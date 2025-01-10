package com.rk.portfolio.blog_service.service;

import com.rk.portfolio.blog_service.model.BlogPost;
import com.rk.portfolio.blog_service.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class BlogService {

    private static final String BLOG_CACHE_KEY = "BLOG_POST::";

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public BlogPost saveOrUpdate(BlogPost blogPost) {
        BlogPost saved = blogPostRepository.save(blogPost);
        // Cache the result with a TTL
        redisTemplate.opsForValue().set(BLOG_CACHE_KEY + saved.getId(), saved, 10, TimeUnit.MINUTES);
        return saved;
    }

    public Optional<BlogPost> findById(Long id) {
        String key = BLOG_CACHE_KEY + id;
        BlogPost cached = (BlogPost) redisTemplate.opsForValue().get(key);
        if (cached != null) {
            return Optional.of(cached);
        }
        Optional<BlogPost> post = blogPostRepository.findById(id);
        post.ifPresent(p -> redisTemplate.opsForValue().set(key, p, 10, TimeUnit.MINUTES));
        return post;
    }

    public void delete(Long id) {
        blogPostRepository.deleteById(id);
        redisTemplate.delete(BLOG_CACHE_KEY + id);
    }
}
