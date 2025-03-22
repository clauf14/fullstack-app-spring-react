package com.example.projectTap.controller;

import com.example.projectTap.entities.Photo;
import com.example.projectTap.services.PhotoService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLOutput;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/photos")
public class PhotoController {
    @Autowired
    private PhotoService photoService;

    @GetMapping("/display/{photoId}")
    @Transactional
    public ResponseEntity<byte[]> displayImage(@PathVariable("photoId") Integer id) {
        Photo photo = photoService.viewById(id);

        if (photo.getImage() == null || photo.getImage().length == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(photo.getImage());
    }

    @GetMapping("/display/{postId}/{photoId}")
    @Transactional
    public ResponseEntity<byte[]> displayImageByPostId(@PathVariable("postId") Integer postId,
                                                        @PathVariable("photoId") Integer photoId) {
        List<Photo> photos = photoService.viewByPostId(postId);
        Optional<Photo> optionalPhoto = photos.stream().filter(photo -> photo.getPhotoId().equals(photoId)).findFirst();

        if (optionalPhoto.isPresent()) {
            Photo photo = optionalPhoto.get();
            byte[] imageBytes = photo.getImage();
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all/post/{postId}")
    @Transactional
    public ResponseEntity<List<Photo>> getAllPhotosByPostId(@PathVariable("postId") Integer postId) {
        List<Photo> photos = photoService.viewByPostId(postId);
        return ResponseEntity.ok().body(photos);
    }

    // view All images
    @GetMapping("/all")
    public List<Photo> getImageList() {
        return photoService.viewAll();
    }

    // add image - post
    @PostMapping("/add/post")
    public void addImagePost(@RequestParam("image") MultipartFile file,
                                                @RequestParam("postId") Integer postId) throws IOException {
        System.out.println("Received postId: " + postId);
        System.out.println("Received file: " + file.getOriginalFilename());

        byte[] bytes = file.getBytes();
        Photo photo = new Photo();
        photo.setImage(bytes);
        photo.setPostId(postId);

//        Photo createdPhoto =
//        return ResponseEntity.ok().body(createdPhoto.getPhotoId());
        photoService.create(photo);
    }

    //add image with return of newly created photo id
    @PostMapping("/add")
    public ResponseEntity<Integer> addImage(@RequestParam("image") MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        Photo photo = new Photo();
        photo.setImage(bytes);
        Photo savedPhoto = photoService.create(photo);
        System.out.println(savedPhoto.getPhotoId());
        return ResponseEntity.ok().body(savedPhoto.getPhotoId());
    }

    @DeleteMapping("/delete/{photoId}")
    public void deleteOneImage(@PathVariable("photoId") Integer photoId){
        photoService.delete(photoId);
    }
}
