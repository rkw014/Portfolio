package com.rk.portfolio.blog_service.service;

import com.rk.portfolio.blog_service.model.BlogPost;
import com.rk.portfolio.blog_service.repository.BlogPostRepository;

import jakarta.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BlogService {

    private static final String blogListHashKey = "PortfolioAllBlogs";

    @Autowired
    private BlogPostRepository blogPostRepository;

    // inject the actual operations
    @Autowired
    private RedisOperations<String, String> operations;

    // inject the template as ListOperations
    @Resource(name="redisTemplate")
    private HashOperations<String, String, List<BlogPost>> hashOps;

    @Transactional
    @CachePut(value = "blog", key = "#result.id")
    public BlogPost save(BlogPost blogPost) {
        BlogPost saved = blogPostRepository.save(blogPost);
        hashOps.delete(blogListHashKey, "posts");
        return saved;
    }

    @Transactional
    @CachePut(value = "blog", key = "#result.id")
    public BlogPost update(Long id, BlogPost updated){
        Optional<BlogPost> prevPost = blogPostRepository.findById(id);
        if(prevPost.isEmpty() ){
            return null;
        }
        BlogPost pPost = prevPost.get();
        pPost.setTitle(updated.getTitle());
        pPost.setPublished(updated.isPublished());
        pPost.setCoverImageUrl(updated.getCoverImageUrl());
        pPost.setContentMarkdown(updated.getContentMarkdown());
        BlogPost saved = blogPostRepository.save(pPost);
        hashOps.delete(blogListHashKey, "posts");
        return saved;
    }

    @Cacheable(value = "blog", key = "#id")
    public Optional<BlogPost> findById(Long id) {
        Optional<BlogPost> post = blogPostRepository.findById(id);
        return post;
    }

    public List<BlogPost> findAll() {
        List<BlogPost> posts = (List<BlogPost>) hashOps.get(blogListHashKey, "posts" );
        if (posts == null){
            List<BlogPost> postsDB = blogPostRepository.findAll();
            hashOps.put(blogListHashKey, "posts", postsDB);
            posts = postsDB;
        }
        return posts;
    }

    @Transactional
    @CacheEvict(value = "blog", key = "#id")
    public void delete(Long id) {
        blogPostRepository.deleteById(id);
        hashOps.delete(blogListHashKey, "posts");
    }
}
