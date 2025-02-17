package com.rk.portfolio.blog_service.controller;

import com.rk.portfolio.blog_service.dto.PresignedResp;
import com.rk.portfolio.blog_service.model.BlogPost;
import com.rk.portfolio.blog_service.service.BlogService;
import com.rk.portfolio.blog_service.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @Autowired
    private S3Service s3Service;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${cloud.aws.region}")
    private String bucketRegion;

    @GetMapping
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("blog got");
    }

    @PostMapping
    public ResponseEntity<BlogPost> createPost(@RequestBody BlogPost post) {
        BlogPost saved = blogService.save(post);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id, @RequestBody BlogPost updated) {
        BlogPost saved = blogService.update(id, updated);
        if (saved == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getPost(@PathVariable Long id) {
        Optional<BlogPost> post = blogService.findById(id);
        return post.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<BlogPost>> listPosts() {
        List<BlogPost> posts = blogService.findAll();
        return ResponseEntity.ok(posts);
    }

    /**
     * Returns a pre-signed URL for the frontend to directly upload an image to S3.
     * 
     * Requests to this endpoint has been validated through gateway's cognito:groups
     * validatioin
     *
     * @param filename name of the file user wants to upload
     */
    @GetMapping("/presign")
    public ResponseEntity<PresignedResp> presignUpload(@RequestParam String filename) {
        // Best practice: Generate unique object keys if needed, e.g., with a user ID or
        // timestamp
        String objectKey = "uploads/blog-images/" + filename;
        URL presignedUrl = s3Service.generatePresignedUploadUrl(objectKey);
        String downloadUrl = "https://" + bucketName + ".s3."
                + bucketRegion + ".amazonaws.com/" + objectKey;
        return ResponseEntity.ok(
                new PresignedResp(
                        presignedUrl.toString(),
                        downloadUrl));
    }
}
