package com.example.projectTap.entities;

import jakarta.persistence.*;

import java.util.Arrays;

@Entity
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Integer photoId;

    @Lob
    private byte[] image;

    @Column(name = "post_id")
    private Integer postId;

    public Integer getPhotoId() {
        return photoId;
    }

    public void setPhotoId(Integer photoId) {
        this.photoId = photoId;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    @Override
    public String toString() {
        return "Photo{" +
                "photoId=" + photoId +
                ", image=" + Arrays.toString(image) +
                ", postId=" + postId +
                '}';
    }
}
