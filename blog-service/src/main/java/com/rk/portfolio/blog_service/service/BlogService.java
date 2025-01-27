package com.rk.portfolio.blog_service.service;

import com.rk.portfolio.blog_service.model.BlogPost;
import com.rk.portfolio.blog_service.repository.BlogPostRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class BlogService {

    private static final String blogHashKey = "PortfolioBlogs";

    @Autowired
    private BlogPostRepository blogPostRepository;


    // // inject the template as ListOperations
    // @Resource(name="redisTemplate")
    // private HashOperations<String, String, List<BlogPost>> hashOps;

    @Autowired
    private RedisTemplate<String, Object> template;

    @Transactional
    // @CachePut(value = "blog", key = "#result.id")
    public BlogPost save(BlogPost blogPost) {
        BlogPost saved = blogPostRepository.save(blogPost);
        template.delete(getRedisKey("posts"));
        template.delete(getRedisKey(saved.getId()));
        return saved;
    }

    @Transactional
    // @CachePut(value = "blog", key = "#result.id")
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
        template.delete(getRedisKey("posts"));
        template.delete(getRedisKey(id));
        return saved;
    }

    // @Cacheable(value = "blog", key = "#id")
    public Optional<BlogPost> findById(Long id) {
        log.debug(id.toString());
        BlogPost post = (BlogPost) template.opsForValue().get(getRedisKey(id));
        if (post == null){
            Optional<BlogPost> postDB = blogPostRepository.findById(id);
            if (postDB.isPresent()){
                template.opsForValue().set(getRedisKey(id), postDB.get());
                return postDB;
            }else{
                template.opsForValue().set(getRedisKey(id), BlogPost.emptyPost);
                return Optional.empty();
            }
        }else if (post == BlogPost.emptyPost){
            return Optional.empty();
        }
        return Optional.of(post);
    }

    public List<BlogPost> findAll() {
        List<BlogPost> posts = (List<BlogPost>) template.opsForValue().get(getRedisKey("posts") );
        if (posts == null || posts.size() == 0){
            List<BlogPost> postsDB = blogPostRepository.findAll();
            template.opsForValue().set(getRedisKey("posts"), postsDB);
            posts = postsDB;
        }
        return posts;
    }

    @Transactional
    // @CacheEvict(value = "blog", key = "#id")
    public void delete(Long id) {
        blogPostRepository.deleteById(id);
        template.delete(getRedisKey("posts"));
        template.delete(getRedisKey(id));
    }

    private String getRedisKey(String val){
        return blogHashKey + val;
    }
    private String getRedisKey(Long id){
        return blogHashKey + id.toString();
    }
}
