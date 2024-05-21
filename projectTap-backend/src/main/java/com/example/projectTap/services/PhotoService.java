package com.example.projectTap.services;

import com.example.projectTap.entities.Photo;
import com.example.projectTap.repositories.PhotoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    public Photo create(Photo photo){
       return photoRepository.save(photo);
    }

    @Transactional
    public List<Photo> viewAll(){
        return photoRepository.findAll();
    }

    public Photo viewById(Integer id){
        return photoRepository.findById(id).get();
    }

    public List<Photo> viewByPostId(Integer postId){
        return photoRepository.findByPostId(postId);
    }

    public void delete(Integer photoId) {
        photoRepository.deleteById(photoId);
    }
}
