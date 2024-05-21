package com.example.projectTap.controller;

import com.example.projectTap.entities.Photo;
import com.example.projectTap.entities.Post;
import com.example.projectTap.services.PostService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    record NewPostRequest(String title, String description, Double price, String location,
                          Integer userId,Integer subcategoryId, Date created, String status, String currency){}

    record ExistingPostRequest(String title, String description, Double price, String location,
                           String status, String currency){}

    @GetMapping("/all")
    public List<Post> getPostsList() {
        return postService.viewAll();
    }

    @GetMapping("/{postId}")
    public Post getOnePost(@PathVariable("postId") Integer postId) {
        return postService.viewById(postId);
    }

    @GetMapping("/all/{subcategoryId}")
    public List<Post> getPostsBySubcategory(@PathVariable("subcategoryId") Integer subcategoryId) {
        return postService.viewBySubcategoryId(subcategoryId);
    }

    @GetMapping("/all/user/{userId}")
    public List<Post> getPostsByUser(@PathVariable("userId") Integer userId) {
        return postService.viewByUserId(userId);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addImagePost(@RequestBody NewPostRequest request) {
        try {
            Post post = new Post();
            post.setTitle(request.title);
            post.setDescription(request.description);
            post.setPrice(request.price);
            post.setLocation(request.location);
            post.setUserId(request.userId);
            post.setSubcategoryId(request.subcategoryId);
            post.setCreated(request.created);
            post.setStatus(request.status);
            post.setCurrency(request.currency);

            Post createdPost = postService.create(post);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost.getPostId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create post: " + e.getMessage());
        }
    }

    @PutMapping("/edit/{postId}")
    public ResponseEntity<?> updatePost(@RequestBody ExistingPostRequest request, @PathVariable("postId") Integer postId) {
        try {
            Post post = postService.viewById(postId);

            if (post == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
            }

            post.setTitle(request.title());
            post.setDescription(request.description());
            post.setPrice(request.price());
            post.setLocation(request.location());
            post.setStatus(request.status());
            post.setCurrency(request.currency());

            postService.updatePost(post);

            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the post");
        }
    }



    @Transactional
    @DeleteMapping("/delete/{postId}")
    public void deleteOnePost(@PathVariable("postId") Integer postId){
        postService.delete(postId);
    }

}
