package com.example.projectTap.repositories;

import com.example.projectTap.entities.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface PhotoRepository extends JpaRepository<Photo, Integer> {
    List<Photo> findByPostId(Integer postId);

    Photo findByUserId(Integer userId);

    void deleteByPostId(Integer postId);
}
