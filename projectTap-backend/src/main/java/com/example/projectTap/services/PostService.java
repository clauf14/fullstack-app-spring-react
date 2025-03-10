package com.example.projectTap.services;

import com.example.projectTap.entities.Photo;
import com.example.projectTap.entities.Post;
import com.example.projectTap.repositories.PhotoRepository;
import com.example.projectTap.repositories.PostRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private PhotoRepository photoRepository;

    public Post create(Post post) {
        Post createdPost = postRepository.save(post);
        return createdPost;
    }

    public List<Post> viewAll(){
        return postRepository.findAll();
    }

    public Post viewById(Integer id){
        return postRepository.findById(id).get();
    }

    public List<Post> viewBySubcategoryId(Integer subcategoryId){
        return postRepository.findBySubcategoryId(subcategoryId);
    }

    public List<Post> viewByUserId(Integer userId) {
        return postRepository.findByUserId(userId);
    }

    @Transactional
    public String delete(Integer id) {
        photoRepository.deleteByPostId(id);
        postRepository.deleteById(id);
        return "deleted";
    }

    public Post updatePost(Post post) {
        return postRepository.save(post);
    }
}
