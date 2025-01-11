package com.rk.portfolio.blog_service.controller;

import com.rk.portfolio.blog_service.model.BlogPost;
import com.rk.portfolio.blog_service.service.BlogService;
import com.rk.portfolio.blog_service.service.S3Service;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URL;
import java.util.Optional;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @Autowired
    private S3Service s3Service;

    @GetMapping
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("blog got");
    }

    @PostMapping
    @Transactional
    public ResponseEntity<BlogPost> createPost(@RequestBody BlogPost post) {
        BlogPost saved = blogService.saveOrUpdate(post);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id, @RequestBody BlogPost updated) {
        Optional<BlogPost> prevPost = blogService.findById(id);
        if(prevPost.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        BlogPost pPost = prevPost.get();
        pPost.setTitle(updated.getTitle());
        pPost.setPublished(updated.isPublished());
        pPost.setCoverImageUrl(updated.getCoverImageUrl());
        pPost.setContentMarkdown(updated.getContentMarkdown());
        BlogPost saved = blogService.saveOrUpdate(pPost);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<BlogPost> getPost(@PathVariable Long id) {
        Optional<BlogPost> post = blogService.findById(id);
        return post.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Returns a pre-signed URL for the frontend to directly upload an image to S3.
     *
     * @param filename name of the file user wants to upload
     */
//    @GetMapping("/presign")
//    @Transactional
//    public ResponseEntity<String> presignUpload(@RequestParam String filename) {
//        // Best practice: Generate unique object keys if needed, e.g., with a user ID or timestamp
//        String objectKey = "uploads/blog-images/" + filename;
//        URL presignedUrl = s3Service.generatePresignedUploadUrl(objectKey);
//        return ResponseEntity.ok(presignedUrl.toString());
//    }
}
